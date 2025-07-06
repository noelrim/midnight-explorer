import { useState, useEffect } from "react";

export function useMissedBlocks(lastBlock, lastBlockT, firstBlockTimestamp) {
  const [missedBlocks, setMissedBlocks] = useState("--");

  useEffect(() => {

    if (!lastBlock || !lastBlockT) return;



    async function calculateMissed() {
      try {
        const lastBlockTimestampMs = lastBlockT.seconds
          ? lastBlockT.seconds * 1000
          : lastBlockT;

        const expectedBlocks = (lastBlockTimestampMs - firstBlockTimestamp) / 1000 / 6;
        const missed = ((expectedBlocks / lastBlock) * 100 - 100).toFixed(2);

        setMissedBlocks(missed);
      } catch (e) {
        console.warn("Failed to calculate missed blocks:", e);
      }
    }

    calculateMissed();
  }, [lastBlock, lastBlockT]); //  make the hook respond to changes

  return missedBlocks;
}
