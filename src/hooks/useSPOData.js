import { useState, useEffect } from "react";

const spoCache = {
  hydrated: false,
  spoMap: new Map(),
  sposMap: new Map(),
  totalAda: 0,
  numberOfSPOs: 0,
};

export function useSPOData() {
  const [state, setState] = useState({
    spoMap: new Map(),
    sposMap: new Map(),
    totalAda: 0,
    numberOfSPOs: 0,
    spos: [],
  });

  useEffect(() => {
    if (spoCache.hydrated) {
      console.log("cache hit (spos)")
      setState({
        ...spoCache,
        spos: Array.from(spoCache.sposMap.values()),
      });
      return;
    }

    async function fetchSPOs() {
      const spoRes = await fetch("/api/spo/list");
      const metricsRes = await fetch("/api/spo/metrics");

      const { docs: spoSnap } = await spoRes.json();
      const { docs: metricsSnap } = await metricsRes.json();

      const spoMap = new Map();
      const sposMap = new Map();
      const metrics = {};
      let totalAda = 0;
      let count = 0;

      metricsSnap.forEach((doc) => {
        metrics[doc.id] = doc.data.blockcount;
      });

      spoSnap.forEach((doc) => {
        const d = doc.data;
        d.CardanoEpoch = d.CardanoEpoch || 0;
        d.blockcount = metrics[d.AuraPubKey] || 0;

        spoMap.set(d.AuraPubKey, d.Ticker || "—");
        sposMap.set(d.AuraPubKey, d);

        if (d.Type === "Registered" && d.IsValid) {
          totalAda += d.Stake;
          count++;
        }
      });

      Object.assign(spoCache, {
        hydrated: true,
        spoMap,
        sposMap,
        totalAda,
        numberOfSPOs: count,
      });

      setState({
        spoMap,
        sposMap,
        totalAda,
        numberOfSPOs: count,
        spos: Array.from(sposMap.values()),
      });
    }

    fetchSPOs();
  }, []);

  return state;
}
