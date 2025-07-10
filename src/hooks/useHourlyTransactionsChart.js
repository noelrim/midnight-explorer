import { useState, useEffect, useRef } from "react";
import cacheRef from "../cache";

export function useHourlyTransactionsChart() {
  const [state, setState] = useState({
    chartData: { labels: [], data: [] },
    hourlyData: {}
  });

  const hasLoaded = useRef(false); // Prevents duplicate calls

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    // If we have valid cached data, use it
    if (cacheRef.hydrated) {
      console.log("cache hit (hourly tx)");
      setState(prev => {
        const sameChart = JSON.stringify(prev.chartData) === JSON.stringify(cacheRef.chartData);
        const sameHourly = JSON.stringify(prev.hourlyData) === JSON.stringify(cacheRef.hourlyData);
        if (sameChart && sameHourly) return prev;
        return {
          chartData: cacheRef.chartData,
          hourlyData: cacheRef.hourlyData,
        };
      });
      return;
    }

    async function fetchChartData() {
      console.log("Fetching hourly transactions...");
      const response = await fetch("/api/transaction/hourly");
      const { docs: hourlySnapshot } = await response.json();

      const dailyTotals = {};
      const fullHourly = {};
      const hourCountPerDay = {};

      // First pass: count total tx, blocks, and hours per day
      hourlySnapshot.forEach((doc) => {
        const id = doc.id; 
        const [dayKey] = id.split("T");
        const docData = doc.data;
        const totalTx = docData.TotalTransactions || 0;
        const totalBlocks = docData.TotalBlocks || 0;

        dailyTotals[dayKey] = (dailyTotals[dayKey] || 0) + totalTx;
        hourCountPerDay[dayKey] = (hourCountPerDay[dayKey] || 0) + 1;

        fullHourly[id] = {
          Deploy: docData.TotalDeploy || 0,
          Update: docData.TotalUpdate || 0,
          Call: docData.TotalCalls || 0,
          TotalTransactions: totalTx,
          TotalBlocks: totalBlocks,
          ExpectedBlocks: 0
        };
      });

      // Second pass: assign dynamic expected blocks per hour
      for (const [id, entry] of Object.entries(fullHourly)) {
        const [dayKey] = id.split("T");
        const numHours = hourCountPerDay[dayKey] || 0;
        const expectedPerHour = numHours > 0 ? (numHours * 600) / numHours : 0;
        entry.ExpectedBlocks = 600; // We still expect 600 per recorded hour
      }

      const sortedEntries = Object.entries(dailyTotals)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-15);

      const finalChartData = {
        labels: sortedEntries.map(([day]) => day),
        data: sortedEntries.map(([, count]) => count),
      };

      // Cache and update state
      cacheRef.chartData = finalChartData;
      cacheRef.hourlyData = fullHourly;
      cacheRef.hydrated = true;

      setState({
        chartData: finalChartData,
        hourlyData: fullHourly
      });
    }

    fetchChartData();
  }, []);

  return state;
}
