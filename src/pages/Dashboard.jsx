// src/pages/Dashboard.jsx
import React, { useMemo, useRef } from "react";
import { useSPOData } from "../hooks/useSPOData";
import { useRecentBlocks } from "../hooks/useRecentBlocks";
import { useRecentTransactions } from "../hooks/useRecentTransactions";
import { useHourlyTransactionsChart } from "../hooks/useHourlyTransactionsChart";
import { useMissedBlocks } from "../hooks/useMissedBlocks";
import Search from "../components/Search";
import OverviewCards from "../components/OverviewCards";
import RecentBlocksTable from "../components/RecentBlocksTable";
import RecentTransactionsTable from "../components/RecentTransactionsTable";
import { useCurrentEpoch } from "../hooks/useCurrentEpoch";
import { useLiveRecentBlocks } from "../hooks/useLiveRecentBlocks";

export default function Dashboard({blockStream, transactionStream}) {
  const { spoMap, totalAda, numberOfSPOs } = useSPOData();
  //const blocks = useRecentBlocks();
  const transactions = useRecentTransactions();
  const missedBlocks = useMissedBlocks();
  const currentEpoch = useCurrentEpoch()
  const { chartData, hourlyData } = useHourlyTransactionsChart();
  const blocks = blockStream;

  const totalTxs = useMemo(() => {
    return Object.values(hourlyData).reduce(
      (sum, entry) => sum + (entry.TotalTransactions || 0),
      0
    );
  }, [hourlyData]);


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
          chartData={chartData}   // ✅ correctly pass chartData
        />
      </div>
      <div className="data-panels">
        <RecentTransactionsTable tx={transactionStream} />
        <RecentBlocksTable blocks={blocks} spoMap={spoMap} />
      </div>
    </>
  );
}
