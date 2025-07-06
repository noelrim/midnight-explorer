// src/pages/Dashboard.jsx
import React, { useMemo, useRef } from "react";
import { useSPOData } from "../hooks/useSPOData";
import { useHourlyTransactionsChart } from "../hooks/useHourlyTransactionsChart";
import Search from "../components/Search";
import OverviewCards from "../components/OverviewCards";
import RecentBlocksTable from "../components/RecentBlocksTable";
import RecentTransactionsTable from "../components/RecentTransactionsTable";
import { useCurrentEpoch } from "../hooks/useCurrentEpoch";


export default function Dashboard({blockStream, transactionStream, missedBlocks}) {


  const { spoMap, totalAda, numberOfSPOs } = useSPOData(); // stored
  const { chartData, hourlyData } = useHourlyTransactionsChart(); // stored
  const blocks = blockStream;
  const { currentEpoch, nextEpochTimestamp } = useCurrentEpoch();
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
          nextEpochTimestamp={nextEpochTimestamp}
          chartData={chartData} 
        />
      </div>
      <div className="data-panels">
        <RecentTransactionsTable tx={transactionStream} />
        <RecentBlocksTable blocks={blocks} spoMap={spoMap} />
      </div>
    </>
  );
}
