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

    // Otherwise, fetch fresh data
    async function fetchChartData() {
      console.log("Fetching hourly transactions...");
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      const response = await fetch("/api/transaction/hourly");
      const { docs: hourlySnapshot } = await response.json();

      const dailyTotals = {};
      const fullHourly = {};

      hourlySnapshot.forEach((doc) => {
        const id = doc.id;
        const [dayKey] = id.split("T");
        const docData = doc.data;
        const total = docData.TotalTransactions || 0;

        dailyTotals[dayKey] = (dailyTotals[dayKey] || 0) + total;

        fullHourly[id] = {
          Deploy: docData.TotalDeploy || 0,
          Update: docData.TotalUpdate || 0,
          Call: docData.TotalCalls || 0,
          TotalTransactions: total
        };
      });

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
