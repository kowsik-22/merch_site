# Graphique Merch — from Figma

Built from your Figma file (node `1:2`) using Next.js 14 (App Router) + Tailwind CSS.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Important — before you deploy

The product/hero images currently point to **temporary Figma export URLs**
(`figma.com/api/mcp/asset/...`). These expire ~7 days after export. To fix:

1. Download each image referenced in `lib/products.ts` and `components/Hero.tsx`.
2. Save them into `/public/products/` and `/public/hero/`.
3. Update the `image` fields / `IMG_*` constants to local paths, e.g. `/products/core-tee.png`.
4. Remove `unoptimized` from the `<Image />` components once served locally, so
   Next.js can optimize them.

## Google Sheets setup (required for order logging)

1. **Create the Sheet.** Make a new Google Sheet. In row 1, add these headers
   (matching the columns the code writes to):
   ```
   Timestamp | Order ID | Payment ID | Name | Email | Phone | Items | Total (₹)
   ```
   Rename the tab at the bottom from "Sheet1" to **Orders** (the code writes
   to a tab named `Orders`).

2. **Create a Google Cloud service account** (this is a "robot" account the
   code uses to write to the sheet on your behalf — no OAuth login flow
   needed):
   - Go to https://console.cloud.google.com/ and create a project (or use an existing one)
   - Enable the **Google Sheets API**: search "Google Sheets API" in the top search bar → Enable
   - Go to **APIs & Services → Credentials → Create Credentials → Service account**
   - Give it any name (e.g. "merch-site-orders"), skip the optional role/access steps
   - Open the service account you just created → **Keys** tab → **Add Key → Create new key → JSON**
   - This downloads a `.json` file — keep it safe, never commit it to git

3. **Share the Sheet with the service account.** Open the downloaded JSON,
   copy the `client_email` value (looks like
   `something@your-project.iam.gserviceaccount.com`). In your Google Sheet,
   click **Share** and add that email as an **Editor**.

4. **Fill in `.env.local`** using values from the JSON file:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = the `client_email` value
   - `GOOGLE_PRIVATE_KEY` = the `private_key` value, exactly as it appears
     (including the `\n` characters and the `-----BEGIN/END PRIVATE KEY-----`
     lines) — wrap the whole thing in double quotes
   - `GOOGLE_SHEET_ID` = the long ID in your sheet's URL, e.g. for
     `https://docs.google.com/spreadsheets/d/1AbCxyz.../edit` the ID is
     `1AbCxyz...`

5. Restart `npm run dev`. Complete a test payment — a new row should appear
   in your sheet within a couple seconds of the payment succeeding.

If the sheet write fails for any reason, the customer's order is **not**
affected — the payment is already verified by that point, and the error is
just logged to the server console so you can add the order manually or debug.

## Webhook setup (why orders get logged reliably)

**The problem this solves:** if a customer's payment succeeds but they close
the tab (or lose signal) before the browser finishes talking to your server,
the order would otherwise never get logged — even though they were genuinely
charged. Razorpay webhooks fix this: Razorpay's own servers call your server
directly the instant a payment is captured, independent of the customer's
browser. This is why order logging (`lib/excelOrders.ts` /
`lib/googleSheets.ts`) now happens in `app/api/razorpay/webhook/route.ts`
instead of in `verify-payment` — the browser-side call is just for a fast
redirect to the confirmation page.

**Set it up:**

1. In Razorpay Dashboard → **Settings → Webhooks → Add New Webhook**
2. Webhook URL: `https://yourdomain.com/api/razorpay/webhook` (needs to be a
   publicly reachable URL — see local testing below for dev)
3. Select the **`payment.captured`** event (that's the only one this app acts on)
4. Razorpay generates a webhook secret when you save it — copy that into
   `.env.local` as `RAZORPAY_WEBHOOK_SECRET`

**Testing locally:** your webhook URL can't be `localhost` — Razorpay's
servers need to reach it over the internet. Use a tunnel tool like
[ngrok](https://ngrok.com/):
```bash
ngrok http 3000
```
This gives you a temporary public URL (e.g. `https://abc123.ngrok.app`) —
use `https://abc123.ngrok.app/api/razorpay/webhook` as the webhook URL in
the Razorpay dashboard while testing. It changes each time you restart
ngrok on the free tier, so you'll need to update the dashboard URL again if
you restart it.

## Razorpay setup (required before checkout will work)

1. Create a free account at https://dashboard.razorpay.com/signup
2. Go to **Settings → API Keys** and generate a **Test mode** key pair.
3. Create a file named `.env.local` in the project root (copy `.env.example`)
   and paste in your keys:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_key_here
   ```
4. Restart `npm run dev` after adding/changing `.env.local` (Next.js only
   reads env files on startup).
5. Test payments: use Razorpay's test card `4111 1111 1111 1111`, any future
   expiry date, any CVV. Full list of test cards/UPI IDs:
   https://razorpay.com/docs/payments/payments/test-card-upi-details/
6. When you're ready to accept real payments, complete Razorpay's KYC/activation,
   generate **Live mode** keys, and swap them into `.env.local` (and into
   Vercel's environment variables when you deploy — never commit real keys to git).

## Deploying to Vercel

**Before you deploy**, know what does and doesn't work there:
- ✅ Google Sheets logging — works fine, it's just an API call
- ✅ Razorpay checkout, verification, webhook — all work fine
- ✅ Pending-order lookup — works **once you connect Vercel KV** (see below)
- ❌ Local Excel logging (`lib/excelOrders.ts`) — will always fail on Vercel;
  its serverless functions don't have a persistent filesystem to write to.
  It'll fail silently (already wrapped in error handling) and Sheets logging
  will still work — but don't rely on the Excel file once deployed.

**Steps:**

1. **Push the project to GitHub** (or GitLab/Bitbucket) — Vercel deploys from a git repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
   Create a new repo on GitHub, then follow its "push an existing repo" instructions.

2. **Import into Vercel** — go to https://vercel.com/new, sign in, and import
   the repo. Vercel auto-detects Next.js, no config needed.

3. **Connect Vercel KV** (needed for the webhook to find pending orders):
   - In your Vercel project → **Storage** tab → **Create Database** → **KV**
   - Once created, connect it to this project — Vercel automatically injects
     `KV_REST_API_URL` and related env vars, no manual copying needed

4. **Add your other environment variables** — Project → **Settings →
   Environment Variables**, add each of these (same values as your
   `.env.local`):
   ```
   RAZORPAY_KEY_ID
   RAZORPAY_KEY_SECRET
   RAZORPAY_WEBHOOK_SECRET
   GOOGLE_SERVICE_ACCOUNT_EMAIL
   GOOGLE_PRIVATE_KEY
   GOOGLE_SHEET_ID
   ```
   For `GOOGLE_PRIVATE_KEY`, paste it exactly as it is in `.env.local`
   (with the `\n` sequences) — Vercel handles it the same way.

5. **Deploy.** Vercel builds and gives you a live URL
   (`your-project.vercel.app`), or connect a custom domain under
   **Settings → Domains**.

6. **Update the Razorpay webhook URL** — go back to Razorpay Dashboard →
   Settings → Webhooks, edit the webhook you set up earlier, and change the
   URL from your ngrok tunnel to your real production URL:
   `https://your-project.vercel.app/api/razorpay/webhook`
   (the webhook secret stays the same — you don't need to regenerate it,
   just make sure it matches what's in Vercel's env vars)

7. **Go live for real payments**: switch Razorpay to Live mode (complete
   their KYC/activation if you haven't), generate Live mode API keys, and
   replace the Test mode keys in Vercel's env vars with the Live ones.
   Do a real small test order yourself before announcing the store.

## What's implemented

- **Home** (`/`) — hero section + product grid, cards link to their detail page
- **Product detail** (`/product/[slug]`) — thumbnail gallery, size + quantity
  selectors, "Add to Cart"
- **Cart** (`/cart`) — line items with quantity/remove controls, order summary,
  discount code field (UI only, not wired to real logic yet), "Proceed to
  Checkout"
- **Checkout** (`/checkout`) — collects name, email, phone, and shipping
  address, validates them, then opens Razorpay's Checkout modal
- **Razorpay integration**:
  - `app/api/razorpay/create-order/route.ts` — server computes the order
    amount from cart items (never trusts a client-sent total) and creates a
    Razorpay order
  - `app/api/razorpay/verify-payment/route.ts` — server recomputes the
    payment signature using your secret key and only confirms the order if
    it matches; this is what actually makes the checkout secure
  - `/order-success` — shown after a verified payment
- **Order logging** (`lib/googleSheets.ts`) — once a payment is verified, the
  order (customer, items, payment ID, total) is appended as a row to a
  Google Sheet using a service account
- **Shared Navbar** with your uploaded logo, live cart count
- **Cart state** (`lib/cart-context.tsx`) — in-memory only; resets on page
  refresh. Ask if you want it persisted to localStorage.

## Data model

`lib/products.ts` includes `slug`, `sizes`, `defaultSize`, `color`,
`detailImage`, and `thumbnails` per product. Update with your real product
data before launch.

## What's next (not yet built)

- Deploy to Vercel (remember to add `RAZORPAY_KEY_ID`,
  `RAZORPAY_KEY_SECRET`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`,
  and `GOOGLE_SHEET_ID` as environment variables there too)

Ready to build that next — just say the word.
