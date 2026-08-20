import fs from "fs";
import path from "path";
import { CustomerDetails, OrderLineItem } from "@/lib/types";

// SERVER-ONLY. Bridges the gap between "order created" (when we know the
// customer + cart) and "webhook fires" (when Razorpay only gives us IDs).
//
// Uses Upstash Redis (connected via Vercel's Marketplace) when configured.
// Vercel's old standalone "KV" product is retired — Upstash is its
// replacement and uses the same underlying tech. We check both the newer
// UPSTASH_REDIS_REST_* names and the legacy KV_REST_API_* names, since
// Vercel's integration has used both at different times.
//
// Falls back to a local JSON file when neither is configured, so local dev
// works without setting anything up. The local-file path will NOT work once
// deployed to Vercel — its serverless functions don't have a persistent
// filesystem — so make sure Redis is connected before you deploy.

type PendingOrder = {
  customer: CustomerDetails;
  items: OrderLineItem[];
  createdAt: string;
};

const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const USING_REDIS = !!REDIS_URL && !!REDIS_TOKEN;
const TTL_SECONDS = 60 * 60 * 24; // pending orders auto-expire after 24h

async function redisClient() {
  const { Redis } = await import("@upstash/redis");
  return new Redis({ url: REDIS_URL!, token: REDIS_TOKEN! });
}

// ---- local file fallback (dev only) ----
const FILE_PATH = path.join(process.cwd(), "data", "pending-orders.json");
let writeQueue: Promise<void> = Promise.resolve();

async function readFileStore(): Promise<Record<string, PendingOrder>> {
  try {
    const raw = await fs.promises.readFile(FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeFileStore(store: Record<string, PendingOrder>) {
  await fs.promises.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.promises.writeFile(FILE_PATH, JSON.stringify(store, null, 2));
}
// ---- end local file fallback ----

export async function savePendingOrder(
  orderId: string,
  data: { customer: CustomerDetails; items: OrderLineItem[] }
) {
  const record: PendingOrder = { ...data, createdAt: new Date().toISOString() };

  if (USING_REDIS) {
    const redis = await redisClient();
    await redis.set(`pending-order:${orderId}`, record, { ex: TTL_SECONDS });
    return;
  }

  writeQueue = writeQueue.then(async () => {
    const store = await readFileStore();
    store[orderId] = record;
    await writeFileStore(store);
  });
  return writeQueue;
}

export async function getPendingOrder(
  orderId: string
): Promise<PendingOrder | undefined> {
  if (USING_REDIS) {
    const redis = await redisClient();
    const value = await redis.get<PendingOrder>(`pending-order:${orderId}`);
    return value ?? undefined;
  }

  const store = await readFileStore();
  return store[orderId];
}

export async function deletePendingOrder(orderId: string) {
  if (USING_REDIS) {
    const redis = await redisClient();
    await redis.del(`pending-order:${orderId}`);
    return;
  }

  writeQueue = writeQueue.then(async () => {
    const store = await readFileStore();
    delete store[orderId];
    await writeFileStore(store);
  });
  return writeQueue;
}
