// src/hooks/useSingleSPO.js
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Local in-memory cache
const singleSPOCache = new Map();

export function useSingleSPO(authorKey) {
  const [spo, setSPO] = useState(null);

  useEffect(() => {
    if (!authorKey) return;

    if (singleSPOCache.has(authorKey)) {
      console.log("Single SPO cache hit:", authorKey);
      setSPO(singleSPOCache.get(authorKey));
      return;
    }

    async function fetch() {
      console.log("Fetching Single SPO:", authorKey);
      const spoRef = doc(db, "SPOs", authorKey);
      const snap = await getDoc(spoRef);

      if (!snap.exists()) {
        setSPO(null);
        return;
      }

      const data = snap.data();

      const metricRef = doc(db, "spometrics", authorKey);
      const metricSnap = await getDoc(metricRef);
      const blockcount = metricSnap.exists() ? metricSnap.data().blockcount : 0;

      const fullData = { ...data, blockcount };
      singleSPOCache.set(authorKey, fullData);
      setSPO(fullData);
    }

    fetch();
  }, [authorKey]);

  return spo;
}
