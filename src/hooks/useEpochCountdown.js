// src/hooks/useEpochCountdown.js
import { useState, useEffect } from "react";

const REF_EPOCH = 241975;
const REF_EPOCH_DATE = new Date("2025-03-17T15:00:00");
const EPOCH_DURATION_MS = 2 * 60 * 60 * 1000;

export function useEpochCountdown() {
  const [currentEpoch, setCurrentEpoch] = useState("--");
  const [timeLeft, setTimeLeft] = useState({ hours: "--", minutes: "--", seconds: "--" });
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    function update() {
      const now = Date.now();
      const current =
        REF_EPOCH + Math.floor(((now - REF_EPOCH_DATE.getTime()) / 3600000) / 2) - 1;
      const nextEpoch = new Date(
        REF_EPOCH_DATE.getTime() +
          Math.ceil(((now - REF_EPOCH_DATE.getTime()) / 3600000) / 2) * 2 * 3600000
      );
      setCurrentEpoch(current.toLocaleString());

      const diffMs = nextEpoch.getTime() - now;
      if (diffMs <= 0) {
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        setProgressPercent(100);
        return;
      }

      const diffSec = Math.floor(diffMs / 1000);
      setTimeLeft({
        hours: String(Math.floor(diffSec / 3600)).padStart(2, "0"),
        minutes: String(Math.floor((diffSec % 3600) / 60)).padStart(2, "0"),
        seconds: String(diffSec % 60).padStart(2, "0"),
      });

      setProgressPercent(100 - (diffMs / EPOCH_DURATION_MS) * 100);
    }

    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return { currentEpoch, timeLeft, progressPercent };
}
