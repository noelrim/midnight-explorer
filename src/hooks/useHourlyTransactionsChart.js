// src/hooks/useHourlyTransactionsChart.js
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export function useHourlyTransactionsChart() {
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [hourlyData, setHourlyData] = useState({});

  useEffect(() => {
    async function fetchChartData() {
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
      const cutoffKey = fifteenDaysAgo.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"

      const hourlyQuery = query(
        collection(db, "HourlyTransactions"),
       // where("__name__", ">=", cutoffKey),
        orderBy("__name__")
      );
      const hourlySnapshot = await getDocs(hourlyQuery);

      const dailyTotals = {};
      const fullHourly = {};

      hourlySnapshot.forEach((doc) => {
        const id = doc.id; // format: "YYYY-MM-DDTHH"
        const [dayKey] = id.split("T");
        const docData = doc.data();

        const total = docData.TotalTransactions || 0;
        dailyTotals[dayKey] = (dailyTotals[dayKey] || 0) + total;

        fullHourly[id] = {
          Deploy: docData.TotalDeploy || 0,
          Update: docData.TotalUpdate || 0,
          Call: docData.TotalCalls || 0,
          TotalTransactions: total,
        };
      });

      const sortedEntries = Object.entries(dailyTotals)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-15);

      setChartData({
        labels: sortedEntries.map(([day]) => day),
        data: sortedEntries.map(([, count]) => count),
      });

      setHourlyData(fullHourly);
    }

    fetchChartData();
  }, []);

  return { chartData, hourlyData };
}
