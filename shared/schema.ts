import { z } from "zod";

// File attached to an investment
export const fileSchema = z.object({
  name: z.string(),
  assetId: z.number().nullable(),
  url: z.string(),
});

export type InvestmentFile = z.infer<typeof fileSchema>;

// An investment entry
export const investmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  investor: z.enum(["Grant", "Haythem"]),
  amount: z.number(),
  date: z.string(),
  method: z.string(),
  verified: z.string(),
  files: z.array(fileSchema),
  notes: z.string(),
  assignedTo: z.enum(["Grant", "Haythem"]).nullable(),
});

export type Investment = z.infer<typeof investmentSchema>;

export const assignInvestmentSchema = z.object({
  investmentId: z.string(),
  assignTo: z.enum(["Grant", "Haythem"]),
});

export type AssignInvestmentInput = z.infer<typeof assignInvestmentSchema>;
