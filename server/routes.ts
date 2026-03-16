import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { assignInvestmentSchema } from "@shared/schema";

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

  return httpServer;
}
