import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useHourlyTransactionsChart } from "../hooks/useHourlyTransactionsChart";

export default function ContractActionsStackedChart({hourlyData}) {

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  useEffect(() => {


if (!Object.keys(hourlyData).length) return;

const dailyTotals = {};

for (const hourKey in hourlyData) {
  const day = hourKey.split("T")[0]; // Extract "YYYY-MM-DD"
  const { Deploy = 0, Update = 0, Call = 0 } = hourlyData[hourKey];

  if (!dailyTotals[day]) {
    dailyTotals[day] = { Deploy: 0, Update: 0, Call: 0 };
  }

  dailyTotals[day].Deploy += Deploy;
  dailyTotals[day].Update += Update;
  dailyTotals[day].Call += Call;
}

// Sort the dates
const sortedDays = Object.keys(dailyTotals).sort();

const labels = sortedDays;
const deploys = sortedDays.map(day => dailyTotals[day].Deploy);
const updates = sortedDays.map(day => dailyTotals[day].Update);
const calls = sortedDays.map(day => dailyTotals[day].Call);

    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Deploy",
            data: deploys,
            backgroundColor: "rgba(0, 194, 255, 0.3)",
            borderColor: "#00c2ff",
            fill: true,
            stack: "stack",
          },
          {
            label: "Update",
            data: updates,
            backgroundColor: "rgba(0, 122, 204, 0.3)",
            borderColor: "#007acc",
            fill: true,
            stack: "stack",
          },
          {
            label: "Call",
            data: calls,
            backgroundColor: "rgba(0, 64, 128, 0.3)",
            borderColor: "#004080",
            fill: true,
            stack: "stack",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: { color: "#fff", maxRotation: 45, minRotation: 30 },
            grid: { color: "#444" },
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#fff" },
            grid: { color: "#444" },
          },
        },
        plugins: {
          legend: { labels: { color: "#fff" } },
        },
      },
    });
  }, [hourlyData]);

  return <canvas ref={chartRef} />;
}
