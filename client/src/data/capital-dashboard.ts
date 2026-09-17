export type ReportKey = "reconciliation" | "rmllc" | "old-team" | "recoverable" | "fees" | "joshua-loan";
export interface TransactionRow { id:string; date:string; source:"Main Chase"|"RMLLC"|"Cash / Redeployed"; payee:string; amount:number; category:string; description:string; status:"Accounted"|"Returned"|"Review"; evidenceCount?:number; }
export const STARTING_CAPITAL=205_920;
export const LAST_RECONCILED_BALANCE=66_751;
export const RMLLC_FUNDED=25_000;
export const RMLLC_ACCOUNTED=17_942.85;
export const RMLLC_TO_JOSHUA=RMLLC_FUNDED-RMLLC_ACCOUNTED;
export const JOSHUA_LOAN_TOTAL=17_500;
export const JOSHUA_FROM_CASH_DRAW=2_500;
export const JOSHUA_FROM_RMLLC=RMLLC_TO_JOSHUA;
export const JOSHUA_FROM_ACCOUNT_NOW=JOSHUA_LOAN_TOTAL-JOSHUA_FROM_CASH_DRAW-JOSHUA_FROM_RMLLC;
export const CASH_AFTER_JOSHUA_LOAN=LAST_RECONCILED_BALANCE-JOSHUA_FROM_ACCOUNT_NOW;
export const DECON_REPAYMENT=6_250;
export const BTC_REPAYMENT=51_000;
export const LIFTED_REPAYMENT=6_250;
export const HELICOPTER_SHOT_REPAYMENT=10_000;
export const LISTED_REPAYMENTS_TOTAL=DECON_REPAYMENT+BTC_REPAYMENT+LIFTED_REPAYMENT+HELICOPTER_SHOT_REPAYMENT;
export const BALANCE_PLUS_LISTED_REPAYMENTS=LAST_RECONCILED_BALANCE+LISTED_REPAYMENTS_TOTAL;
export const PROJECTED_CASH_AFTER_REPAYMENTS=CASH_AFTER_JOSHUA_LOAN+LISTED_REPAYMENTS_TOTAL;
export const OLD_TEAM_DIRECT=4_694;
export const OLD_TEAM_RMLLC=6_000;
export const OLD_TEAM_TOTAL=OLD_TEAM_DIRECT+OLD_TEAM_RMLLC;
export const RMLLC_FEES=90;
export const MAIN_FEES=390;
export const FAILED_TRANSFER_SHORTFALL=45;
export const CONSOLIDATED_FEES=RMLLC_FEES+MAIN_FEES+FAILED_TRANSFER_SHORTFALL;

export const repaymentItems=[
 {entity:"BTC repayment",amount:BTC_REPAYMENT,note:"Brothers Trading Company LLC capital expected back."},
 {entity:"DE.CON project repayment",amount:DECON_REPAYMENT,note:"Latest amount specified for the DE.CON project repayment pool."},
 {entity:"Lifted Industries #1",amount:LIFTED_REPAYMENT,note:"Original $6,250 capital from the Lifted Industries deal."},
 {entity:"Helicopter Shot LLC",amount:HELICOPTER_SHOT_REPAYMENT,note:"Bulk wholesale product loan expected back."},
] as const;

export const mainUses=[
 {label:"BTC loans / investments",amount:64_790,report:"recoverable" as ReportKey,description:"Recoverable capital deployed to Brothers Trading Company LLC."},
 {label:"Rising Management allocation",amount:25_000,report:"rmllc" as ReportKey,description:"$17,942.85 documented RMLLC activity plus $7,057.15 assigned to Joshua's loan."},
 {label:"HSLLC capital deployed",amount:16_250,report:"recoverable" as ReportKey,description:"$10,000 wholesale product loan plus $6,250 Lifted Industries deal #1."},
 {label:"MZA loan",amount:15_000,report:"recoverable" as ReportKey,description:"Confirmed payment toward Muhammad Ziyad Akhtar's stated $17,500 loan."},
 {label:"Cash withdrawal allocation",amount:13_000,report:"joshua-loan" as ReportKey,description:"$7,000 to MAI loan, $3,500 Tesla down payment, $2,500 to Joshua loan."},
 {label:"Old team pay — direct",amount:4_694,report:"old-team" as ReportKey,description:"Direct old team payments; additional old team pay was made through RMLLC."},
 {label:"Bank & transfer costs",amount:435,report:"fees" as ReportKey,description:"$390 explicit main-account fees plus $45 reversed-transfer shortfall."},
 {label:"Joshua loan completion — new",amount:JOSHUA_FROM_ACCOUNT_NOW,report:"joshua-loan" as ReportKey,description:"Remaining amount treated as gone from the main account now to complete Joshua's $17,500 loan."},
];

export const oldTeamTransactions:TransactionRow[]=[
{id:"MAIN-TX-20260903-OT01",date:"Sep 3, 2026",source:"Main Chase",payee:"Samantha Garcia",amount:2394,category:"Old Team Pay",description:"Direct old team payment.",status:"Accounted",evidenceCount:1},
{id:"MAIN-TX-20260903-OT02",date:"Sep 3, 2026",source:"Main Chase",payee:"Jaime DeLuna",amount:1000,category:"Old Team Pay",description:"Direct old team payment.",status:"Accounted",evidenceCount:1},
{id:"MAIN-TX-20260908-OT01",date:"Sep 8, 2026",source:"Main Chase",payee:"Jorge",amount:1000,category:"Old Team Pay",description:"Direct old team payment.",status:"Accounted",evidenceCount:1},
{id:"MAIN-TX-20260908-OT02",date:"Sep 8, 2026",source:"Main Chase",payee:"Art",amount:300,category:"Old Team Pay",description:"Direct old team payment.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260907-OT01",date:"Sep 7, 2026",source:"RMLLC",payee:"Q Old School",amount:500,category:"Old Team Pay",description:"Old team payment through RMLLC.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260907-OT02",date:"Sep 7, 2026",source:"RMLLC",payee:"Shela The Cleaner",amount:250,category:"Old Team Pay",description:"Old team payment through RMLLC.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260907-OT03",date:"Sep 7, 2026",source:"RMLLC",payee:"Jaime Popes",amount:500,category:"Old Team Pay",description:"Old team payment through RMLLC.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260908-OT01",date:"Sep 8, 2026",source:"RMLLC",payee:"Jaime DeLuna",amount:500,category:"Old Team Pay",description:"Old team payment through RMLLC.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260908-OT02",date:"Sep 8, 2026",source:"RMLLC",payee:"Bobby Digital",amount:1000,category:"Old Team Pay",description:"Old team payment through RMLLC.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260909-OT01",date:"Sep 9, 2026",source:"RMLLC",payee:"Silvestre G",amount:750,category:"Old Team Pay",description:"Old team payment through RMLLC.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260911-OT01",date:"Sep 11, 2026",source:"RMLLC",payee:"Q Old School",amount:1000,category:"Old Team Pay",description:"Old team payment through RMLLC.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260913-OT01",date:"Sep 13, 2026",source:"RMLLC",payee:"James Laker",amount:500,category:"Old Team Pay",description:"Old team payment through RMLLC.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260913-OT02",date:"Sep 13, 2026",source:"RMLLC",payee:"Jorge Mendoza",amount:500,category:"Old Team Pay",description:"Old team payment through RMLLC.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260913-OT03",date:"Sep 13, 2026",source:"RMLLC",payee:"Evelin de Jesus",amount:500,category:"Old Team Pay",description:"Old team payment through RMLLC.",status:"Accounted",evidenceCount:1},
];

export const rmllcTransactions:TransactionRow[]=[
{id:"RMLLC-TX-20260902-01",date:"Sep 2, 2026",source:"RMLLC",payee:"Boudy",amount:1000,category:"Legacy KMJZ Debt",description:"Old KMJZ debt that needed to be paid to move forward.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260902-02",date:"Sep 2, 2026",source:"RMLLC",payee:"Boudy",amount:2000,category:"Legacy KMJZ Debt",description:"Old KMJZ debt that needed to be paid to move forward.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260903-02",date:"Sep 3, 2026",source:"RMLLC",payee:"Jose L. Jaimes",amount:2823,category:"Vehicle / Transportation",description:"Tires for the van and MAI truck.",status:"Accounted",evidenceCount:1},
...oldTeamTransactions.filter(t=>t.source==="RMLLC"),
{id:"RMLLC-TX-20260915-01",date:"Sep 15, 2026",source:"RMLLC",payee:"Luis Contractor",amount:640,category:"Facility / Labor",description:"Laborers to remove a wall and clean up the reactors.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260828-01",date:"Aug 28, 2026",source:"RMLLC",payee:"Lowe's #1971",amount:314.31,category:"Tools & Supplies",description:"Tools and supplies.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260828-F01",date:"Aug 28, 2026",source:"RMLLC",payee:"Wire Transfer Fee",amount:30,category:"Bank Fee",description:"Wire transfer fee.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260828-F02",date:"Aug 28, 2026",source:"RMLLC",payee:"Wire Transfer Fee",amount:30,category:"Bank Fee",description:"Wire transfer fee.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260828-F03",date:"Aug 28, 2026",source:"RMLLC",payee:"Wire Transfer Fee",amount:30,category:"Bank Fee",description:"Wire transfer fee.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260831-01",date:"Aug 31, 2026",source:"RMLLC",payee:"Lowe's #1971",amount:235.54,category:"Supplies",description:"Supplies.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260831-02",date:"Aug 31, 2026",source:"RMLLC",payee:"Richard Ortner",amount:200,category:"KMJZ Debt Repayment",description:"KMJZ loan repayment.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260831-03",date:"Aug 31, 2026",source:"RMLLC",payee:"Richard Ortner",amount:200,category:"KMJZ Debt Repayment",description:"KMJZ loan repayment.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260831-04",date:"Aug 31, 2026",source:"RMLLC",payee:"Richard Ortner",amount:200,category:"KMJZ Debt Repayment",description:"KMJZ loan repayment.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260831-05",date:"Aug 31, 2026",source:"RMLLC",payee:"Test Man Man",amount:340,category:"KMJZ Company Bill",description:"Testosterone for the guys; KMJZ bill.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260901-01",date:"Sep 1, 2026",source:"RMLLC",payee:"InfiniteLoop",amount:1400,category:"MAI Loan Application",description:"Two units of flower; ultimately applied toward MAI's stated $17,500 loan.",status:"Accounted",evidenceCount:1},
{id:"RMLLC-TX-20260903-01",date:"Sep 3, 2026",source:"RMLLC",payee:"Mohammad Akhtar Imad (MAI)",amount:2500,category:"MAI Loan Application",description:"Payment applied toward MAI's stated $17,500 loan. BOA funded $2,498.95 and Apple Cash funded $1.05.",status:"Accounted",evidenceCount:2},
{id:"RMLLC-ALLOC-20260916-JOSHUA",date:"Sep 16, 2026",source:"RMLLC",payee:"Joshua",amount:RMLLC_TO_JOSHUA,category:"Joshua Loan",description:"Remaining RMLLC funds assigned toward Joshua's $17,500 loan.",status:"Accounted"},
];

export const recoverableItems=[
{entity:"Brothers Trading Company LLC (BTC)",amount:64_790,status:"Outstanding",note:"Underlying BTC and DE.CON lending."},
{entity:"Helicopter Shot LLC — wholesale product",amount:10_000,status:"Outstanding",note:"Bulk product for wholesale."},
{entity:"Lifted Industries #1 / HSLLC",amount:6_250,status:"Returned / Closed",note:"$6,250 deployed; $8,800 cash returned."},
{entity:"Muhammad Ziyad Akhtar (MZA)",amount:15_000,status:"Toward $17,500 stated loan",note:"Confirmed loan principal."},
{entity:"Mohammad Akhtar Imad (MAI)",amount:18_100,status:"Review",note:"Recorded applications total $18,100, $600 above stated $17,500; flagged for reconciliation."},
{entity:"Joshua loan",amount:JOSHUA_LOAN_TOTAL,status:"Fully Allocated",note:"$2,500 cash draw + $7,057.15 RMLLC remainder + $7,942.85 taken from the main account now."},
] as const;

export const joshuaLoanTransactions:TransactionRow[]=[
{id:"MAIN-CASH-20260908-JOSHUA",date:"Sep 8, 2026",source:"Cash / Redeployed",payee:"Joshua",amount:JOSHUA_FROM_CASH_DRAW,category:"Joshua Loan",description:"Portion of $13,000 cash withdrawal.",status:"Accounted"},
{id:"RMLLC-ALLOC-20260916-JOSHUA",date:"Sep 16, 2026",source:"RMLLC",payee:"Joshua",amount:JOSHUA_FROM_RMLLC,category:"Joshua Loan",description:"Remaining RMLLC funds assigned to Joshua's loan.",status:"Accounted"},
{id:"MAIN-TX-20260916-JOSHUA",date:"Sep 16, 2026",source:"Main Chase",payee:"Joshua",amount:JOSHUA_FROM_ACCOUNT_NOW,category:"Joshua Loan",description:"Amount taken from account now to complete the full $17,500 loan.",status:"Accounted"},
];
