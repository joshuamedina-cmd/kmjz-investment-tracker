import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Image,
  Download,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Search,
  FolderOpen,
  Eye,
  X,
} from "lucide-react";

interface FileItem {
  assetId: number;
  name: string;
  url: string;
}

interface InvestmentWithFiles {
  id: string;
  name: string;
  investor: "Grant" | "Haythem";
  amount: number;
  date: string;
  method: string;
  verified: string;
  files: FileItem[];
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

// Fetch a fresh signed URL from Monday.com for a specific asset
async function getFreshUrl(assetId: number): Promise<string> {
  const res = await apiRequest("GET", `/api/files/download/${assetId}`);
  const data = await res.json();
  if (!data.url) throw new Error("No URL returned");
  return data.url;
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

function InvestorBadge({ investor }: { investor: "Grant" | "Haythem" }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
        investor === "Grant"
          ? "bg-blue-50 text-blue-700"
          : "bg-teal-50 text-teal-700"
      }`}
    >
      {investor}
    </span>
  );
}

function FilePreviewModal({
  file,
  onClose,
}: {
  file: FileItem;
  onClose: () => void;
}) {
  const [freshUrl, setFreshUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch fresh URL on mount
  useEffect(() => {
    getFreshUrl(file.assetId)
      .then((url) => {
        setFreshUrl(url);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [file.assetId]);

  const isImage =
    file.name.toLowerCase().endsWith(".jpg") ||
    file.name.toLowerCase().endsWith(".png") ||
    file.name.toLowerCase().endsWith(".jpeg");

  const handleOpen = async () => {
    try {
      const url = await getFreshUrl(file.assetId);
      window.open(url, "_blank");
    } catch {
      // fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 truncate pr-4">
            {file.name}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              data-testid="modal-open-file"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              data-testid="close-preview-modal"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-4 min-h-[300px]">
          {loading ? (
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Loading preview...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-sm text-red-500">Failed to load preview</p>
            </div>
          ) : isImage && freshUrl ? (
            <img
              src={freshUrl}
              alt={file.name}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
            />
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500 mb-3">
                PDF and document previews open in a new tab
              </p>
              <button
                onClick={handleOpen}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Button that fetches a fresh URL then performs an action
function FreshUrlButton({
  assetId,
  action,
  className,
  children,
  "data-testid": testId,
}: {
  assetId: number;
  action: "open" | "download";
  className: string;
  children: React.ReactNode;
  "data-testid"?: string;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    setLoading(true);
    try {
      const url = await getFreshUrl(assetId);
      if (action === "open") {
        window.open(url, "_blank");
      } else {
        // Download: create a temporary link and click it
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch {
      toast({
        title: "Failed to get file",
        description: "Could not fetch a fresh download link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className}
      data-testid={testId}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

export default function FilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [investorFilter, setInvestorFilter] = useState<"all" | "Grant" | "Haythem">("all");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const { data: investments, isLoading, error } = useQuery<InvestmentWithFiles[]>({
    queryKey: ["/api/files"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/files");
      return res.json();
    },
    staleTime: 0,
  });

  const filtered = (investments || []).filter((inv) => {
    if (investorFilter !== "all" && inv.investor !== investorFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesInv =
        inv.name.toLowerCase().includes(q) ||
        inv.investor.toLowerCase().includes(q) ||
        inv.method.toLowerCase().includes(q);
      const matchesFile = inv.files.some((f) =>
        f.name.toLowerCase().includes(q)
      );
      return matchesInv || matchesFile;
    }
    return true;
  });

  const totalFiles = filtered.reduce((sum, inv) => sum + inv.files.length, 0);
  const investmentsWithFiles = filtered.filter((inv) => inv.files.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              data-testid="back-to-tracker"
            >
              <ArrowLeft className="w-4 h-4" />
              Tracker
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 leading-tight">
                  KMJZ Holdings
                </h1>
                <p className="text-[11px] text-gray-500 leading-tight">
                  Investment Documents
                </p>
              </div>
            </div>
          </div>
          {!isLoading && (
            <div className="text-right">
              <p className="text-xs text-gray-500">
                {totalFiles} files across {investmentsWithFiles.length} investments
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">
                Live from Monday.com
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search investments or files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              data-testid="search-files"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1">
            {(["all", "Grant", "Haythem"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setInvestorFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  investorFilter === f
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                data-testid={`filter-${f}`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500">
              Fetching files from Monday.com...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-sm text-red-500 mb-2">
              Failed to load files from Monday.com
            </p>
            <p className="text-xs text-gray-400">
              Please check the API connection and try again
            </p>
          </div>
        ) : investmentsWithFiles.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No files found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {investmentsWithFiles.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                data-testid={`investment-files-${inv.id}`}
              >
                {/* Investment Header */}
                <div className="px-5 py-3.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        inv.investor === "Grant"
                          ? "bg-gradient-to-br from-blue-500 to-blue-700"
                          : "bg-gradient-to-br from-teal-500 to-teal-700"
                      }`}
                    >
                      {inv.investor[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(inv.amount)}
                        </span>
                        <InvestorBadge investor={inv.investor} />
                        <MethodBadge method={inv.method} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {inv.name} · {formatDate(inv.date)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {inv.files.length} {inv.files.length === 1 ? "file" : "files"}
                  </span>
                </div>

                {/* Files List */}
                <div className="divide-y divide-gray-50">
                  {inv.files.map((file, idx) => {
                    const isImage =
                      file.name.toLowerCase().endsWith(".jpg") ||
                      file.name.toLowerCase().endsWith(".png") ||
                      file.name.toLowerCase().endsWith(".jpeg");
                    const isPdf = file.name.toLowerCase().endsWith(".pdf");

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors group"
                        data-testid={`file-row-${inv.id}-${idx}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isImage
                              ? "bg-sky-50 text-sky-500"
                              : isPdf
                                ? "bg-red-50 text-red-500"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isImage ? (
                            <Image className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700 truncate flex-1 min-w-0">
                          {file.name}
                        </span>
                        <div className="flex items-center gap-1.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                          {isImage && (
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                              data-testid={`preview-${inv.id}-${idx}`}
                            >
                              <Eye className="w-3 h-3" />
                              Preview
                            </button>
                          )}
                          <FreshUrlButton
                            assetId={file.assetId}
                            action="open"
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                            data-testid={`open-${inv.id}-${idx}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open
                          </FreshUrlButton>
                          <FreshUrlButton
                            assetId={file.assetId}
                            action="download"
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            data-testid={`download-${inv.id}-${idx}`}
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </FreshUrlButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/50 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">
            Files are fetched live from Monday.com — fresh download link on every click
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
