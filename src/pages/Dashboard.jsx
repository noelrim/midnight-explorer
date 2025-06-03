// src/pages/Dashboard.jsx
import React, { useMemo, useRef } from "react";
import { useSPOData } from "../hooks/useSPOData";
import { useRecentBlocks } from "../hooks/useRecentBlocks";
import { useRecentTransactions } from "../hooks/useRecentTransactions";
import { useTotalTransactions } from "../hooks/useTotalTransactions";
import { useHourlyTransactionsChart } from "../hooks/useHourlyTransactionsChart";
import { useEpochCountdown } from "../hooks/useEpochCountdown";
import { useMissedBlocks } from "../hooks/useMissedBlocks";

import Search from "../components/Search";
import OverviewCards from "../components/OverviewCards";
import RecentBlocksTable from "../components/RecentBlocksTable";
import RecentTransactionsTable from "../components/RecentTransactionsTable";

export default function Dashboard() {
  const { spoMap, totalAda, numberOfSPOs } = useSPOData();
  const blocks = useRecentBlocks();
  const transactions = useRecentTransactions();
  const totalTxs = useTotalTransactions();
  const missedBlocks = useMissedBlocks();
  const { currentEpoch, timeLeft, progressPercent } = useEpochCountdown();

  const { chartData, hourlyData } = useHourlyTransactionsChart();

  return (
    <>
      <div className="panel-wrapper">
        <Search />
        <OverviewCards
          totalAda={totalAda}
          numberOfSPOs={numberOfSPOs}
          totalTxs={totalTxs}
          missedBlocks={missedBlocks}
          currentEpoch={currentEpoch}
          timeLeft={timeLeft}
          progressPercent={progressPercent}
          chartData={chartData}   // ✅ correctly pass chartData
        />
      </div>
      <div className="data-panels">
        <RecentTransactionsTable transactions={transactions} />
        <RecentBlocksTable blocks={blocks} spoMap={spoMap} />
      </div>
    </>
  );
}
