// ✅ Shared in-memory cache (lives across hook calls)
const cacheRef = {
  chartData: null,
  hourlyData: null,
  dailyBlockData: [],
  hydrated: false,
};
export default cacheRef;