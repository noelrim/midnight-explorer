import { useState, useEffect } from "react";
import REQUEST from "../services/requestService";

export function useBlock(height) {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!height) return;

    async function getBlock() {
      try {
        setLoading(true);
        const b = await REQUEST.getBlockByHeight(height); // ✅ await the async call
        const block = b?.data?.block;
        setTransaction(block);
      } catch (e) {
        console.warn("Failed to get block:", e);
        setTransaction(null);
      } finally {
        setLoading(false);
      }
    }

    getBlock();
  }, [height]); 

  return { block, loading };
}
