import { useState, useEffect } from "react";

const registrationStatsCache = {
  hydrated: false,
  data: null,
};

export function useRegistrationStats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (registrationStatsCache.hydrated) {
      console.log("cache hit (registration stats)");
      setData(registrationStatsCache.data);
      return;
    }

    async function fetchStats() {
      console.log("Fetching registration stats");
      const res = await fetch("/api/spo/registrations-per-epoch");
       const { docs: snapshot } = await res.json();

      const labels = [];
      const valid = [];
      const invalid = [];

      snapshot.forEach((doc) => {
        const d = doc.data;
        labels.push(d.Date);
        valid.push(d.Registered?.ValidRegistrations || 0);
        invalid.push(d.Registered?.InvalidRegistrations || 0);
      });

      const chartData = { labels, valid, invalid };

      // Cache it
      registrationStatsCache.data = chartData;
      registrationStatsCache.hydrated = true;

      setData(chartData);
    }

    fetchStats();
  }, []);

  return data;
}
