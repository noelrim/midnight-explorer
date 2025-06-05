// src/hooks/useCurrentEpoch.js
import { useState, useEffect } from "react";

const REF_EPOCH = 241975;
const REF_EPOCH_DATE = new Date("2025-03-17T15:00:00");

export function useCurrentEpoch() {
          console.log("Calculating curren epoch");
  const [currentEpoch, setCurrentEpoch] = useState("--");

  useEffect(() => {
    function update() {
      const now = Date.now();
      const current =
        REF_EPOCH + Math.floor(((now - REF_EPOCH_DATE.getTime()) / 3600000) / 2) - 1;
      setCurrentEpoch(current.toLocaleString());
    }

    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return currentEpoch;
}
