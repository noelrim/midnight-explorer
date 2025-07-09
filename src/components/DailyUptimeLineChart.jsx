import React, { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale
} from "chart.js";
import { useHourlyTransactionsChart } from "../hooks/useHourlyTransactionsChart";

// Register necessary Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip
);

export default function DailyUptimeLineChart({ hourlyData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!Object.keys(hourlyData).length) return;

    const dailyBlocks = {};

    // Aggregate total blocks per day from hourlyData
    Object.entries(hourlyData).forEach(([id, data]) => {
      const [day] = id.split("T");
      const blocks = data.TotalBlocks ?? 0;
      dailyBlocks[day] = (dailyBlocks[day] || 0) + blocks;
    });

    const sortedDays = Object.keys(dailyBlocks).sort();
    const dailyExpectedBlocks = {};
    Object.entries(hourlyData).forEach(([id, data]) => {
      const [day] = id.split("T");
      const expected = data.ExpectedBlocks ?? 600;
      dailyExpectedBlocks[day] = (dailyExpectedBlocks[day] || 0) + expected;
    });

    const uptimes = sortedDays.map((day) => {
      const blocks = dailyBlocks[day];
      const expected = dailyExpectedBlocks[day] || 1; // prevent divide-by-zero
      const uptime = (blocks / expected) * 100;
      return parseFloat(uptime.toFixed(3));
});

    const pointColors = uptimes.map((uptime) => {
      if (uptime < 99) return "rgba(255, 80, 80, 1)";         // Red
      if (uptime < 99.9) return "rgba(255, 165, 0, 1)";       // Orange
      return "rgba(0, 194, 100, 1)";                          // Green
    });

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: sortedDays,
        datasets: [
          {
            label: "Daily Uptime (%)",
            data: uptimes,
            borderColor: "rgba(150, 150, 150, 0.4)",
            backgroundColor: pointColors,
            pointBackgroundColor: pointColors,
            pointBorderColor: pointColors,
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: "#fff" },
            grid: { color: "#333" }
          },
          y: {
            beginAtZero: true,
            suggestedMax: 100,
            ticks: { color: "#fff" },
            grid: { color: "#333" }
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.raw}% uptime on ${ctx.label}`
            }
          },
          legend: { labels: { color: "#fff" } },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [hourlyData]);

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  );
}
