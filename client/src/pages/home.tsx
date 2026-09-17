import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronRight, Landmark, ShieldCheck, X } from "lucide-react";
import {
  STARTING_CAPITAL,
  LAST_RECONCILED_BALANCE,
  CURRENT_REPORTED_BALANCE,
  CURRENT_RECONCILIATION_GAP,
  KNOWN_NET_REDUCTION,
  RMLLC_FUNDED,
  RMLLC_ACCOUNTED,
  RMLLC_PENDING_TOTAL,
  RMLLC_PENDING_CAPTURED,
  RMLLC_UNALLOCATED,
  OLD_TEAM_TOTAL,
  OLD_TEAM_DIRECT,
  OLD_TEAM_RMLLC,
  CONSOLIDATED_FEES,
  mainUses,
  oldTeamByPerson,
  oldTeamTransactions,
  rmllcTransactions,
  rmllcPendingTransactions,
  recoverableItems,
  type ReportKey,
  type TransactionRow,
} from "@/data/capital-dashboard";

function money(value: number, approximate = false) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
  return approximate ? `~${formatted}` : formatted;
}

function Card({ label, value, detail, onClick, tone = "white" }: {
  label: string;
  value: string;
  detail: string;
  onClick?: () => void;
  tone?: "white" | "green" | "blue" | "amber";
}) {
  const tones = {
    white: "bg-white border-slate-200",
    green: "bg-emerald-50 border-emerald-200",
    blue: "bg-sky-50 border-sky-200",
    amber: "bg-amber-50 border-amber-200",
  };
  const body = (
    <>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">{value}</p>
        {onClick && <ChevronRight className="mb-1 h-5 w-5 text-slate-400" />}
      </div>
      <p className="mt-2 text-sm leading-5 text-slate-600">{detail}</p>
    </>
  );
  return onClick ? (
    <button onClick={onClick} className={`w-full rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${tones[tone]}`}>{body}</button>
  ) : (
    <div className={`rounded-2xl border p-5 shadow-sm ${tones[tone]}`}>{body}</div>
  );
}

function Status({ value }: { value: string }) {
  const c = value.toLowerCase().includes("review") || value.toLowerCase().includes("pending")
    ? "bg-amber-100 text-amber-800"
    : value.toLowerCase().includes("returned") || value.toLowerCase().includes("closed")
      ? "bg-sky-100 text-sky-800"
      : "bg-emerald-100 text-emerald-800";
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${c}`}>{value}</span>;
}

function Table({ rows }: { rows: TransactionRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Transaction</th>
              <th className="px-4 py-3">Recipient / Payee</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Evidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-mono text-[11px] font-semibold text-slate-700">{row.id}</p>
                  <p className="mt-1 text-xs text-slate-500">{row.date}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{row.payee}</p>
                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">{row.description}</p>
                </td>
                <td className="px-4 py-4 text-slate-600">{row.source}</td>
                <td className="px-4 py-4"><p>{row.category}</p><div className="mt-2"><Status value={row.status} /></div></td>
                <td className="whitespace-nowrap px-4 py-4 text-right font-black tabular-nums">{money(row.amount)}</td>
                <td className="px-4 py-4 text-xs font-semibold text-slate-600">{row.evidenceCount ? `${row.evidenceCount} on file` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const titles: Record<ReportKey, string> = {
  reconciliation: "Main Account Reconciliation",
  rmllc: "Rising Management LLC Expense Report",
  "old-team": "Old Team Pay — Consolidated Report",
  recoverable: "Recoverable Capital & Loan Report",
  fees: "Bank Fees & Transfer Costs",
};

function Report({ report, close }: { report: ReportKey; close: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-sm md:p-8" onMouseDown={close}>
      <div className="mx-auto min-h-[80vh] max-w-6xl overflow-hidden rounded-3xl bg-slate-50 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-5 backdrop-blur md:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Detailed Report</p><h2 className="mt-1 text-2xl font-black md:text-3xl">{titles[report]}</h2></div>
          <button onClick={close} className="rounded-xl border border-slate-200 bg-white p-2.5"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-8 p-5 md:p-8">
          {report === "reconciliation" && <Reconciliation />}
          {report === "rmllc" && <RMLLC />}
          {report === "old-team" && <OldTeam />}
          {report === "recoverable" && <Recoverable />}
          {report === "fees" && <Fees />}
        </div>
      </div>
    </div>
  );
}

function Reconciliation() {
  return <>
    <div className="grid gap-4 md:grid-cols-4">
      <Card label="Starting Capital" value={money(STARTING_CAPITAL)} detail="Initial capital in the main Chase account." />
      <Card label="Known Reduction" value={money(KNOWN_NET_REDUCTION)} detail="Known net account activity through the last fully reconciled balance." tone="blue" />
      <Card label="Last Reconciled Cash" value={money(LAST_RECONCILED_BALANCE)} detail="Bank activity reconciles exactly to this balance." tone="green" />
      <Card label="Later Activity To Load" value={money(CURRENT_RECONCILIATION_GAP)} detail="Difference between the last reconciled balance and the current reported ~ $50K." tone="amber" />
    </div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {mainUses.map((item) => <div key={item.label} className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 last:border-0 md:flex-row md:items-center md:justify-between"><div><p className="font-bold">{item.label}</p><p className="mt-1 max-w-3xl text-sm text-slate-500">{item.description}</p></div><p className="text-lg font-black tabular-nums">{money(item.amount)}</p></div>)}
      <div className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white"><span className="font-bold">Total known reduction</span><span className="text-xl font-black">{money(KNOWN_NET_REDUCTION)}</span></div>
    </div>
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><strong>Status:</strong> {money(STARTING_CAPITAL)} − {money(KNOWN_NET_REDUCTION)} = {money(LAST_RECONCILED_BALANCE)}. Current cash has been reported at approximately {money(CURRENT_REPORTED_BALANCE, true)}, leaving {money(CURRENT_RECONCILIATION_GAP)} of later transactions to load.</div>
  </>;
}

function RMLLC() {
  return <>
    <div className="grid gap-4 md:grid-cols-3">
      <Card label="RMLLC Funded" value={money(RMLLC_FUNDED)} detail="Top-level transfer from the main account." />
      <Card label="Accounted For" value={money(RMLLC_ACCOUNTED)} detail="Classified transactions currently in the report." tone="green" />
      <Card label="Pending / Unexplained" value={money(RMLLC_PENDING_TOTAL)} detail={`${money(RMLLC_PENDING_CAPTURED)} captured but unclassified; ${money(RMLLC_UNALLOCATED)} otherwise unallocated.`} tone="amber" />
    </div>
    <section><h3 className="mb-4 text-lg font-black">Accounted transactions</h3><Table rows={rmllcTransactions} /></section>
    <section><h3 className="mb-4 text-lg font-black">Captured but not yet classified</h3><Table rows={rmllcPendingTransactions} /></section>
  </>;
}

function OldTeam() {
  return <>
    <div className="grid gap-4 md:grid-cols-3">
      <Card label="Total Old Team Pay" value={money(OLD_TEAM_TOTAL)} detail="Combined across both funding paths." tone="green" />
      <Card label="Paid Directly" value={money(OLD_TEAM_DIRECT)} detail="Payments made directly from the main account." />
      <Card label="Paid Through RMLLC" value={money(OLD_TEAM_RMLLC)} detail="Old team payments included in the RMLLC report." />
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{oldTeamByPerson.map((p) => <div key={p.name} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm font-semibold text-slate-600">{p.name}</p><p className="mt-1 text-xl font-black">{money(p.amount)}</p></div>)}</div>
    <section><h3 className="mb-4 text-lg font-black">All old team transactions</h3><Table rows={oldTeamTransactions} /></section>
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sm text-sky-950"><strong>Remaining balance:</strong> not yet calculated because the original total old-team liability has not been supplied.</div>
  </>;
}

function Recoverable() {
  return <>
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950"><strong>Note:</strong> this is an asset / loan view, not another spending total. Some items were funded from RMLLC or redeployed cash, so adding every line to the main-account deployment would double-count capital.</div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">{recoverableItems.map((item) => <div key={item.entity} className="grid gap-3 border-b border-slate-100 px-5 py-5 last:border-0 md:grid-cols-[1fr_auto]"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-black">{item.entity}</h3><Status value={item.status} /></div><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{item.note}</p></div><p className="text-xl font-black">{money(item.amount)}</p></div>)}</div>
  </>;
}

function Fees() {
  return <>
    <div className="grid gap-4 md:grid-cols-3"><Card label="Main Fees" value={money(390)} detail="Explicit fees in the main-account reconciliation." /><Card label="Reversal Shortfall" value={money(45)} detail="$5,500 sent and $5,455 returned; only the $45 shortfall is expense." tone="amber" /><Card label="Consolidated Cost" value={money(CONSOLIDATED_FEES)} detail="Main account plus RMLLC transfer costs." tone="blue" /></div>
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">Consolidated total includes $390 of main-account bank/wire fees, $45 net loss on the failed transfer, and $90 of RMLLC wire fees.</div>
  </>;
}

export default function Home() {
  const [active, setActive] = useState<ReportKey | null>(null);
  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-900">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white"><Landmark className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Capital Transparency</p><h1 className="text-lg font-black md:text-xl">KMJZ Capital Deployment Dashboard</h1></div></div><div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 md:flex"><CheckCircle2 className="h-4 w-4" />Main account reconciled through Sep. 14, 2026</div></div></header>
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 md:px-8 md:py-10">
        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-8"><div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200"><ShieldCheck className="h-4 w-4 text-emerald-400" />Viewer-ready reconciliation with drill-down reports</div><h2 className="mt-5 max-w-3xl text-3xl font-black tracking-[-0.04em] md:text-5xl">See where the original {money(STARTING_CAPITAL)} went — and what is still recoverable.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">Top-line totals stay simple. Every report opens into transaction-level detail, source account, classification and evidence status.</p></div><button onClick={() => setActive("reconciliation")} className="rounded-2xl border border-white/15 bg-white/10 p-5 text-left transition hover:bg-white/15"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">Known main-account reduction</p><p className="mt-2 text-3xl font-black">{money(KNOWN_NET_REDUCTION)}</p><p className="mt-3 text-xs leading-5 text-slate-300">Click to see the categories that reconcile the bank balance to {money(LAST_RECONCILED_BALANCE)}.</p></button></div></section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Card label="Starting Capital" value={money(STARTING_CAPITAL)} detail="Initial capital in the main Chase account." /><Card label="Last Reconciled Cash" value={money(LAST_RECONCILED_BALANCE)} detail="Bank activity reconciles exactly to this balance." tone="green" onClick={() => setActive("reconciliation")} /><Card label="Current Reported Cash" value={money(CURRENT_REPORTED_BALANCE, true)} detail="Current figure is approximate and awaiting later transactions." tone="blue" /><Card label="Later Activity To Reconcile" value={money(CURRENT_RECONCILIATION_GAP)} detail="Transactions after the last reconciled balance still need to be loaded." tone="amber" onClick={() => setActive("reconciliation")} /></section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"><div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Main account</p><h2 className="mt-1 text-2xl font-black">Where the money was deployed</h2></div><button onClick={() => setActive("reconciliation")} className="text-sm font-bold text-sky-700">Full reconciliation →</button></div><div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">{mainUses.map((item) => <button key={item.label} onClick={() => item.report && setActive(item.report)} className="flex w-full items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 text-left last:border-0 hover:bg-slate-50"><div className="min-w-0"><p className="font-bold">{item.label}</p><p className="mt-1 truncate text-xs text-slate-500">{item.description}</p></div><div className="flex items-center gap-2"><span className="font-black">{money(item.amount)}</span><ChevronRight className="h-4 w-4 text-slate-400" /></div></button>)}</div><div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-950 px-5 py-4 text-white"><span className="font-bold">Known net reduction</span><span className="text-xl font-black">{money(KNOWN_NET_REDUCTION)}</span></div></div><div className="space-y-5"><div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 md:p-6"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700" /><div><p className="text-sm font-black text-amber-950">Reconciliation gap</p><p className="mt-1 text-3xl font-black text-amber-950">{money(CURRENT_RECONCILIATION_GAP)}</p><p className="mt-2 text-sm leading-6 text-amber-900">The known transactions reconcile exactly to {money(LAST_RECONCILED_BALANCE)}. Current cash is approximately {money(CURRENT_REPORTED_BALANCE, true)}.</p></div></div></div><div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Documentation</p><h3 className="mt-1 text-xl font-black">Evidence tied to transaction IDs</h3><p className="mt-2 text-sm leading-6 text-slate-600">Bank screenshots, receipts and verification documents are tracked against the individual transaction ID. Raw banking screenshots are not exposed in this public-facing build.</p><div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-800"><ShieldCheck className="h-4 w-4" />RMLLC-TX-20260903-01 has 2 verification documents on file</div></div></div></section>

        <section><div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Explore reports</p><h2 className="mt-1 text-2xl font-black">Click a total for the detail behind it</h2></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Card label="RMLLC Accounted" value={money(RMLLC_ACCOUNTED)} detail={`${money(RMLLC_PENDING_TOTAL)} of the $25,000 allocation remains pending or unexplained.`} tone="blue" onClick={() => setActive("rmllc")} /><Card label="Old Team Pay" value={money(OLD_TEAM_TOTAL)} detail={`${money(OLD_TEAM_DIRECT)} direct + ${money(OLD_TEAM_RMLLC)} through RMLLC.`} tone="green" onClick={() => setActive("old-team")} /><Card label="BTC Recoverable Capital" value={money(64_790)} detail="Known loans to BTC, including DE.CON supplies and equipment." onClick={() => setActive("recoverable")} /><Card label="Bank / Transfer Costs" value={money(CONSOLIDATED_FEES)} detail="Consolidated across the main account and RMLLC." tone="amber" onClick={() => setActive("fees")} /></div></section>
      </main>
      {active && <Report report={active} close={() => setActive(null)} />}
    </div>
  );
}
