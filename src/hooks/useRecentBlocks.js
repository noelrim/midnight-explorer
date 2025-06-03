// src/hooks/useRecentBlocks.js
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export function useRecentBlocks() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    async function fetchBlocks() {
      const blocksQuery = query(collection(db, "RecentBlocks"), orderBy("Timestamp", "desc"), limit(10));
      const blocksSnap = await getDocs(blocksQuery);
      const blocksArr = blocksSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlocks(blocksArr);
    }
    fetchBlocks();
  }, []);

  return blocks;
}

