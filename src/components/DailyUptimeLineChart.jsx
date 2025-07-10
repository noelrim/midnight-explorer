import React, { useEffect, useRef, useState } from "react";
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
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  ChartDataLabels
);

export default function DailyUptimeLineChart({ dailyData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [aggregationMode, setAggregationMode] = useState("weekly");

  const isLoading = false;
  const isError = false;

  const aggregateUptime = (data, mode) => {
    const groupKey = (dateStr) => {
      const date = new Date(dateStr);
      if (mode === "weekly") {
        const year = date.getFullYear();
        const jan1 = new Date(year, 0, 1);
        const dayOfYear = Math.floor((date - jan1) / (1000 * 60 * 60 * 24)) + 1;
        const week = Math.ceil((dayOfYear + jan1.getDay()) / 7);
        return `${year}-W${String(week).padStart(2, "0")}`;
      } else if (mode === "monthly") {
        return dateStr.slice(0, 7); // "YYYY-MM"
      }
      return dateStr;
    };

    const grouped = {};
    data.forEach(({ date, blockCount, expectedBlocks }) => {
      if (!date) return;
      const key = groupKey(date);
      if (!grouped[key]) grouped[key] = { totalBlocks: 0, totalExpected: 0 };
      grouped[key].totalBlocks += blockCount || 0;
      grouped[key].totalExpected += expectedBlocks || 1;
    });

    return Object.entries(grouped).map(([label, { totalBlocks, totalExpected }]) => ({
      label,
      uptime: parseFloat(((totalBlocks / totalExpected) * 100).toFixed(2)),
    }));
  };

  useEffect(() => {
    if (isLoading || isError || !dailyData?.length) return;

    const chartData = aggregateUptime(dailyData, aggregationMode);
    const labels = chartData.map((entry) => entry.label);
    const uptimes = chartData.map((entry) => entry.uptime);

    const pointColors = uptimes.map((uptime) => {
      if (uptime < 99) return "rgba(255, 80, 80, 1)";
      if (uptime < 99.9) return "rgba(255, 165, 0, 1)";
      return "rgba(0, 194, 100, 1)";
    });

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Uptime (%)",
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
          datalabels: {
            display: false, 
            color: "#fff",
            align: "bottom",
            anchor: "end",
            font: {
              size: 11,
              weight: "bold",
            },
            formatter: (value) => `${value}%`,
          },
          legend: {  display: false, },
        },
      },
    });
    if (chartData.length <= 30) {
      chartInstance.current.options.plugins.datalabels.display = true;
      chartInstance.current.update();
    }
    return () => chartInstance.current?.destroy();
  }, [dailyData, aggregationMode, isLoading, isError]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <select
          value={aggregationMode}
          onChange={(e) => setAggregationMode(e.target.value)}
          style={{
            padding: "4px 8px",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 4,
          }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <ul style={{ display: "flex", gap: "16px", listStyle: "none", paddingLeft: 0, marginTop: 8, fontSize: "11px"}}>
        <li style={{ display: "flex", alignItems: "center", color: "#fff" }}>
          <span style={{ width: 12, height: 12, backgroundColor: "rgba(255, 80, 80, 1)", borderRadius: "50%", display: "inline-block", marginRight: 6 }} />
          &lt; 99%
        </li>
        <li style={{ display: "flex", alignItems: "center", color: "#fff" }}>
          <span style={{ width: 12, height: 12, backgroundColor: "rgba(255, 165, 0, 1)", borderRadius: "50%", display: "inline-block", marginRight: 6 }} />
          99–99.89%
        </li>
        <li style={{ display: "flex", alignItems: "center", color: "#fff" }}>
          <span style={{ width: 12, height: 12, backgroundColor: "rgba(0, 194, 100, 1)", borderRadius: "50%", display: "inline-block", marginRight: 6 }} />
          ≥ 99.9%
        </li>
      </ul>

      <div style={{ height: "400px" }}>
        <canvas ref={chartRef} />
      </div>

    </div>
  );
}
