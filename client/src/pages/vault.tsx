import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  FileText,
  Image,
  Download,
  ArrowLeft,
  Loader2,
  Search,
  FolderOpen,
  X,
  ChevronDown,
  ChevronRight,
  Shield,
  ExternalLink,
} from "lucide-react";

interface VaultFile {
  assetId: string;
  name: string;
  localPath: string;
  extension: string;
}

interface VaultInvestment {
  itemId: string;
  name: string;
  investor: "Grant" | "Haythem";
  amount: number;
  date: string;
  method: string;
  files: VaultFile[];
}

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

function isImageFile(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".gif") || lower.endsWith(".webp");
}

function isPdfFile(name: string): boolean {
  return name.toLowerCase().endsWith(".pdf");
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    CASH: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    WIRE: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    CARD: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    CHECK: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    "MONEY ORDER": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    "APPLE PAY": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${colors[method] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
      {method}
    </span>
  );
}

function InvestorBadge({ investor }: { investor: "Grant" | "Haythem" }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
      investor === "Grant"
        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
        : "bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
    }`}>
      {investor}
    </span>
  );
}

// Inline viewer for files
function FileViewer({ file, onClose }: { file: VaultFile; onClose: () => void }) {
  const isImage = isImageFile(file.name);
  const isPdf = isPdfFile(file.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[92vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate pr-4">
            {file.name}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={file.localPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              data-testid="modal-open-new-tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              New Tab
            </a>
            <a
              href={file.localPath}
              download={file.name}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              data-testid="modal-download"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              data-testid="close-viewer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 min-h-[400px]">
          {isPdf ? (
            <iframe
              src={file.localPath}
              className="w-full h-full min-h-[75vh]"
              title={file.name}
            />
          ) : isImage ? (
            <div className="flex items-center justify-center p-6 min-h-[400px]">
              <img
                src={file.localPath}
                alt={file.name}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-sm"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-sm text-gray-500 mb-3">This file type can't be previewed inline</p>
              <a
                href={file.localPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VaultPage() {
  const [manifest, setManifest] = useState<VaultInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [investorFilter, setInvestorFilter] = useState<"all" | "Grant" | "Haythem">("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [viewingFile, setViewingFile] = useState<VaultFile | null>(null);

  useEffect(() => {
    fetch("/vault/manifest.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load manifest");
        return res.json();
      })
      .then((data: VaultInvestment[]) => {
        setManifest(data);
        // Expand all by default
        setExpandedItems(new Set(data.map((d) => d.itemId)));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedItems(new Set(filtered.map((d) => d.itemId)));
  const collapseAll = () => setExpandedItems(new Set());

  const filtered = manifest.filter((inv) => {
    if (investorFilter !== "all" && inv.investor !== investorFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesInv =
        inv.name.toLowerCase().includes(q) ||
        inv.investor.toLowerCase().includes(q) ||
        inv.method.toLowerCase().includes(q);
      const matchesFile = inv.files.some((f) => f.name.toLowerCase().includes(q));
      return matchesInv || matchesFile;
    }
    return true;
  });

  const totalFiles = filtered.reduce((sum, inv) => sum + inv.files.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {viewingFile && <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />}

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              data-testid="back-to-tracker"
            >
              <ArrowLeft className="w-4 h-4" />
              Tracker
            </Link>
            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  KMJZ Holdings
                </h1>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                  Document Vault
                </p>
              </div>
            </div>
          </div>
          {!loading && (
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {totalFiles} files · {filtered.length} investments
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Permanently saved · always available
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Search & Filter */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search investments or files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              data-testid="vault-search"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
            {(["all", "Grant", "Haythem"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setInvestorFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  investorFilter === f
                    ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                data-testid={`vault-filter-${f}`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 text-[11px] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              data-testid="expand-all"
            >
              Expand
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 text-[11px] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              data-testid="collapse-all"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500">Loading document vault...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-sm text-red-500 mb-2">Failed to load vault</p>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No matching files found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inv) => {
              const isExpanded = expandedItems.has(inv.itemId);
              return (
                <div
                  key={inv.itemId}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow"
                  data-testid={`vault-investment-${inv.itemId}`}
                >
                  {/* Investment Header — clickable to expand/collapse */}
                  <button
                    onClick={() => toggleExpanded(inv.itemId)}
                    className="w-full px-5 py-3.5 bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-left hover:bg-gray-100/60 dark:hover:bg-gray-800/80 transition-colors"
                    data-testid={`toggle-${inv.itemId}`}
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        inv.investor === "Grant"
                          ? "bg-gradient-to-br from-blue-500 to-blue-700"
                          : "bg-gradient-to-br from-teal-500 to-teal-700"
                      }`}>
                        {inv.investor[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {formatCurrency(inv.amount)}
                          </span>
                          <InvestorBadge investor={inv.investor} />
                          <MethodBadge method={inv.method} />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {inv.name} · {formatDate(inv.date)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium flex-shrink-0">
                      {inv.files.length} {inv.files.length === 1 ? "file" : "files"}
                    </span>
                  </button>

                  {/* Files List */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                      {inv.files.map((file, idx) => {
                        const isImg = isImageFile(file.name);
                        const isPdf = isPdfFile(file.name);

                        return (
                          <div
                            key={file.assetId}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group cursor-pointer"
                            onClick={() => setViewingFile(file)}
                            data-testid={`vault-file-${file.assetId}`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isImg
                                ? "bg-sky-50 text-sky-500 dark:bg-sky-900/30 dark:text-sky-400"
                                : isPdf
                                  ? "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                            }`}>
                              {isImg ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 min-w-0 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                              {file.name}
                            </span>
                            <div className="flex items-center gap-1.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                                Click to view
                              </span>
                              <a
                                href={file.localPath}
                                download={file.name}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                data-testid={`vault-download-${file.assetId}`}
                              >
                                <Download className="w-3 h-3" />
                                Save
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">
            All files saved permanently — no expiring links
          </p>
          <a
            href="https://www.perplexity.ai/computer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            Created with Perplexity Computer
          </a>
        </div>
      </footer>
    </div>
  );
}
