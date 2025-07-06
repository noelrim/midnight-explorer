import { useState, useEffect } from "react";

export function useTransaction(hash) {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hash) return;

    async function getTransaction() {
      try {
        setLoading(true);
        const res = await fetch(`/api/transaction/get-by-hash?hash=${encodeURIComponent(hash)}`);
        const tx = await res.json();
        const validTx = tx?.data?.transactions[0];
        setTransaction(validTx);
      } catch (e) {
        console.warn("Failed to get transaction:", e);
        setTransaction(null);
      } finally {
        setLoading(false);
      }
    }

    getTransaction();
  }, [hash]); 

  return { transaction, loading };
}
