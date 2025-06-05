// src/hooks/useRecentBlocks.js
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

const recentBlocksCache = {
  hydrated: false,
  data: [],
};

export function useRecentBlocks() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    if (recentBlocksCache.hydrated) {
      console.log("Recent blocks cache hit");
      setBlocks(recentBlocksCache.data);
      return;
    }

    async function fetchBlocks() {
      console.log("Fetching Recent blocks");
      const blocksQuery = query(
        collection(db, "RecentBlocks"),
        orderBy("Timestamp", "desc"),
        limit(10)
      );
      const blocksSnap = await getDocs(blocksQuery);
      const blocksArr = blocksSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Cache the result
      recentBlocksCache.data = blocksArr;
      recentBlocksCache.hydrated = true;

      setBlocks(blocksArr);
    }

    fetchBlocks();
  }, []);

  return blocks;
}
