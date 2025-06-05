// src/components/EpochCountdownDisplay.jsx
import React from "react";
import { useEpochCountdown } from "../hooks/useEpochCountdown";

export default function EpochCountdownDisplay({ onEpochData }) {
  const { currentEpoch, timeLeft, progressPercent } = useEpochCountdown();

  // Optionally send values up if parent needs them
  if (onEpochData) {
    onEpochData({ currentEpoch, timeLeft, progressPercent });
  }

  return (
<div
            className="card"
            id="next-epoch-card"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <h3>Next epoch in</h3>
            <div
              id="next-epoch-timer"
              style={{ position: "relative", zIndex: 1, padding: "0.5rem" }}
            >
              {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
            </div>
            <div
              className="progress-overlay"
              style={{
                width: `${progressPercent}%`,
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                background: "linear-gradient(90deg, #00c2ff, #0077aa)",
                opacity: 0.3,
                borderRadius: "6px",
                transition: "width 1s linear",
                zIndex: 0,
              }}
            ></div>
          </div>
  );
}