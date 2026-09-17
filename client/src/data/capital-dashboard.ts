export type ReportKey = "reconciliation" | "rmllc" | "old-team" | "recoverable" | "fees";

export type TransactionStatus = "Accounted" | "Pending" | "Returned" | "Review";

export interface TransactionRow {
  id: string;
  date: string;
  source: "Main Chase" | "RMLLC" | "Cash / Redeployed";
  payee: string;
  amount: number;
  category: string;
  description: string;
  status: TransactionStatus;
  evidenceCount?: number;
}

export interface MainUseRow {
  label: string;
  amount: number;
  report?: ReportKey;
  description: string;
}

export const STARTING_CAPITAL = 205_920;
export const LAST_RECONCILED_BALANCE = 66_751;
export const CURRENT_REPORTED_BALANCE = 50_000;
export const KNOWN_NET_REDUCTION = STARTING_CAPITAL - LAST_RECONCILED_BALANCE;
export const CURRENT_RECONCILIATION_GAP = LAST_RECONCILED_BALANCE - CURRENT_REPORTED_BALANCE;

export const RMLLC_FUNDED = 25_000;
export const RMLLC_ACCOUNTED = 17_942.85;
export const RMLLC_PENDING_CAPTURED = 206.18;
export const RMLLC_UNALLOCATED = 6_850.97;
export const RMLLC_PENDING_TOTAL = RMLLC_FUNDED - RMLLC_ACCOUNTED;

export const OLD_TEAM_DIRECT = 4_694;
export const OLD_TEAM_RMLLC = 6_000;
export const OLD_TEAM_TOTAL = OLD_TEAM_DIRECT + OLD_TEAM_RMLLC;

export const MAIN_FEES = 390;
export const FAILED_TRANSFER_SHORTFALL = 45;
export const RMLLC_FEES = 90;
export const CONSOLIDATED_FEES = MAIN_FEES + FAILED_TRANSFER_SHORTFALL + RMLLC_FEES;

export const mainUses: MainUseRow[] = [
  {
    label: "BTC loans / investments",
    amount: 64_790,
    report: "recoverable",
    description: "Recoverable capital deployed to Brothers Trading Company LLC, including DE.CON supplies and equipment.",
  },
  {
    label: "Rising Management allocation",
    amount: 25_000,
    report: "rmllc",
    description: "Funds moved to Rising Management LLC for documented KMJZ obligations, operations, old team pay and loan applications.",
  },
  {
    label: "HSLLC capital deployed",
    amount: 16_250,
    report: "recoverable",
    description: "$10,000 wholesale product loan plus $6,250 Lifted Industries deal #1, which later returned cash.",
  },
  {
    label: "MZA loan",
    amount: 15_000,
    report: "recoverable",
    description: "Confirmed payment toward Muhammad Ziyad Akhtar's stated $17,500 loan.",
  },
  {
    label: "Cash withdrawal allocation",
    amount: 13_000,
    report: "recoverable",
    description: "$7,000 to MAI loan, $3,500 Tesla down payment for Joshua, and $2,500 toward Joshua's loan.",
  },
  {
    label: "Old team pay — direct",
    amount: 4_694,
    report: "old-team",
    description: "Old team payments made directly from the main account. Additional old team pay was made through RMLLC.",
  },
  {
    label: "Bank & transfer costs",
    amount: 435,
    report: "fees",
    description: "$390 explicit main-account fees plus $45 net loss on the reversed transfer.",
  },
];

export const oldTeamTransactions: TransactionRow[] = [
  {
    id: "MAIN-TX-20260903-OT01",
    date: "Sep 3, 2026",
    source: "Main Chase",
    payee: "Samantha Garcia",
    amount: 2_394,
    category: "Old Team Pay",
    description: "Direct old team payment.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "MAIN-TX-20260903-OT02",
    date: "Sep 3, 2026",
    source: "Main Chase",
    payee: "Jaime DeLuna",
    amount: 1_000,
    category: "Old Team Pay",
    description: "Direct old team payment.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "MAIN-TX-20260908-OT01",
    date: "Sep 8, 2026",
    source: "Main Chase",
    payee: "Jorge",
    amount: 1_000,
    category: "Old Team Pay",
    description: "Direct old team payment.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "MAIN-TX-20260908-OT02",
    date: "Sep 8, 2026",
    source: "Main Chase",
    payee: "Art",
    amount: 300,
    category: "Old Team Pay",
    description: "Direct old team payment.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260907-OT01",
    date: "Sep 7, 2026",
    source: "RMLLC",
    payee: "Q Old School",
    amount: 500,
    category: "Old Team Pay",
    description: "Old team payment through RMLLC.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260907-OT02",
    date: "Sep 7, 2026",
    source: "RMLLC",
    payee: "Shela The Cleaner",
    amount: 250,
    category: "Old Team Pay",
    description: "Old team payment through RMLLC.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260907-OT03",
    date: "Sep 7, 2026",
    source: "RMLLC",
    payee: "Jaime Popes",
    amount: 500,
    category: "Old Team Pay",
    description: "Old team payment through RMLLC.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260908-OT01",
    date: "Sep 8, 2026",
    source: "RMLLC",
    payee: "Jaime DeLuna",
    amount: 500,
    category: "Old Team Pay",
    description: "Old team payment through RMLLC.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260908-OT02",
    date: "Sep 8, 2026",
    source: "RMLLC",
    payee: "Bobby Digital",
    amount: 1_000,
    category: "Old Team Pay",
    description: "Old team payment through RMLLC.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260909-OT01",
    date: "Sep 9, 2026",
    source: "RMLLC",
    payee: "Silvestre G",
    amount: 750,
    category: "Old Team Pay",
    description: "Old team payment through RMLLC.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260911-OT01",
    date: "Sep 11, 2026",
    source: "RMLLC",
    payee: "Q Old School",
    amount: 1_000,
    category: "Old Team Pay",
    description: "Old team payment through RMLLC.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260913-OT01",
    date: "Sep 13, 2026",
    source: "RMLLC",
    payee: "James Laker",
    amount: 500,
    category: "Old Team Pay",
    description: "Old team payment through RMLLC.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260913-OT02",
    date: "Sep 13, 2026",
    source: "RMLLC",
    payee: "Jorge Mendoza",
    amount: 500,
    category: "Old Team Pay",
    description: "Old team payment through RMLLC.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260913-OT03",
    date: "Sep 13, 2026",
    source: "RMLLC",
    payee: "Evelin de Jesus",
    amount: 500,
    category: "Old Team Pay",
    description: "Old team payment through RMLLC.",
    status: "Accounted",
    evidenceCount: 1,
  },
];

export const rmllcTransactions: TransactionRow[] = [
  {
    id: "RMLLC-TX-20260902-01",
    date: "Sep 2, 2026",
    source: "RMLLC",
    payee: "Boudy",
    amount: 1_000,
    category: "Legacy KMJZ Debt",
    description: "Old KMJZ debt that needed to be paid to move forward.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260902-02",
    date: "Sep 2, 2026",
    source: "RMLLC",
    payee: "Boudy",
    amount: 2_000,
    category: "Legacy KMJZ Debt",
    description: "Old KMJZ debt that needed to be paid to move forward.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260903-02",
    date: "Sep 3, 2026",
    source: "RMLLC",
    payee: "Jose L. Jaimes",
    amount: 2_823,
    category: "Vehicle / Transportation",
    description: "Tires for the van and MAI truck.",
    status: "Accounted",
    evidenceCount: 1,
  },
  ...oldTeamTransactions.filter((transaction) => transaction.source === "RMLLC"),
  {
    id: "RMLLC-TX-20260915-01",
    date: "Sep 15, 2026",
    source: "RMLLC",
    payee: "Luis Contractor",
    amount: 640,
    category: "Facility / Labor",
    description: "Laborers to remove a wall and clean up the reactors.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260828-01",
    date: "Aug 28, 2026",
    source: "RMLLC",
    payee: "Lowe's #1971",
    amount: 314.31,
    category: "Tools & Supplies",
    description: "Tools and supplies.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260828-F01",
    date: "Aug 28, 2026",
    source: "RMLLC",
    payee: "Wire Transfer Fee",
    amount: 30,
    category: "Bank Fee",
    description: "Wire transfer fee.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260828-F02",
    date: "Aug 28, 2026",
    source: "RMLLC",
    payee: "Wire Transfer Fee",
    amount: 30,
    category: "Bank Fee",
    description: "Wire transfer fee.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260828-F03",
    date: "Aug 28, 2026",
    source: "RMLLC",
    payee: "Wire Transfer Fee",
    amount: 30,
    category: "Bank Fee",
    description: "Wire transfer fee.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260831-01",
    date: "Aug 31, 2026",
    source: "RMLLC",
    payee: "Lowe's #1971",
    amount: 235.54,
    category: "Supplies",
    description: "Supplies.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260831-02",
    date: "Aug 31, 2026",
    source: "RMLLC",
    payee: "Richard Ortner",
    amount: 200,
    category: "KMJZ Debt Repayment",
    description: "KMJZ loan repayment under Mosh's wife's name and Joshua's name.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260831-03",
    date: "Aug 31, 2026",
    source: "RMLLC",
    payee: "Richard Ortner",
    amount: 200,
    category: "KMJZ Debt Repayment",
    description: "KMJZ loan repayment under Mosh's wife's name and Joshua's name.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260831-04",
    date: "Aug 31, 2026",
    source: "RMLLC",
    payee: "Richard Ortner",
    amount: 200,
    category: "KMJZ Debt Repayment",
    description: "KMJZ loan repayment under Mosh's wife's name and Joshua's name.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260831-05",
    date: "Aug 31, 2026",
    source: "RMLLC",
    payee: "Test Man Man",
    amount: 340,
    category: "KMJZ Company Bill",
    description: "Testosterone for the guys; identified as a KMJZ bill.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260901-01",
    date: "Sep 1, 2026",
    source: "RMLLC",
    payee: "InfiniteLoop",
    amount: 1_400,
    category: "MAI Loan Application",
    description: "Two units of flower; ultimately applied toward MAI's stated $17,500 loan.",
    status: "Accounted",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-TX-20260903-01",
    date: "Sep 3, 2026",
    source: "RMLLC",
    payee: "Mohammad Akhtar Imad (MAI)",
    amount: 2_500,
    category: "MAI Loan Application",
    description: "Payment applied toward MAI's stated $17,500 loan. BOA funded $2,498.95 and Apple Cash funded $1.05; treated as one $2,500 transaction.",
    status: "Accounted",
    evidenceCount: 2,
  },
];

export const rmllcPendingTransactions: TransactionRow[] = [
  {
    id: "RMLLC-PENDING-20260827-01",
    date: "Aug 27, 2026",
    source: "RMLLC",
    payee: "Perplexity",
    amount: 100,
    category: "Pending Classification",
    description: "Captured transaction; classification not yet provided.",
    status: "Pending",
    evidenceCount: 1,
  },
  {
    id: "RMLLC-PENDING-20260831-01",
    date: "Aug 31, 2026",
    source: "RMLLC",
    payee: "Lowe's #1971",
    amount: 106.18,
    category: "Pending Classification",
    description: "Captured transaction; classification not yet confirmed.",
    status: "Pending",
    evidenceCount: 1,
  },
];

export const recoverableItems = [
  {
    entity: "Brothers Trading Company LLC (BTC)",
    amount: 64_790,
    status: "Outstanding",
    note: "$51,000 general BTC loan + $6,520 DE.CON supplies + $7,270 DE.CON equipment.",
  },
  {
    entity: "Helicopter Shot LLC — wholesale product",
    amount: 10_000,
    status: "Outstanding",
    note: "Bulk product for wholesale, paid via Feel Good Wellness LLC.",
  },
  {
    entity: "Lifted Industries #1 / HSLLC",
    amount: 6_250,
    status: "Returned / Closed",
    note: "$6,250 deployed; $8,800 cash returned. Gross gain $2,550; $1,600 commissions; $950 net economic gain before redeployment.",
  },
  {
    entity: "Muhammad Ziyad Akhtar (MZA)",
    amount: 15_000,
    status: "Toward $17,500 stated loan",
    note: "$15,000 confirmed as loan principal. Separate $800 Lifted #1 commission is not loan principal.",
  },
  {
    entity: "Mohammad Akhtar Imad (MAI)",
    amount: 18_100,
    status: "Review",
    note: "$7,000 cash withdrawal + $7,200 Lifted proceeds + $1,400 RMLLC flower application + $2,500 RMLLC payment. This is $600 above the stated $17,500 loan and needs reconciliation.",
  },
  {
    entity: "Joshua loan",
    amount: 2_500,
    status: "Toward $17,500 stated loan",
    note: "$2,500 from the $13,000 cash withdrawal. The separate attempted $5,500 transfer was reversed and is not loan principal.",
  },
] as const;

export const oldTeamByPerson = [
  { name: "Samantha Garcia", amount: 2_394 },
  { name: "Jaime DeLuna", amount: 1_500 },
  { name: "Q Old School", amount: 1_500 },
  { name: "Jorge", amount: 1_000 },
  { name: "Bobby Digital", amount: 1_000 },
  { name: "Silvestre G", amount: 750 },
  { name: "Jaime Popes", amount: 500 },
  { name: "James Laker", amount: 500 },
  { name: "Jorge Mendoza", amount: 500 },
  { name: "Evelin de Jesus", amount: 500 },
  { name: "Art", amount: 300 },
  { name: "Shela The Cleaner", amount: 250 },
] as const;
