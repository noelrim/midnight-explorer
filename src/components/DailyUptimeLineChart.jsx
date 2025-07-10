import React, { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip
);

export default function DailyUptimeLineChart({ dailyData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const dailyChartData = dailyData || [];
  const isLoading = false;
  const isError = false;

  useEffect(() => {
    if (isLoading || isError || !dailyChartData.length) return;

    const sortedData = [...dailyChartData].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const labels = sortedData.map((entry) => entry.date);
    const uptimes = sortedData.map((entry) => entry.uptimePercent);

    const pointColors = uptimes.map((uptime) => {
      if (uptime < 99) return "rgba(255, 80, 80, 1)";       // Red
      if (uptime < 99.9) return "rgba(255, 165, 0, 1)";     // Orange
      return "rgba(0, 194, 100, 1)";                        // Green
    });

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
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
            grid: { color: "#333" },
          },
          y: {
            beginAtZero: true,
            suggestedMax: 100,
            ticks: { color: "#fff" },
            grid: { color: "#333" },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.raw}% uptime on ${ctx.label}`,
            },
          },
          legend: { labels: { color: "#fff" } },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [dailyChartData, isLoading, isError]);

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  );
}
