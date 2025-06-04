import React, { useState, useMemo } from "react";
import { useHourlyTransactionsChart } from "../hooks/useHourlyTransactionsChart";
import DownloadCSVButton from "../components/DownloadCSVButton";
import ContractActionsStackedChart from "../components/ContractActionsStackedChart";
import TxHeatmapChart from "../components/TxHeatmapChart";
import TotalContractActionsBarChart from "../components/TotalContractActionsBarChart";
import MovingAverageChart from "../components/MovingAverageChart";

export default function ChainActivity() {
  const { hourlyData } = useHourlyTransactionsChart();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return hourlyData;

    return Object.fromEntries(
      Object.entries(hourlyData).filter(([timestamp]) => {
        const date = timestamp.split("T")[0];
        return date >= startDate && date <= endDate;
      })
    );
  }, [hourlyData, startDate, endDate]);

  return (
    <div className="panel-wrapper" style={{ padding: "2rem" }}>
      <h2>Chain Activity</h2>

      {/* Date Pickers */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Start Date:{" "}
          <input type="date" value={startDate}   className="dark-date-input" onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label style={{ marginLeft: "1rem" , marginRight: "1rem" }}>
          End Date:{" "}
          <input type="date" value={endDate}    className="dark-date-input"  onChange={(e) => setEndDate(e.target.value)} />
        </label>
       <DownloadCSVButton
        data={Object.entries(filteredData).map(([timestamp, entry]) => ({
          timestamp,
          ...entry
        }))}
        filename="chain-activity.csv"
        label="Download Chain Activity"
      />
      </div>

      {/* First Row: Stacked + Total Bar */}
      <div className="overview-section" style={{ display: "flex", gap: "2rem", flexWrap: "nowrap", marginBottom: "2rem" }}>
        <div style={{ flex: "1 1 50%", maxWidth: "50%" }}>
          <h3>Smart Contract Actions (Deploy / Update / Call)</h3>
          <ContractActionsStackedChart hourlyData={filteredData} />
        </div>
        <div style={{ flex: "1 1 50%", maxWidth: "50%" }}>
          <h3>Total Contract Actions</h3>
          <TotalContractActionsBarChart hourlyData={filteredData} />
        </div>
      </div>

      {/* Second Row: Heatmap + Moving Average */}
      <div className="overview-section" style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "2rem" }}>
        <div style={{ flex: "1 1 50%" }}>
          <h3>Heatmap (Transactions by Hour/Day)</h3>
          <TxHeatmapChart hourlyData={filteredData} />
        </div>
        <div style={{ flex: "1 1 50%" }}>
          <h3>6-Hour Moving Average</h3>
          <MovingAverageChart hourlyData={filteredData} />
        </div>
      </div>
    </div>
  );
}
