import { useState } from "react";
import { ChevronRight, Landmark } from "lucide-react";
import {
  STARTING_CAPITAL,
  CASH_AFTER_JOSHUA_LOAN,
  LISTED_REPAYMENTS_TOTAL,
  PROJECTED_CASH_AFTER_REPAYMENTS,
  RMLLC_FUNDED,
  RMLLC_ACCOUNTED,
  RMLLC_TO_JOSHUA,
  OLD_TEAM_TOTAL,
  oldTeamTransactions,
  rmllcTransactions,
  recoverableItems,
  repaymentItems,
  joshuaLoanTransactions,
  CONSOLIDATED_FEES,
  mainUses,
  type ReportKey,
  type TransactionRow,
} from "@/data/capital-dashboard";

const money=(n:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:n%1?2:0,maximumFractionDigits:2}).format(n);

function Metric({label,value,sub,onClick,accent=false}:{label:string;value:string;sub?:string;onClick?:()=>void;accent?:boolean}){
 return <button onClick={onClick} className={`text-left rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accent?"bg-slate-950 text-white border-slate-950":"bg-white border-slate-200"}`}>
  <div className={`text-xs font-semibold uppercase tracking-[.14em] ${accent?"text-slate-300":"text-slate-500"}`}>{label}</div>
  <div className="mt-2 text-3xl font-black tracking-tight">{value}</div>
  {sub&&<div className={`mt-2 text-sm ${accent?"text-slate-300":"text-slate-500"}`}>{sub}</div>}
 </button>
}

function TxTable({rows}:{rows:TransactionRow[]}){
 return <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Payee</th><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-right">Amount</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map(r=><tr key={r.id}><td className="px-4 py-3 whitespace-nowrap text-slate-500">{r.date}</td><td className="px-4 py-3"><div className="font-semibold text-slate-900">{r.payee}</div><div className="mt-1 text-xs text-slate-500">{r.description}</div><div className="mt-1 font-mono text-[10px] text-slate-400">{r.id}</div></td><td className="px-4 py-3 text-slate-600">{r.category}</td><td className="px-4 py-3 text-right font-bold tabular-nums">{money(r.amount)}</td></tr>)}</tbody></table></div>
}

export default function CapitalHome(){
 const [report,setReport]=useState<ReportKey|null>(null);
 const close=()=>setReport(null);
 return <div className="min-h-screen bg-slate-100 text-slate-950">
  <header className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-5 py-6"><div className="text-xs font-bold uppercase tracking-[.2em] text-slate-500">KMJZ Capital Transparency</div><h1 className="mt-1 text-3xl font-black tracking-tight">Capital Deployment Dashboard</h1><p className="mt-2 max-w-3xl text-sm text-slate-500">Where the starting capital went, what is expected back, and the reports supporting each total.</p></div></header>
  <main className="mx-auto max-w-7xl px-5 py-7 space-y-7">
   <section className="grid gap-4 md:grid-cols-2">
    <Metric label="Starting Capital" value={money(STARTING_CAPITAL)} sub="Original capital base"/>
    <Metric label="Current Reconciled Bank Balance" value={money(CASH_AFTER_JOSHUA_LOAN)} sub="Current reconciled cash position" onClick={()=>setReport("reconciliation")}/>
   </section>

   <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="text-xs font-bold uppercase tracking-[.18em] text-emerald-300">Capital Recovery View</div><h2 className="mt-2 text-2xl font-black">When the listed capital is repaid</h2><p className="mt-2 max-w-2xl text-sm text-slate-300">BTC $51,000 + DE.CON $6,250 + Lifted Industries $6,250 + Helicopter Shot $10,000 = {money(LISTED_REPAYMENTS_TOTAL)} expected back.</p></div><button onClick={()=>setReport("recoverable")} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950">View repayment detail <ChevronRight className="h-4 w-4"/></button></div>
    <div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-emerald-400 p-4 text-slate-950"><div className="text-xs font-bold uppercase tracking-wider">Current balance + listed repayments</div><div className="mt-2 text-3xl font-black">{money(PROJECTED_CASH_AFTER_REPAYMENTS)}</div><div className="mt-1 text-xs font-medium">{money(CASH_AFTER_JOSHUA_LOAN)} current balance + {money(LISTED_REPAYMENTS_TOTAL)} expected repayments.</div></div><div className="rounded-2xl bg-white/10 p-4"><div className="text-xs uppercase tracking-wider text-slate-300">Listed repayments</div><div className="mt-2 text-3xl font-black">{money(LISTED_REPAYMENTS_TOTAL)}</div><div className="mt-1 text-xs text-slate-400">Four specifically requested repayment items.</div></div></div>
   </section>

   <section className="grid gap-4 md:grid-cols-3">
    <Metric label="Old Team Pay" value={money(OLD_TEAM_TOTAL)} sub="Consolidated direct + RMLLC report" onClick={()=>setReport("old-team")}/>
    <Metric label="RMLLC Allocation" value={money(RMLLC_FUNDED)} sub={`${money(RMLLC_ACCOUNTED)} documented + ${money(RMLLC_TO_JOSHUA)} assigned to Joshua loan`} onClick={()=>setReport("rmllc")}/>
    <Metric label="Bank / Transfer Costs" value={money(CONSOLIDATED_FEES)} sub="Main, RMLLC and reversed-transfer shortfall" onClick={()=>setReport("fees")}/>
   </section>

   <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="text-lg font-black">Where the capital has been deployed</h2><p className="text-sm text-slate-500">Click a linked category to drill into its report.</p></div><Landmark className="h-6 w-6 text-slate-400"/></div><div className="mt-4 divide-y divide-slate-100">{mainUses.map(x=><button key={x.label} onClick={()=>x.report&&setReport(x.report)} className="flex w-full items-start justify-between gap-4 py-4 text-left hover:bg-slate-50"><div><div className="font-bold">{x.label}</div><div className="mt-1 max-w-3xl text-sm text-slate-500">{x.description}</div></div><div className="flex items-center gap-2 whitespace-nowrap font-black tabular-nums">{money(x.amount)}{x.report&&<ChevronRight className="h-4 w-4 text-slate-400"/>}</div></button>)}</div></section>
  </main>

  {report&&<div className="fixed inset-0 z-50 bg-black/50 p-4 backdrop-blur-sm" onClick={close}><div className="mx-auto mt-4 max-h-[92vh] max-w-6xl overflow-y-auto rounded-3xl bg-slate-50 shadow-2xl" onClick={e=>e.stopPropagation()}><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4"><div className="font-black">{report==="old-team"?"Old Team Pay Report":report==="rmllc"?"Rising Management LLC Report":report==="recoverable"?"Recoverable Capital / Repayment Report":report==="joshua-loan"?"Joshua $17,500 Loan Report":report==="fees"?"Fees Report":"Capital Reconciliation"}</div><button onClick={close} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold">Close</button></div><div className="p-6">
   {report==="old-team"&&<><div className="mb-5 grid gap-3 md:grid-cols-3"><Metric label="Total Old Team Pay" value={money(OLD_TEAM_TOTAL)}/><Metric label="Direct Main Account" value={money(4694)}/><Metric label="Through RMLLC" value={money(6000)}/></div><TxTable rows={oldTeamTransactions}/></>}
   {report==="rmllc"&&<><div className="mb-5 grid gap-3 md:grid-cols-3"><Metric label="RMLLC Funded" value={money(RMLLC_FUNDED)}/><Metric label="Documented Activity" value={money(RMLLC_ACCOUNTED)}/><Metric label="Assigned To Joshua Loan" value={money(RMLLC_TO_JOSHUA)}/></div><TxTable rows={rmllcTransactions}/></>}
   {report==="joshua-loan"&&<><div className="mb-5 rounded-2xl bg-emerald-100 p-5"><div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Loan fully allocated</div><div className="mt-1 text-3xl font-black">{money(17500)}</div><p className="mt-2 text-sm text-emerald-900">$2,500 cash draw + $7,057.15 RMLLC remainder + $7,942.85 taken from the main account. Remaining to fulfill: $0.</p></div><TxTable rows={joshuaLoanTransactions}/></>}
   {report==="recoverable"&&<><div className="mb-5 rounded-2xl bg-slate-950 p-5 text-white"><div className="text-sm text-slate-300">Specifically requested repayment pool</div><div className="mt-1 text-3xl font-black">{money(LISTED_REPAYMENTS_TOTAL)}</div></div><div className="grid gap-3 md:grid-cols-2">{repaymentItems.map(x=><div key={x.entity} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-sm font-bold">{x.entity}</div><div className="mt-1 text-2xl font-black">{money(x.amount)}</div><div className="mt-2 text-xs text-slate-500">{x.note}</div></div>)}</div><h3 className="mb-3 mt-6 font-black">Underlying recoverable positions</h3><div className="space-y-3">{recoverableItems.map(x=><div key={x.entity} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex justify-between gap-4"><div><div className="font-bold">{x.entity}</div><div className="mt-1 text-sm text-slate-500">{x.note}</div><div className="mt-2 text-xs font-semibold text-slate-400">{x.status}</div></div><div className="font-black">{money(x.amount)}</div></div></div>)}</div></>}
   {report==="fees"&&<div className="grid gap-4 md:grid-cols-3"><Metric label="Main Fees" value={money(390)}/><Metric label="RMLLC Fees" value={money(90)}/><Metric label="Reversal Shortfall" value={money(45)}/></div>}
   {report==="reconciliation"&&<div className="space-y-4"><div className="rounded-2xl bg-white p-5"><div className="text-sm text-slate-500">Starting capital</div><div className="text-3xl font-black">{money(STARTING_CAPITAL)}</div></div><div className="rounded-2xl bg-white p-5"><div className="text-sm text-slate-500">Current reconciled bank balance</div><div className="text-3xl font-black">{money(CASH_AFTER_JOSHUA_LOAN)}</div></div></div>}
  </div></div></div>}
 </div>
}
