import { useState, useEffect } from "react";
import {
  FileText,
  Eye,
  X,
  ExternalLink,
  Maximize2,
  FileCheck,
} from "lucide-react";
import { API_BASE_URL } from "../../API/config.js";

const API_BASE = API_BASE_URL || "http://localhost:5000";

/**
 * Robust document URL resolver with local development CDN fallback
 */
export const resolveDocUrl = (path) => {
  if (!path || typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  let clean = trimmed.replace(/\\/g, "/");
  if (clean.startsWith("/")) clean = clean.slice(1);
  if (!clean.startsWith("uploads/")) {
    clean = `uploads/${clean}`;
  }
  // In local development, bypass localhost TCP timeouts by using the production CDN directly
  const isLocalDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  const base = isLocalDev ? "https://api.dqnex.online" : API_BASE;
  return `${base.replace(/\/+$/, "")}/${clean}`;
};

/**
 * Universal CaseDocumentViewer Component
 * Provides a uniform, high-quality document preview card with inline iframe/image,
 * Expand modal, and New Tab action across all Cases and Candidate views.
 */
export default function CaseDocumentViewer({
  url,
  cleanPath,
  title = "Candidate Uploaded Document",
  headerTitle = "CANDIDATE UPLOADED DOCUMENT",
  tag,
  noDocMessage = "No document uploaded",
  previewHeight = "h-72",
  className = "",
  compact = false,
}) {
  const resolvedUrl = resolveDocUrl(url || cleanPath);
  const [imgSrc, setImgSrc] = useState(resolvedUrl);
  const [isLoading, setIsLoading] = useState(Boolean(resolvedUrl));
  const [hasError, setHasError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setImgSrc(resolvedUrl);
    setIsLoading(Boolean(resolvedUrl));
    setHasError(false);
  }, [resolvedUrl]);

  const lUrl = resolvedUrl ? resolvedUrl.toLowerCase() : "";
  const isPdf = lUrl.endsWith(".pdf") || lUrl.includes(".pdf");
  const detectedTag = tag || (isPdf ? "PDF" : "Image");

  const rawPath = cleanPath || url || "";
  const fileName = rawPath
    ? String(rawPath).replace(/\\/g, "/").split("/").pop()
    : "document";

  // If no document was uploaded:
  if (!resolvedUrl) {
    return (
      <div
        className={`w-full bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center min-h-[220px] ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <FileText size={24} />
        </div>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          {title || "Uploaded Document"}
        </p>
        <p className="text-xs text-slate-400 mt-1 font-medium">{noDocMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`w-full bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col gap-3 transition hover:shadow-md ${className}`}
      >
        {/* Top Header Row */}
        <div className="w-full flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-wider text-[#01026E] uppercase">
              {headerTitle}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-sm font-bold text-slate-800 truncate max-w-[200px]"
                title={title}
              >
                {title}
              </span>
              {detectedTag && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {detectedTag}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#01026E] text-white hover:bg-indigo-900 text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            title="View Full Document"
          >
            <Eye size={14} /> View
          </button>
        </div>

        {/* Document Preview Area */}
        <div
          onClick={() => !hasError && setShowModal(true)}
          className={`w-full bg-slate-50/60 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-2 relative group ${
            !hasError ? "cursor-pointer" : ""
          } ${compact ? "min-h-[180px] max-h-[260px]" : "min-h-[240px] max-h-[380px]"}`}
          title={!hasError ? "Click to expand full size" : ""}
        >
          {isPdf ? (
            <iframe
              src={`${resolvedUrl}#toolbar=0`}
              title={title || "Uploaded Document PDF"}
              className={`w-full ${previewHeight} rounded-lg border border-slate-200/80 pointer-events-none bg-white`}
            />
          ) : (
            <>
              {isLoading && !hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 z-10">
                  <div className="w-7 h-7 border-2 border-indigo-200 border-t-[#01026E] rounded-full animate-spin mb-2" />
                  <span className="text-[11px] text-slate-400 font-medium animate-pulse">
                    Loading preview...
                  </span>
                </div>
              )}

              {hasError ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <FileText className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500 mb-2">
                    Preview unavailable directly
                  </p>
                  <a
                    href={imgSrc || resolvedUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100"
                  >
                    Open Document &rarr;
                  </a>
                </div>
              ) : (
                <>
                  <img
                    src={imgSrc}
                    alt={title || "Uploaded Document"}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    onLoad={() => setIsLoading(false)}
                    className={`rounded-lg max-h-72 w-auto max-w-full object-contain select-none transition-all duration-300 ${
                      isLoading
                        ? "opacity-0"
                        : "opacity-100 group-hover:scale-[1.02]"
                    }`}
                    onError={() => {
                      if (imgSrc && imgSrc.includes("localhost:5000")) {
                        setImgSrc(
                          imgSrc.replace(
                            "http://localhost:5000",
                            "https://api.dqnex.online"
                          )
                        );
                      } else if (
                        imgSrc &&
                        imgSrc.includes("https://api.dqnex.online") &&
                        typeof window !== "undefined" &&
                        window.location.hostname === "localhost"
                      ) {
                        setImgSrc(
                          imgSrc.replace(
                            "https://api.dqnex.online",
                            "http://localhost:5000"
                          )
                        );
                      } else {
                        setIsLoading(false);
                        setHasError(true);
                      }
                    }}
                  />
                </>
              )}
            </>
          )}
        </div>

        {/* Footer Controls: Filename + Expand + New Tab */}
        <div className="flex items-center justify-between w-full pt-1 px-1 text-xs text-slate-500">
          <span
            className="truncate max-w-[170px] sm:max-w-[200px] text-left font-mono text-[11px] text-slate-600 font-medium"
            title={fileName}
          >
            {fileName}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer active:scale-95"
            >
              <Maximize2 size={12} /> Expand
            </button>
            <a
              href={imgSrc || resolvedUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition active:scale-95 border border-indigo-100"
            >
              <ExternalLink size={12} /> New Tab
            </a>
          </div>
        </div>
      </div>

      {/* Full Resolution Modal View */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-[#01026E] rounded-xl">
                  <FileCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {title || "Candidate Uploaded Document"}
                  </h3>
                  <p className="text-[11px] font-mono text-gray-500">{fileName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={imgSrc || resolvedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition shadow-sm"
                >
                  <ExternalLink size={14} /> Open in New Tab
                </a>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-900/5 min-h-[400px]">
              {isPdf ? (
                <iframe
                  src={`${resolvedUrl}#toolbar=1`}
                  title="Document Preview Full"
                  className="w-full h-[75vh] rounded-xl border border-gray-200 bg-white"
                />
              ) : (
                <img
                  src={imgSrc || resolvedUrl}
                  alt={title || "Full Resolution Document"}
                  className="max-h-[75vh] max-w-full w-auto object-contain rounded-xl shadow-md select-none"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-slate-50 text-xs text-gray-500">
              <span>Candidate Case Verification Document</span>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 bg-[#01026E] hover:bg-indigo-900 text-white rounded-xl font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

