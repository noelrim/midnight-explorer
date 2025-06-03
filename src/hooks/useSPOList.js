// src/hooks/useSPOList.js
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export function useSPOList() {
  const [spoMap, setSpoMap] = useState(new Map());
  const [spos, setSpos] = useState([]);
  const [totalAda, setTotalAda] = useState(0);
  const [numberOfSPOs, setNumberOfSPOs] = useState(0);

  useEffect(() => {
    async function fetch() {
      const spoSnap = await getDocs(collection(db, "SPOs"));
      const metricsSnap = await getDocs(collection(db, "spometrics"));

      const metricMap = {};
      metricsSnap.forEach(doc => {
        metricMap[doc.id] = doc.data().blockcount;
      });

      const all = [];
      const tickerMap = new Map();
      let ada = 0;
      let count = 0;

      spoSnap.forEach((doc) => {
        const d = doc.data();
        d.blockcount = metricMap[d.AuraPubKey] || 0;
        d.CardanoEpoch = d.CardanoEpoch || 0;

        all.push(d);
        tickerMap.set(d.AuraPubKey, d.Ticker || "—");

        if (d.Type === "Registered" && d.IsValid) {
          ada += d.Stake;
          count++;
        }
      });

      setSpoMap(tickerMap);
      setSpos(all);
      setTotalAda(ada);
      setNumberOfSPOs(count);
    }

    fetch();
  }, []);

  return { spoMap, spos, totalAda, numberOfSPOs };
}
