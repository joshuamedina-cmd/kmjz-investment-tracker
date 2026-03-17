import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Investment } from "@shared/schema";
import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Image,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  X,
  ExternalLink,
  FolderOpen,
  Shield,
} from "lucide-react";

const TOTAL_INVESTMENT = 2_000_000;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    CASH: "bg-emerald-100 text-emerald-800",
    WIRE: "bg-blue-100 text-blue-800",
    CARD: "bg-purple-100 text-purple-800",
    CHECK: "bg-amber-100 text-amber-800",
    "MONEY ORDER": "bg-orange-100 text-orange-800",
    "APPLE PAY": "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${colors[method] || "bg-gray-100 text-gray-700"}`}
    >
      {method}
    </span>
  );
}

// Build a vault path from an assetId and filename
function getVaultPath(assetId: number | null, name: string): string {
  if (!assetId) return "";
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `/vault/${assetId}_${safeName}`;
}

function FilesModal({
  investment,
  onClose,
}: {
  investment: Investment;
  onClose: () => void;
}) {
  const [previewFile, setPreviewFile] = useState<{ name: string; path: string } | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Documents — {investment.name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {formatCurrency(investment.amount)} · {formatDate(investment.date)} · {investment.method}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            data-testid="close-files-modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Inline preview */}
          {previewFile && (
            <div className="border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
                <span className="text-xs text-gray-600 font-medium truncate">{previewFile.name}</span>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
                >
                  Close preview
                </button>
              </div>
              {previewFile.name.toLowerCase().endsWith(".pdf") ? (
                <iframe src={previewFile.path} className="w-full h-[50vh]" title={previewFile.name} />
              ) : (
                <div className="flex items-center justify-center p-4">
                  <img src={previewFile.path} alt={previewFile.name} className="max-w-full max-h-[50vh] object-contain rounded-lg" />
                </div>
              )}
            </div>
          )}

          {investment.files.length === 0 ? (
            <p className="text-gray-400 text-sm italic py-8 text-center">
              No documents attached
            </p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {investment.files.map((file, idx) => {
                const isImage =
                  file.name.toLowerCase().endsWith(".jpg") ||
                  file.name.toLowerCase().endsWith(".png") ||
                  file.name.toLowerCase().endsWith(".jpeg");
                const vaultPath = getVaultPath(file.assetId, file.name);
                const hasVaultFile = !!vaultPath;

                return (
                  <li
                    key={idx}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/80 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isImage ? "bg-sky-50 text-sky-500" : "bg-red-50 text-red-500"
                    }`}>
                      {isImage ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <span className="text-sm text-gray-700 truncate flex-1 min-w-0">
                      {file.name}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {hasVaultFile && (
                        <button
                          onClick={() =>
                            setPreviewFile(
                              previewFile?.path === vaultPath ? null : { name: file.name, path: vaultPath }
                            )
                          }
                          className="px-2.5 py-1 text-[11px] font-medium text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                          data-testid={`preview-file-${idx}`}
                        >
                          {previewFile?.path === vaultPath ? "Hide" : "Preview"}
                        </button>
                      )}
                      {hasVaultFile && (
                        <a
                          href={vaultPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          data-testid={`open-file-${idx}`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </a>
                      )}
                      {!hasVaultFile && (
                        <span className="text-[11px] text-gray-400 italic">No file</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function InvestmentCard({
  investment,
  onAssign,
  isPending,
  wasDisputed,
}: {
  investment: Investment;
  onAssign: (id: string, assignTo: "Grant" | "Haythem") => void;
  isPending: boolean;
  wasDisputed: boolean;
}) {
  const [showFiles, setShowFiles] = useState(false);

  const assignedGrant = investment.assignedTo === "Grant";
  const assignedHaythem = investment.assignedTo === "Haythem";

  // Card position offset for animation
  let translateX = "translate-x-0";
  if (assignedGrant) translateX = "-translate-x-4 md:-translate-x-8";
  if (assignedHaythem) translateX = "translate-x-4 md:translate-x-8";

  let borderColor = "border-gray-200";
  if (assignedGrant) borderColor = "border-sky-300";
  if (assignedHaythem) borderColor = "border-amber-300";
  if (wasDisputed && !assignedGrant && !assignedHaythem) borderColor = "border-red-300";

  let bgColor = "bg-white";
  if (assignedGrant) bgColor = "bg-sky-50/50";
  if (assignedHaythem) bgColor = "bg-amber-50/50";
  if (wasDisputed && !assignedGrant && !assignedHaythem) bgColor = "bg-red-50/30";

  return (
    <>
      <div
        className={`relative rounded-xl border ${borderColor} ${bgColor} p-3 md:p-4 transition-all duration-500 ease-out ${translateX} cursor-pointer group`}
        onClick={() => setShowFiles(true)}
        data-testid={`investment-card-${investment.id}`}
      >
        {/* Disputed badge */}
        {wasDisputed && !assignedGrant && !assignedHaythem && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm z-10">
            Disputed
          </div>
        )}
        {/* Assignment arrows */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAssign(investment.id, "Grant");
              }}
              disabled={isPending}
              className={`p-1.5 rounded-lg transition-all ${
                assignedGrant
                  ? "bg-sky-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-400 hover:bg-sky-100 hover:text-sky-600"
              }`}
              data-testid={`assign-grant-${investment.id}`}
              title="Assign to Grant"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-semibold text-sky-600">Grant</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-gray-900 text-sm md:text-base tabular-nums">
                {formatCurrency(investment.amount)}
              </span>
              <div className="flex items-center gap-1.5">
                <MethodBadge method={investment.method} />
                {investment.verified === "Verified" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">
                {formatDate(investment.date)}
              </span>
            </div>
            {investment.files.length > 0 && (
              <div className="flex items-center gap-1 mt-1.5">
                <FileText className="w-3 h-3 text-gray-400" />
                <span className="text-[11px] text-gray-400">
                  {investment.files.length} document
                  {investment.files.length > 1 ? "s" : ""} — click to view
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAssign(investment.id, "Haythem");
              }}
              disabled={isPending}
              className={`p-1.5 rounded-lg transition-all ${
                assignedHaythem
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-400 hover:bg-amber-100 hover:text-amber-600"
              }`}
              data-testid={`assign-haythem-${investment.id}`}
              title="Assign to Haythem"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-semibold text-amber-600">Haythem</span>
          </div>
        </div>
      </div>

      {showFiles && (
        <FilesModal
          investment={investment}
          onClose={() => setShowFiles(false)}
        />
      )}
    </>
  );
}

function MeterGauge({
  invested,
  total,
}: {
  invested: number;
  total: number;
}) {
  const pct = Math.min((invested / total) * 100, 100);
  const remaining = total - invested;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Total Invested
        </span>
        <span className="text-sm font-bold tabular-nums text-gray-900">
          {formatCurrency(invested)} / {formatCurrency(total)}
        </span>
      </div>
      <div className="relative w-full h-5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #0ea5e9, #14b8a6, #f59e0b)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-bold text-gray-700 tabular-nums drop-shadow-sm">
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>
      {remaining > 0 && (
        <div className="mt-2 text-center">
          <span className="text-lg font-bold text-red-600 tabular-nums">
            {formatCurrency(remaining)} STILL OWED
          </span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { data: investments = [], isLoading } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const [disputedIds, setDisputedIds] = useState<Set<string>>(new Set());

  const assignMutation = useMutation({
    mutationFn: async ({
      investmentId,
      assignTo,
    }: {
      investmentId: string;
      assignTo: "Grant" | "Haythem";
    }) => {
      const res = await apiRequest("POST", "/api/investments/assign", {
        investmentId,
        assignTo,
      });
      return res.json();
    },
    onSuccess: (data: Investment[], variables) => {
      queryClient.setQueryData(["/api/investments"], data);
      // Check if the item became unassigned (disputed)
      const item = data.find((i: Investment) => i.id === variables.investmentId);
      if (item && item.assignedTo === null) {
        setDisputedIds((prev) => new Set(prev).add(variables.investmentId));
      } else if (item && item.assignedTo !== null) {
        setDisputedIds((prev) => {
          const next = new Set(prev);
          next.delete(variables.investmentId);
          return next;
        });
      }
    },
  });

  const handleAssign = (id: string, assignTo: "Grant" | "Haythem") => {
    assignMutation.mutate({ investmentId: id, assignTo });
  };

  // Calculate totals
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const grantAssigned = investments
    .filter((inv) => inv.assignedTo === "Grant")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const haythemAssigned = investments
    .filter((inv) => inv.assignedTo === "Haythem")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const grantOriginal = investments
    .filter((inv) => inv.investor === "Grant")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const haythemOriginal = investments
    .filter((inv) => inv.investor === "Haythem")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const remaining = TOTAL_INVESTMENT - totalInvested;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">
          Loading investments...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  KMJZ Holdings
                </h1>
                <p className="text-xs text-gray-500">Investment Tracker</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/files"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                data-testid="go-to-files"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Documents
              </Link>
              <Link
                href="/vault"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                data-testid="go-to-vault"
              >
                <Shield className="w-3.5 h-3.5" />
                Vault
              </Link>
              {remaining > 0 && (
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                    Outstanding Balance
                  </p>
                  <p
                    className="text-xl font-bold text-red-600 tabular-nums leading-tight"
                    data-testid="remaining-amount"
                  >
                    {formatCurrency(remaining)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Investment Meter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <MeterGauge invested={totalInvested} total={TOTAL_INVESTMENT} />
        </div>

        {/* Three-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4">
          {/* Grant's Side (Left) */}
          <div className="bg-white rounded-2xl border border-sky-200 p-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 mb-2">
                <span className="text-xl font-bold text-sky-700">G</span>
              </div>
              <h2 className="text-base font-bold text-gray-900">Grant</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Contributed: {formatCurrency(grantOriginal)}
              </p>
              <div className="mt-2 py-2 px-3 rounded-xl bg-sky-50 border border-sky-100">
                <p className="text-[11px] uppercase tracking-wider text-sky-600 font-medium">
                  Assigned Total
                </p>
                <p
                  className="text-2xl font-bold text-sky-700 tabular-nums"
                  data-testid="grant-assigned-total"
                >
                  {formatCurrency(grantAssigned)}
                </p>
              </div>
            </div>
            {/* Grant assigned items */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {investments
                .filter((inv) => inv.assignedTo === "Grant")
                .map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-sky-50/60 border border-sky-100 text-sm"
                  >
                    <span className="text-gray-700 truncate mr-2">
                      {formatDate(inv.date)}
                    </span>
                    <span className="font-semibold text-sky-700 tabular-nums whitespace-nowrap">
                      {formatCurrency(inv.amount)}
                    </span>
                  </div>
                ))}
              {investments.filter((inv) => inv.assignedTo === "Grant").length ===
                0 && (
                <p className="text-xs text-gray-400 text-center italic py-4">
                  No investments assigned yet
                </p>
              )}
            </div>
          </div>

          {/* Center - All Investments */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="text-center mb-4">
              <h2 className="text-base font-bold text-gray-900">
                All Investments
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {investments.length} records ·{" "}
                {formatCurrency(totalInvested)} total
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Click ← or → to assign · Click card to view documents
              </p>
            </div>
            <div className="space-y-2 max-h-[calc(100vh-360px)] overflow-y-auto pr-1">
              {investments.map((inv) => (
                <InvestmentCard
                  key={inv.id}
                  investment={inv}
                  onAssign={handleAssign}
                  isPending={assignMutation.isPending}
                  wasDisputed={disputedIds.has(inv.id)}
                />
              ))}
            </div>
          </div>

          {/* Haythem's Side (Right) */}
          <div className="bg-white rounded-2xl border border-amber-200 p-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-2">
                <span className="text-xl font-bold text-amber-700">H</span>
              </div>
              <h2 className="text-base font-bold text-gray-900">Haythem</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Contributed: {formatCurrency(haythemOriginal)}
              </p>
              <div className="mt-2 py-2 px-3 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-[11px] uppercase tracking-wider text-amber-600 font-medium">
                  Assigned Total
                </p>
                <p
                  className="text-2xl font-bold text-amber-700 tabular-nums"
                  data-testid="haythem-assigned-total"
                >
                  {formatCurrency(haythemAssigned)}
                </p>
              </div>
            </div>
            {/* Haythem assigned items */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {investments
                .filter((inv) => inv.assignedTo === "Haythem")
                .map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-50/60 border border-amber-100 text-sm"
                  >
                    <span className="text-gray-700 truncate mr-2">
                      {formatDate(inv.date)}
                    </span>
                    <span className="font-semibold text-amber-700 tabular-nums whitespace-nowrap">
                      {formatCurrency(inv.amount)}
                    </span>
                  </div>
                ))}
              {investments.filter((inv) => inv.assignedTo === "Haythem")
                .length === 0 && (
                <p className="text-xs text-gray-400 text-center italic py-4">
                  No investments assigned yet
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 mt-8 border-t border-gray-100">
        <a
          href="https://www.perplexity.ai/computer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-500 transition-colors"
        >
          Created with Perplexity Computer
        </a>
      </footer>
    </div>
  );
}
