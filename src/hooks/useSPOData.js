import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export function useSPOData(author) {
  const [spoMap, setSpoMap] = useState(new Map());
  const [totalAda, setTotalAda] = useState(0);
  const [numberOfSPOs, setNumberOfSPOs] = useState(0);
  const [sposMap, setSposMap] = useState(new Map());
  const [singleSPO, setSingleSPO] = useState(null);

  useEffect(() => {
    async function fetchSPOs() {
      const spoSnap = await getDocs(collection(db, "SPOs"));
      const spoMetricsSnap = await getDocs(collection(db, "spometrics"));

      const map = new Map();
      const spometric = {};
      const spos = new Map();
      let ada = 0;
      let count = 0;

      // Index block counts by AuraPubKey
      spoMetricsSnap.forEach(doc => {
        spometric[doc.id] = doc.data().blockcount;
      });

      let matchedSPO = null;

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

        if (d.AuraPubKey === author) {
          matchedSPO = d;
        }
      });

      setSpoMap(map);
      setTotalAda(ada);
      setNumberOfSPOs(count);
      setSposMap(spos);
      setSingleSPO(matchedSPO); // ✅ always update when author changes
    }

    fetchSPOs();
  }, [author]); // ✅ make reactive to author

  return { spoMap, totalAda, numberOfSPOs, singleSPO, sposMap };
}
