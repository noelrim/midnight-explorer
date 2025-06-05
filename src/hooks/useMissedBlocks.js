import { useState, useEffect } from "react";
import REQUEST from "../services/requestService"; // or wherever your REQUEST object is
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export function useMissedBlocks() {
  const [missedBlocks, setMissedBlocks] = useState("--");

  useEffect(() => {
    async function calculateMissed() {
      try {
        console.log("Loading Missed blocks");
        // Get latest transaction to get lastBlockTimestamp and lastBlockHeight
        const txQuery = query(
          collection(db, "RecentTransactions"),
          orderBy("Timestamp", "desc"),
          limit(1)
        );
        const txSnap = await getDocs(txQuery);
        if (txSnap.empty) return;

        const lastTxDoc = txSnap.docs[0].data();
        const lastBlockTimestamp = lastTxDoc.Timestamp;
        const lastBlockHeight = lastTxDoc.BlockHeight;

        // Fetch first block timestamp via REQUEST GraphQL
        const data = await REQUEST.getBlockAtHeight(1);
        if (!data?.data?.block?.timestamp) return;

        const firstBlockTimestamp = new Date(data.data.block.timestamp).getTime();
        const lastBlockTimestampMs = lastBlockTimestamp.seconds
          ? lastBlockTimestamp.seconds * 1000
          : lastBlockTimestamp;

        const expectedBlocks = (lastBlockTimestampMs - firstBlockTimestamp) / 1000 / 6;
        const missed = ((expectedBlocks / lastBlockHeight) * 100 - 100).toFixed(2);

        setMissedBlocks(missed);
      } catch (e) {
        console.warn("Failed to calculate missed blocks:", e);
      }
    }
    calculateMissed();
  }, []);

  return missedBlocks;
}
