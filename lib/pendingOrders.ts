import fs from "fs";
import path from "path";
import { CustomerDetails, OrderLineItem } from "@/lib/types";

// SERVER-ONLY. Bridges the gap between "order created" (when we know the
// customer + cart) and "webhook fires" (when Razorpay only gives us IDs).
// Uses a local JSON file — fine for a single self-hosted server; on Vercel
// this won't persist reliably between requests, so this whole approach
// would need a real database (e.g. Vercel KV/Postgres) there instead.

const FILE_PATH = path.join(process.cwd(), "data", "pending-orders.json");

type PendingOrder = {
  customer: CustomerDetails;
  items: OrderLineItem[];
  createdAt: string;
};

let writeQueue: Promise<void> = Promise.resolve();

async function readStore(): Promise<Record<string, PendingOrder>> {
  try {
    const raw = await fs.promises.readFile(FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeStore(store: Record<string, PendingOrder>) {
  await fs.promises.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.promises.writeFile(FILE_PATH, JSON.stringify(store, null, 2));
}

export async function savePendingOrder(
  orderId: string,
  data: { customer: CustomerDetails; items: OrderLineItem[] }
) {
  writeQueue = writeQueue.then(async () => {
    const store = await readStore();
    store[orderId] = { ...data, createdAt: new Date().toISOString() };
    await writeStore(store);
  });
  return writeQueue;
}

export async function getPendingOrder(
  orderId: string
): Promise<PendingOrder | undefined> {
  const store = await readStore();
  return store[orderId];
}

export async function deletePendingOrder(orderId: string) {
  writeQueue = writeQueue.then(async () => {
    const store = await readStore();
    delete store[orderId];
    await writeStore(store);
  });
  return writeQueue;
}
