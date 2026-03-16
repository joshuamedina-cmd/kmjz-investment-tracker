import type { VercelRequest, VercelResponse } from "@vercel/node";

interface InvestmentFile {
  name: string;
  assetId: number | null;
  url: string;
}

interface Investment {
  id: string;
  name: string;
  investor: "Grant" | "Haythem";
  amount: number;
  date: string;
  method: string;
  verified: string;
  files: InvestmentFile[];
  notes: string;
  assignedTo: "Grant" | "Haythem" | null;
}

// We dynamically import the storage at runtime
let storageInstance: any = null;

async function getStorage() {
  if (!storageInstance) {
    // Use dynamic require to load the compiled storage
    const { storage } = await import("../server/storage");
    storageInstance = storage;
  }
  return storageInstance;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const url = req.url || "";
  const storage = await getStorage();

  // GET /api/investments
  if (req.method === "GET" && url.includes("/investments")) {
    const investments = await storage.getInvestments();
    return res.status(200).json(investments);
  }

  // POST /api/investments/assign
  if (req.method === "POST" && url.includes("/investments/assign")) {
    const { investmentId, assignTo } = req.body || {};

    if (!investmentId || !["Grant", "Haythem"].includes(assignTo)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const result = await storage.assignInvestment(investmentId, assignTo);
    if (!result) {
      return res.status(404).json({ error: "Investment not found" });
    }

    const investments = await storage.getInvestments();
    return res.status(200).json(investments);
  }

  return res.status(404).json({ error: "Not found" });
}
