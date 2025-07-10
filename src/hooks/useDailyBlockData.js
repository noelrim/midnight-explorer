import { useEffect, useState, useRef } from "react";
import cacheRef from "../cache";

export function useDailyBlockData() {
  const [dailyChartData, setDailyChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    // Reuse from cache if available
    if (cacheRef.dailyBlockData.length) {
      console.log("cache hit (daily block)");
      setDailyChartData(cacheRef.dailyBlockData);
      setIsLoading(false);
      return;
    }

    async function fetchDailyMetrics() {
      try {
        const response = await fetch("/api/block/daily");
        const { docs } = await response.json();

        const formatted = docs.map((doc) => ({
          date: doc.id,
          blockCount: doc.data.blockCount,
          expectedBlocks: doc.data.expectedBlocks,
          uptimePercent: doc.data.uptimePercent,
          updatedAt: doc.data.updatedAt,
        }));

        // Cache and update state
        cacheRef.dailyBlockData = formatted;
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
