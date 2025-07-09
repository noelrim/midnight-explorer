
import { useHourlyTransactionsChart } from "./useHourlyTransactionsChart";

export function useWeeklyBlocksChart() {
  const { weeklyBlockTotals = {} } = useHourlyTransactionsChart();

  const sorted = Object.entries(weeklyBlockTotals)
    .sort(([a, _], [b, __]) => a.localeCompare(b))
    .map(([week, total]) => ({ week, total }));

  return {
    weeklyBlockTotals: sorted
  };
}