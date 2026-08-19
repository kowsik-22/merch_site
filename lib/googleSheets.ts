import { google } from "googleapis";
import { CustomerDetails, OrderLineItem } from "@/lib/types";

// SERVER-ONLY. Uses a Google service account key — never import this from
// a "use client" component.

function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY are not set — see .env.example"
    );
  }

  // Env vars store the key with literal \n sequences; convert them to real newlines.
  const privateKey = rawKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function appendOrderToSheet(order: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  customer: CustomerDetails;
  items: OrderLineItem[];
  totalInRupees: number;
}) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set — see .env.example");
  }

  const sheets = getSheetsClient();

  const itemsSummary = order.items
    .map((i) => `${i.name} (${i.size}) x${i.quantity}`)
    .join("; ");

  const row = [
    new Date().toISOString(),
    order.razorpayOrderId,
    order.razorpayPaymentId,
    order.customer.name,
    order.customer.email,
    order.customer.phone,
    itemsSummary,
    order.totalInRupees,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Orders!A:H",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}
