// src/components/OverviewCards.jsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import EpochCountdownDisplay from "./EpochCountdownDisplay";


export default function OverviewCards({
  totalAda,
  numberOfSPOs,
  totalTxs,
  missedBlocks,
  currentEpoch,
  timeLeft,
  progressPercent,
  chartData, // updated prop: chartData instead of old hourlyData format
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartData || !chartData.labels || !chartData.data) return;

    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Transactions",
            data: chartData.data,
            backgroundColor: "rgba(0, 194, 255, 0.2)",
            borderColor: "#00c2ff",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        layout: {
          padding: {
            bottom: 15,
          },
        },
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#fff" },
            grid: { color: "#333" },
          },
          x: {
            ticks: {
              color: "#fff",
              font: { size: 10 },
              maxRotation: 90,
              minRotation: 45,
            },
            grid: { color: "#333" },
          },
        },
        plugins: {
          legend: {
            labels: { color: "#fff" },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [chartData]);

  return (
    <div className="overview-section">
      <div className="overview" style={{ flex: "0 0 50%" }}>
        <div className="overview-row">
          <div className="card">
            <h3>Total Stake Pools</h3>
            <p id="stake-pools">{numberOfSPOs.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>Total ADA Staked</h3>
            <p id="total-ada">
              ₳{totalAda.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        <div className="overview-row">
          <div className="card">
            <h3>Total Transactions</h3>
            <p id="total-txs">{totalTxs.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>% Missed Blocks</h3>
            <p id="missed-blocks">{missedBlocks === "--" ? "--" : `${missedBlocks}%`}</p>
          </div>
        </div>
        <div className="overview-row">
          <div className="card">
            <h3>Current Epoch</h3>
            <p id="current-epoch">{currentEpoch}</p>
          </div>
          <EpochCountdownDisplay />
        </div>
      </div>

      <div className="chart-panel" style={{ flex: "1" }}>
        <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>
          Transaction Volume (Last 15 Days)
        </h2>
        <canvas id="txChart" ref={chartRef}></canvas>
      </div>
    </div>
  );
}
