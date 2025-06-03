import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useHourlyTransactionsChart } from "../hooks/useHourlyTransactionsChart";

export default function TotalContractActionsBarChart() {
  const { hourlyData } = useHourlyTransactionsChart();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!Object.keys(hourlyData).length) return;

    let deploy = 0, update = 0, call = 0;
    Object.values(hourlyData).forEach((entry) => {
      deploy += entry.Deploy || 0;
      update += entry.Update || 0;
      call += entry.Call || 0;
    });

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Deploy", "Update", "Call"],
        datasets: [{
          data: [deploy, update, call],
          backgroundColor: [
            "rgba(0, 194, 255, 0.6)",
            "rgba(0, 122, 204, 0.6)",
            "rgba(0, 64, 128, 0.6)",
          ],
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
            ticks: { color: "#fff" },
            grid: { color: "#444" }
          }
        },
        plugins: {
          legend: { display: false },
        }
      }
    });
  }, [hourlyData]);

  return <canvas ref={chartRef} />;
}
