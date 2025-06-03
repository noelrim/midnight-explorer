// src/components/TxHeatmapChart.jsx
import React, { useEffect, useRef } from "react";
import {
  Chart,
  LinearScale,
  Tooltip,
  Title,
  Legend
} from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { useHourlyTransactionsChart } from "../hooks/useHourlyTransactionsChart";

// Register matrix components
Chart.register(
  MatrixController,
  MatrixElement,
  LinearScale,
  Tooltip,
  Title,
  Legend
);

export default function TxHeatmapChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { hourlyData } = useHourlyTransactionsChart();

  useEffect(() => {
    if (!Object.keys(hourlyData).length) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    // Extract all days from keys
    const days = Array.from(
      new Set(Object.keys(hourlyData).map(k => k.split("T")[0]))
    ).sort();

    const matrixData = [];

    days.forEach((day, x) => {
      for (let hour = 0; hour < 24; hour++) {
        const hourStr = hour.toString().padStart(2, "0");
        const id = `${day}T${hourStr}`;
        const entry = hourlyData[id] || {};
        const count = entry.TotalTransactions || 0;

        matrixData.push({ x, y: hour, v: count });
      }
    });

    chartInstance.current = new Chart(ctx, {
      type: "matrix",
      data: {
        datasets: [
          {
            label: "Hourly Transactions",
            data: matrixData,
            backgroundColor: (ctx) => {
              const v = ctx.raw.v;
              return `rgba(0, 194, 255, ${Math.min(1, v / 50)})`;
            },
            borderColor: "#222",
            borderWidth: 0.5,
            width: () => 20,
            height: () => 20,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear",
            ticks: {
              color: "#fff",
              callback: (val) => days[val] || "",
              maxRotation: 90,
              minRotation: 45,
            },
            grid: { color: "#333" }
          },
          y: {
            ticks: {
              color: "#fff",
              callback: (v) => `${v}:00`
            },
            grid: { color: "#333" }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const day = days[ctx.raw.x];
                return `${ctx.raw.v} txs @ ${ctx.raw.y}:00 on ${day}`;
              }
            }
          },
          legend: { display: false },
                   datalabels: {
      display: false  // 👈 This hides the value labels on the chart
    }
        }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [hourlyData]);

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  );
}
