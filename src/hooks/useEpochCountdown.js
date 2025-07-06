import { useState, useEffect } from "react";

export function useEpochCountdown({nextEpochTimestamp}) {
  const [timeLeft, setTimeLeft] = useState({ hours: "--", minutes: "--", seconds: "--" });
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!nextEpochTimestamp) return;

    function update() {
      const now = Date.now();
      const diffMs = nextEpochTimestamp - now;

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

      const EPOCH_DURATION_MS = 2 * 60 * 60 * 1000;
      setProgressPercent(100 - (diffMs / EPOCH_DURATION_MS) * 100);
    }

    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [nextEpochTimestamp]);

  return { timeLeft, progressPercent };
}