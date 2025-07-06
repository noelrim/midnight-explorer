import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

export default function SPOPieCharts({ spoList }) {
  const blockChartRef = useRef(null);
  const stakeChartRef = useRef(null);
  const blockChartInstance = useRef(null);
  const stakeChartInstance = useRef(null);

  const filteredSPOs = spoList.filter(spo => spo.Type !== "Permissioned" && spo.IsValid);

  const blockData = filteredSPOs.map(spo => spo.blockcount || 0);
  const stakeData = filteredSPOs.map(spo => spo.Stake || 0);
  const labels = filteredSPOs.map(spo => spo.Ticker || spo.AuraPubKey.slice(0, 6));

  const totalBlocks = blockData.reduce((sum, val) => sum + val, 0);
  const totalStake = stakeData.reduce((sum, val) => sum + val, 0);

  const blockPercent = blockData.map(val => ((val / totalBlocks) * 100).toFixed(2));
  const stakePercent = stakeData.map(val => ((val / totalStake) * 100).toFixed(2));
  const lightBluePalette = [
    "#a2d2ff", "#bde0fe", "#caf0f8", "#90e0ef", "#48cae4",
    "#00b4d8", "#0096c7", "#0077b6", "#023e8a", "#61a5c2"
  ];

  const backgroundColors = labels.map((_, i) =>
    lightBluePalette[i % lightBluePalette.length]
  );

  useEffect(() => {
    const ctx1 = blockChartRef.current.getContext("2d");
    const ctx2 = stakeChartRef.current.getContext("2d");

    if (blockChartInstance.current) blockChartInstance.current.destroy();
    if (stakeChartInstance.current) stakeChartInstance.current.destroy();

    blockChartInstance.current = new Chart(ctx1, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: blockData,
          backgroundColor: backgroundColors,
          borderWidth: 0.5, // <- This makes the slice border thin
          borderColor: "#1c1c24"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          datalabels: {
            color: "#fff",
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = (value / total) * 100;
              return percentage > 5
                ? `${context.chart.data.labels[context.dataIndex]} (${percentage.toFixed(1)}%)`
                : "";
            },
            font: { weight: "normal", size: 12 }
          }
        }
      }
    });

    stakeChartInstance.current = new Chart(ctx2, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: stakeData,
          backgroundColor: backgroundColors,
          borderWidth: 0.5, // <- This makes the slice border thin
          borderColor: "#1c1c24"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          datalabels: {
            color: "#fff",
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = (value / total) * 100;
              return percentage > 5
                ? `${context.chart.data.labels[context.dataIndex]} (${percentage.toFixed(1)}%)`
                : "";
            },
            font: { weight: "bold", size: 12 }
          }
        }
      }
    });

    return () => {
      blockChartInstance.current?.destroy();
      stakeChartInstance.current?.destroy();
    };
  }, [spoList]);

  return (
    <div className="overview-section">
      <div className="overview-row">
        <div className="card-long" style={{ height: "320px" }}>
          <h3>Block Distribution (%)</h3>
          <div style={{ height: "100%" }}>
            <canvas ref={blockChartRef} style={{ height: "100%" }} />
          </div>
        </div>
        <div className="card-long" style={{ height: "320px" }}>
          <h3>Stake Distribution (%)</h3>
          <div style={{ height: "100%" }}>
            <canvas ref={stakeChartRef} style={{ height: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
