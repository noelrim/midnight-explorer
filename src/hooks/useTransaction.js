import { useState, useEffect } from "react";
import REQUEST from "../services/requestService";

export function useTransaction(hash) {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hash) return;

    async function getTransaction() {
      try {
        setLoading(true);
        const tx = await REQUEST.getTransactionByHash(hash); // ✅ await the async call
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
  }, [hash]); // ✅ re-run if hash changes

  return { transaction, loading };
}
