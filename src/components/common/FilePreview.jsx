import React, { useState } from "react";
import { API_BASE_URL } from "../../API/config.js";

/**
 * FilePreview — Universal Image & PDF Preview Component
 *
 * Usage:
 *   <FilePreview src="uploads/bgv_123.png" filename="Aadhaar.png" />
 *   <FilePreview src="https://res.cloudinary.com/..." filename="doc.pdf" />
 *
 * Props:
 *   src       — relative path ("uploads/xxx.pdf") OR full URL
 *   filename  — display name (optional)
 *   label     — small label shown above the preview card (optional)
 */

const API_BASE = API_BASE_URL || "http://localhost:5000";

/** Build a browser-accessible URL from whatever the backend stored */
export function buildFileUrl(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const clean = src.startsWith("/") ? src : `/${src}`;
  return `${API_BASE}${clean}`;
}

function checkIsPdf(src = "") {
  return (
    src.toLowerCase().endsWith(".pdf") ||
    src.includes("application/pdf") ||
    src.includes("/raw/upload/")
  );
}

/* ────────── Full-screen Modal ────────── */
function PreviewModal({ url, filename, onClose }) {
  const pdf = checkIsPdf(url);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1a1a2e",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "90vw",
          maxHeight: "92vh",
          width: pdf ? "900px" : "auto",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(99,102,241,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>{pdf ? "📄" : "🖼️"}</span>
            <span
              style={{
                color: "#e2e8f0",
                fontWeight: 600,
                fontSize: "14px",
                maxWidth: "480px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {filename || "File Preview"}
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <a
              href={url}
              download={filename || "file"}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(99,102,241,0.4)",
                color: "#a5b4fc",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              ⬇ Download
            </a>
            <button
              onClick={onClose}
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f0f23",
          }}
        >
          {pdf ? (
            <iframe
              src={`${url}#toolbar=1&view=FitH`}
              title={filename || "PDF Preview"}
              style={{ width: "100%", height: "78vh", border: "none" }}
            />
          ) : (
            <img
              src={url}
              alt={filename || "Preview"}
              style={{
                maxWidth: "100%",
                maxHeight: "78vh",
                objectFit: "contain",
                borderRadius: "4px",
                padding: "16px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────── Main Export ────────── */
export default function FilePreview({ src, filename, label }) {
  const [open, setOpen] = useState(false);
  const url = buildFileUrl(src);

  if (!url) return null;

  const pdf = checkIsPdf(url);
  const displayName = filename || src?.split("/").pop() || "File";

  return (
    <>
      <div style={{ display: "inline-flex", flexDirection: "column", gap: "6px", maxWidth: "240px" }}>
        {label && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </span>
        )}

        <div
          onClick={() => setOpen(true)}
          title="Click to preview"
          style={{
            cursor: "pointer",
            border: "1.5px solid rgba(99,102,241,0.3)",
            borderRadius: "10px",
            overflow: "hidden",
            background: "rgba(15,15,35,0.8)",
            transition: "all 0.25s ease",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(99,102,241,0.7)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {pdf ? (
            <div
              style={{
                padding: "20px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                minWidth: "140px",
              }}
            >
              <span style={{ fontSize: "38px" }}>📄</span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#cbd5e1",
                  textAlign: "center",
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                }}
              >
                {displayName}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  background: "rgba(239,68,68,0.15)",
                  color: "#fca5a5",
                  padding: "2px 10px",
                  borderRadius: "4px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                PDF
              </span>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <img
                src={url}
                alt={displayName}
                style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextSibling) {
                    e.currentTarget.nextSibling.style.display = "flex";
                  }
                }}
              />
              {/* Error fallback */}
              <div
                style={{
                  display: "none",
                  width: "100%",
                  height: "130px",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "6px",
                  color: "#64748b",
                }}
              >
                <span style={{ fontSize: "28px" }}>🖼️</span>
                <span style={{ fontSize: "11px" }}>Image unavailable</span>
              </div>
            </div>
          )}

          {/* "Preview" overlay badge */}
          <div
            style={{
              position: "absolute",
              bottom: "6px",
              right: "6px",
              background: "rgba(0,0,0,0.6)",
              color: "#a5b4fc",
              padding: "3px 8px",
              borderRadius: "5px",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.03em",
              pointerEvents: "none",
            }}
          >
            👁 Preview
          </div>
        </div>
      </div>

      {open && (
        <PreviewModal url={url} filename={displayName} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
