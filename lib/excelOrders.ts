import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { CustomerDetails, OrderLineItem } from "@/lib/types";

// SERVER-ONLY. Writes to a local .xlsx file — only works when this app runs
// on a server with a persistent, writable filesystem (your own machine, a
// VPS, a self-hosted Node server). This will NOT work on Vercel: serverless
// functions there have an ephemeral, mostly-read-only filesystem, so writes
// here would be lost or fail outright. See lib/googleSheets.ts for the
// Vercel-compatible alternative.

const FILE_PATH = path.join(process.cwd(), "data", "orders.xlsx");
const SHEET_NAME = "Orders";
const HEADERS = [
  "Timestamp",
  "Order ID",
  "Payment ID",
  "Name",
  "Email",
  "Phone",
  "Items",
  "Total (₹)",
];

// Simple in-process lock: exceljs has no built-in concurrency safety, so two
// requests writing at the same instant could clobber each other's changes.
// Chaining writes onto the same promise serializes them within this process.
// (Doesn't help across multiple server processes/instances — fine for a
// single self-hosted Node server, not a substitute for a real database.)
let writeQueue: Promise<void> = Promise.resolve();

export async function appendOrderToExcel(order: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  customer: CustomerDetails;
  items: OrderLineItem[];
  totalInRupees: number;
}) {
  writeQueue = writeQueue.then(() => writeRow(order));
  return writeQueue;
}

async function writeRow(order: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  customer: CustomerDetails;
  items: OrderLineItem[];
  totalInRupees: number;
}) {
  await fs.promises.mkdir(path.dirname(FILE_PATH), { recursive: true });

  const workbook = new ExcelJS.Workbook();
  let worksheet: ExcelJS.Worksheet;

  if (fs.existsSync(FILE_PATH)) {
    await workbook.xlsx.readFile(FILE_PATH);
    worksheet =
      workbook.getWorksheet(SHEET_NAME) ?? workbook.addWorksheet(SHEET_NAME);
    if (worksheet.rowCount === 0) {
      worksheet.addRow(HEADERS);
    }
  } else {
    worksheet = workbook.addWorksheet(SHEET_NAME);
    worksheet.addRow(HEADERS);
    worksheet.getRow(1).font = { bold: true };
  }

  const itemsSummary = order.items
    .map((i) => `${i.name} (${i.size}) x${i.quantity}`)
    .join("; ");

  worksheet.addRow([
    new Date().toISOString(),
    order.razorpayOrderId,
    order.razorpayPaymentId,
    order.customer.name,
    order.customer.email,
    order.customer.phone,
    itemsSummary,
    order.totalInRupees,
  ]);

  await workbook.xlsx.writeFile(FILE_PATH);
}
