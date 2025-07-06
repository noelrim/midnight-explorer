import React from "react";

export default function DownloadCSVButton({ data, filename = "export.csv", label = "Download CSV" }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const handleDownload = () => {
    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
      headers.map(header => JSON.stringify(row[header] ?? "")).join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} style={{ padding: "0.5rem 1rem", borderRadius: "4px", background: "#00c2ff", color: "#fff", border: "none" }}>
      {label}
    </button>
  );
}