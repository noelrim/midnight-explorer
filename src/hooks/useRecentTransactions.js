// src/hooks/useRecentTransactions.js
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export function useRecentTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      const txQuery = query(collection(db, "RecentTransactions"), orderBy("Timestamp", "desc"), limit(10));
      const txSnap = await getDocs(txQuery);
      const txArr = txSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(txArr);
    }
    fetchTransactions();
  }, []);

  return transactions;
}
