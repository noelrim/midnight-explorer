import { useEffect, useState } from "react";

export function useDailyBlockData() {
  const [dailyChartData, setDailyChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchDailyMetrics() {
      try {
        const response = await fetch("/api/block/daily");
        const { docs } = await response.json();

        const formatted = docs.map((doc) => ({
          date: doc.id,
          blockCount: doc.data.blockCount,
          expectedBlocks: doc.data.expectedBlocks,
          uptimePercent: doc.data.uptimePercent,
          updatedAt: doc.data.updatedAt, // keep if needed
        }));

        setDailyChartData(formatted);
      } catch (error) {
        console.error("❌ Failed to load DailyBlockMetrics:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDailyMetrics();
  }, []);

  return {
    dailyChartData,
    isLoading,
    isError,
  };
}
