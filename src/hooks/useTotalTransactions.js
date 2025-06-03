// src/hooks/useTotalTransactions.js
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export function useTotalTransactions() {
  const [totalTxs, setTotalTxs] = useState(0);

  useEffect(() => {
    async function fetchTotal() {
      const hourlySnap = await getDocs(collection(db, "HourlyTransactions"));
      let total = 0;
      hourlySnap.forEach((doc) => {
        total += doc.data().TotalTransactions || 0;
      });
      setTotalTxs(total);
    }
    fetchTotal();
  }, []);

  return totalTxs;
}
