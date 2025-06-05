// src/hooks/useRecentTransactions.js
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

const recentTxCache = {
  hydrated: false,
  data: [],
};

export function useRecentTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (recentTxCache.hydrated) {
      console.log("Recent transactions cache hit");
      setTransactions(recentTxCache.data);
      return;
    }

    async function fetchTransactions() {
      console.log("Fetching Recent Transactions");
      const txQuery = query(
        collection(db, "RecentTransactions"),
        orderBy("Timestamp", "desc"),
        limit(10)
      );
      const txSnap = await getDocs(txQuery);
      const txArr = txSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Save to cache
      recentTxCache.data = txArr;
      recentTxCache.hydrated = true;

      setTransactions(txArr);
    }

    fetchTransactions();
  }, []);

  return transactions;
}
