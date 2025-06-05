// src/hooks/useSPOData.js
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const spoCache = {
  hydrated: false,
  spoMap: new Map(),
  totalAda: 0,
  numberOfSPOs: 0,
  sposMap: new Map(),
};

export function useSPOData(author) {
  console.log("Loading SPOs");

  const [spoState, setSpoState] = useState({
    spoMap: new Map(),
    totalAda: 0,
    numberOfSPOs: 0,
    sposMap: new Map(),
    singleSPO: null,
  });

  useEffect(() => {
    // If cache is ready and author hasn't changed, just set from cache
    if (spoCache.hydrated) {
      console.log("SPO cache hit");
      setSpoState({
        ...spoCache,
        singleSPO: author ? spoCache.sposMap.get(author) || null : null,
      });
      return;
    }

    async function fetchSPOs() {
      console.log("Fetching SPO data...");
      const spoSnap = await getDocs(collection(db, "SPOs"));
      const spoMetricsSnap = await getDocs(collection(db, "spometrics"));

      const map = new Map();
      const spometric = {};
      const spos = new Map();
      let ada = 0;
      let count = 0;

      // Process spometrics
      spoMetricsSnap.forEach((doc) => {
        spometric[doc.id] = doc.data().blockcount;
      });

      // Process SPOs
      spoSnap.forEach((doc) => {
        const d = doc.data();
        d.CardanoEpoch = d.CardanoEpoch || 0;
        d.blockcount = spometric[d.AuraPubKey] || 0;

        map.set(d.AuraPubKey, d.Ticker || "—");
        spos.set(d.AuraPubKey, d);

        if (d.Type === "Registered" && d.IsValid) {
          ada += d.Stake;
          count++;
        }
      });

      // Cache results
      spoCache.spoMap = map;
      spoCache.totalAda = ada;
      spoCache.numberOfSPOs = count;
      spoCache.sposMap = spos;
      spoCache.hydrated = true;

      setSpoState({
        spoMap: map,
        totalAda: ada,
        numberOfSPOs: count,
        sposMap: spos,
        singleSPO: author ? spos.get(author) || null : null,
      });
    }

    fetchSPOs();
  }, [author]);

  return spoState;
}
