import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { assignInvestmentSchema } from "@shared/schema";

const MONDAY_API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjYyNzA3NzcxOSwiYWFpIjoxMSwidWlkIjo3NTA2NTY3OCwiaWFkIjoiMjAyNi0wMi0yOFQwMToxNzowOS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjkxNDg2NzMsInJnbiI6InVzZTEifQ.ocD9w0Q-17JqNfU4iZXL4i3frn_Bw4pyVe_fkhJuiPg";
const MONDAY_BOARD_ID = "18401448749";

async function fetchFreshFilesFromMonday(): Promise<any[]> {
  const query = `{ boards(ids: [${MONDAY_BOARD_ID}]) { items_page(limit: 50) { items { id name assets { id name public_url } } } } }`;
  const resp = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": MONDAY_API_TOKEN,
    },
    body: JSON.stringify({ query }),
  });
  const data = await resp.json();
  return data?.data?.boards?.[0]?.items_page?.items || [];
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get all investments
  app.get("/api/investments", async (_req, res) => {
    const investments = await storage.getInvestments();
    res.json(investments);
  });

  // Assign an investment to Grant or Haythem
  app.post("/api/investments/assign", async (req, res) => {
    const parsed = assignInvestmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.message });
    }

    const result = await storage.assignInvestment(
      parsed.data.investmentId,
      parsed.data.assignTo
    );

    if (!result) {
      return res.status(404).json({ error: "Investment not found" });
    }

    // Return all investments so the client can update everything
    const investments = await storage.getInvestments();
    res.json(investments);
  });

  // Get fresh file URLs from Monday.com API
  app.get("/api/files", async (_req, res) => {
    try {
      const mondayItems = await fetchFreshFilesFromMonday();
      const investments = await storage.getInvestments();

      // Build a map of item ID -> fresh files from Monday
      const mondayFileMap: Record<string, { id: string; name: string; public_url: string }[]> = {};
      for (const item of mondayItems) {
        mondayFileMap[item.id] = item.assets || [];
      }

      // Merge with our investment data
      const result = investments.map((inv) => ({
        id: inv.id,
        name: inv.name,
        investor: inv.investor,
        amount: inv.amount,
        date: inv.date,
        method: inv.method,
        verified: inv.verified,
        files: (mondayFileMap[inv.id] || []).map((a: any) => ({
          assetId: parseInt(a.id),
          name: a.name,
          url: a.public_url,
        })),
      }));

      res.json(result);
    } catch (err: any) {
      console.error("Failed to fetch files from Monday.com:", err);
      res.status(500).json({ error: "Failed to fetch files from Monday.com" });
    }
  });

  return httpServer;
}
