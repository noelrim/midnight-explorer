import { useState, useEffect } from "react";

export function useCurrentEpoch() {
  const [currentEpoch, setCurrentEpoch] = useState("--");
  const [nextEpochTimestamp, setNextEpochTimestamp] = useState(null);

  useEffect(() => {
    async function fetchEpoch() {
      try {
        const res = await fetch("/api/chain/get-epoch");
        const data = await res.json();
        const sidechain = data?.result?.sidechain;

        if (sidechain?.epoch != null) {
          setCurrentEpoch(sidechain.epoch.toLocaleString());
          setNextEpochTimestamp(sidechain.nextEpochTimestamp);
        } else {
          setCurrentEpoch("--");
          setNextEpochTimestamp(null);
        }
      } catch (err) {
        console.error("Failed to fetch epoch:", err);
        setCurrentEpoch("--");
        setNextEpochTimestamp(null);
      }
    }

    fetchEpoch();
  }, []);

  return { currentEpoch, nextEpochTimestamp };
}
