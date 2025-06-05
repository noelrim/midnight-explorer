// ✅ Shared in-memory cache (lives across hook calls)
const cacheRef = {
  chartData: null,
  hourlyData: null,
  hydrated: false,
};
export default cacheRef;