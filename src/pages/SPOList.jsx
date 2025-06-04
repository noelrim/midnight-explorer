import React, { useMemo, useState, useEffect } from "react";
import RegistrationChart from "../components/RegistrationChart";
import { useSPOList } from "../hooks/useSPOList";
import SPODetailsCard from "../components/SPODetailsCard";
import SPOPieCharts from "../components/SPOPieCharts";
import DownloadCSVButton from "../components/DownloadCSVButton";

import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

export default function SPOList() {
  const [expandedSpoKey, setExpandedSpoKey] = useState(null);

  // ✅ Use the new SPO list hook
  const {spos} = useSPOList();

  const [sorting, setSorting] = useState([
    { id: "CardanoEpoch", desc: true }
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = useMemo(() => {
    let list = spos;

    if (typeFilter !== "All") {
      list = list.filter((spo) => spo.Type === typeFilter);
    }

    if (globalFilter) {
      const q = globalFilter.toLowerCase();
      list = list.filter(
        (spo) =>
          spo.Name?.toLowerCase().includes(q) ||
          spo.Ticker?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [spos, globalFilter, typeFilter]);

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => [
    columnHelper.accessor("Ticker", {
      header: "Ticker",
      cell: info => {
        const row = info.row.original;
        const isExpanded = row.AuraPubKey === expandedSpoKey;

        return (
          <span
            style={{ color: "#00c2ff", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => setExpandedSpoKey(isExpanded ? null : row.AuraPubKey)}
          >
            {info.getValue() || "—"} {isExpanded ? "▲" : "▼"}
          </span>
        );
      }
    }),
    columnHelper.accessor("Name", {
      header: "Name",
      cell: info => info.getValue() || "—"
    }),
    columnHelper.accessor("CardanoPoolID", {
      header: "Pool ID",
      cell: info => (
        <span className="tooltip">
          {info.getValue()?.slice(0, 12) || "—"}
          <span className="tooltip-text">{info.getValue() || "—"}</span>
        </span>
      )
    }),
    columnHelper.accessor("Stake", {
      header: "Stake",
      cell: info => info.getValue()?.toLocaleString() || "—"
    }),
    columnHelper.accessor("CardanoEpoch", {
      header: "Epoch",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("HomePage", {
      header: "Homepage",
      cell: info => {
        const url = info.getValue();
        return url ? (
          <a href={url} target="_blank" rel="noreferrer">Visit</a>
        ) : "—";
      }
    }),
    columnHelper.accessor("blockcount", {
      header: "Blocks Produced",
      cell: info => info.getValue() ?? "—"
    }),
  ], [expandedSpoKey]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize }
    }
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const uniqueTypes = useMemo(() => {
    const types = new Set(spos.map(spo => spo.Type).filter(Boolean));
    return ["All", ...Array.from(types)];
  }, [spos]);

  if (spos.length === 0) {
    return <div style={{ padding: "2rem" }}>Loading SPOs...</div>;
  }

  return (
    <div className="panel-wrapper" style={{ padding: "2rem" }}>
      <div className="spo-analytics-row" style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div style={{ flex: 5 }}>
          <RegistrationChart />
        </div>
        <div style={{ flex: 5 }}>
          <SPOPieCharts spoList={filtered} />
        </div>
      </div>
      
      <h3>Registrations</h3>
      <div style={{ width: "200px" }}>
          <DownloadCSVButton
          data={Object.entries(spos).map(([timestamp, entry]) => ({
            timestamp,
            ...entry
          }))}
          label="Download SPOs"
          filename="chain-activity.csv"
        />
    </div>
      <div className="spo-controls">
        <div className="spo-left-controls">
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="spo-input"
          />
          <label>
            <span>Type</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="spo-select"
            >
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="spo-pagination">
          <label>
            <span>SPOs/page</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="spo-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={100}>100</option>
              <option value={300}>300</option>
            </select>
          </label>

          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Prev
          </button>
          
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </button>
        </div>
      </div>

      <table className="spo-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" ? " 🔼" : ""}
                  {header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            const spo = row.original;
            const isExpanded = spo.AuraPubKey === expandedSpoKey;

            return (
              <React.Fragment key={row.id}>
                <tr>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={columns.length}>
                      <div style={{ padding: "1rem", backgroundColor: "#1c1c24", borderRadius: "4px" }}>
                        <SPODetailsCard authorKey={spo.AuraPubKey} />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
