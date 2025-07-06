import { useState, useEffect } from "react";

export function useBlock(height) {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!height) return;

    async function getBlock() {
      try {
        setLoading(true);
        const response = await fetch(`/api/block/get-block-at?height=${height}`);
        const b = await response.json();
        console.log(b);
        const block = b?.data?.block;
        setBlock(block);
      } catch (e) {
        console.warn("Failed to get block:", e);
        setBlock(null);
      } finally {
        setLoading(false);
      }
    }

    getBlock();
  }, [height]); 

  return { block, loading };
}
