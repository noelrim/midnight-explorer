// src/components/RegistrationChart.jsx
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export default function RegistrationChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const snapshot = await getDocs(query(collection(db, "EpochSPOStats"), orderBy("Date")));
      const labels = [];
      const valid = [];
      const invalid = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        labels.push(data.Date);
        valid.push(data.Registered?.ValidRegistrations || 0);
        invalid.push(data.Registered?.InvalidRegistrations || 0);
      });

      setChartData({ labels, valid, invalid });
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!chartData || !chartData.labels.length) return;
    const ctx = chartRef.current.getContext("2d");

    if (!chartInstance.current) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Valid",
              data: chartData.valid,
              backgroundColor: "rgba(0, 194, 255, 0.5)",
              stack: "Stack 0",
            },
            {
              label: "Invalid",
              data: chartData.invalid,
              backgroundColor: "rgba(255, 0, 0, 0.4)",
              stack: "Stack 0",
            }
          ],
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: { bottom: 25 },
          },
          responsive: true,
          scales: {
            x: {
              stacked: true,
              ticks: { color: "#fff", font: { size: 10 }, maxRotation: 90, minRotation: 45 },
              grid: { color: "#333" }
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { color: "#fff" },
              grid: { color: "#333" }
            }
          },
          plugins: {
            legend: {
              labels: { color: "#fff" }
            }
          }
        }
      });
    } else {
      const chart = chartInstance.current;
      chart.data.labels = chartData.labels;
      chart.data.datasets[0].data = chartData.valid;
      chart.data.datasets[1].data = chartData.invalid;
      chart.update();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [chartData]);

  return (
    <div className="chart-panel"  style={{
      height: "320px",
      maxHeight: "320px",
      overflow: "hidden",
      position: "relative",
    }}>
      <h2 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
        Registered SPOs per Day
      </h2>
      <canvas ref={chartRef}  style={{ height: "100%", width: "100%" }}></canvas>
    </div>
  );
}
