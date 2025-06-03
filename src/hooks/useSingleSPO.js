// src/hooks/useSingleSPO.js
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export function useSingleSPO(authorKey) {
  const [spo, setSPO] = useState(null);

  useEffect(() => {
    if (!authorKey) return;

    async function fetch() {
      const spoRef = doc(db, "SPOs", authorKey);
      const snap = await getDoc(spoRef);
      if (snap.exists()) {
        const data = snap.data();

        // Now fetch blockcount from spometrics
        const metricRef = doc(db, "spometrics", authorKey);
        const metricSnap = await getDoc(metricRef);
        const blockcount = metricSnap.exists() ? metricSnap.data().blockcount : 0;

        setSPO({ ...data, blockcount });
      } else {
        setSPO(null);
      }
    }

    fetch();
  }, [authorKey]);

  return spo;
}
