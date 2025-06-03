import React from "react";
import { useHourlyTransactionsChart } from "../hooks/useHourlyTransactionsChart";

import ContractActionsStackedChart from "../components/ContractActionsStackedChart";
import TxHeatmapChart from "../components/TxHeatmapChart";
import TotalContractActionsBarChart from "../components/TotalContractActionsBarChart";
import MovingAverageChart from "../components/MovingAverageChart";

export default function ChainActivity() {
  const { chartData, hourlyData } = useHourlyTransactionsChart();

  return (
    <div className="panel-wrapper" style={{ padding: "2rem" }}>
      <h2>Chain Activity</h2>

      <div
        className="overview-section"
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "nowrap",
          marginBottom: "2rem",
        }}
      >
        <div style={{ flex: "1 1 50%", maxWidth: "50%" }}>
          <h3>Smart Contract Actions (Deploy / Update / Call)</h3>
          <ContractActionsStackedChart hourlyData={hourlyData} />
        </div>
        <div style={{ flex: "1 1 50%", maxWidth: "50%" }}>
          <h3>Total Contract Actions</h3>
          <TotalContractActionsBarChart hourlyData={hourlyData} />
        </div>
      </div>

      {/* Second Row: Heatmap + Moving Average */}
      <div className="overview-section" style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "2rem" }}>
        <div style={{ flex: "1 1 50%" }}>
          <h3>Heatmap (Transactions by Hour/Day)</h3>
          <TxHeatmapChart hourlyData={hourlyData} />
        </div>
        <div style={{ flex: "1 1 50%" }}>
          <h3>6-Hour Moving Average</h3>
          <MovingAverageChart hourlyData={hourlyData} />
        </div>
      </div>
    </div>
  );
}
