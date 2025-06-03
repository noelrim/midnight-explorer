import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useHourlyTransactionsChart } from "../hooks/useHourlyTransactionsChart";

export default function MovingAverageChart() {
  const { hourlyData } = useHourlyTransactionsChart();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!Object.keys(hourlyData).length) return;

    const entries = Object.entries(hourlyData).sort(([a], [b]) => a.localeCompare(b));
    const values = entries.map(([_, v]) => v.TotalTransactions || 0);
    const labels = entries.map(([k]) => k);

    const movingAvg = values.map((_, i, arr) => {
      const slice = arr.slice(Math.max(0, i - 5), i + 1);
      const avg = slice.reduce((sum, val) => sum + val, 0) / slice.length;
      return avg;
    });

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "6-hour Moving Avg",
          data: movingAvg,
          borderColor: "#00c2ff",
          backgroundColor: "rgba(0, 194, 255, 0.2)",
          fill: true,
          tension: 0.3,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#fff" },
            grid: { color: "#444" }
          },
          x: {
            ticks: { color: "#fff", maxRotation: 60 },
            grid: { color: "#444" }
          }
        },
        plugins: {
          legend: { labels: { color: "#fff" } },
          datalabels: {
      display: false  // 👈 This hides the value labels on the chart
    }
        }
      }
    });
  }, [hourlyData]);

  return <canvas ref={chartRef} />;
}
