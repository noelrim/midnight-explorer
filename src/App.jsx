import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import PasswordGate from './components/PasswordGate';
import Dashboard from './components/Dashboard';
import TransactionDetails from './pages/TransactionDetails';
import BlockDetails from './pages/BlockDetails';
import SPODetails from './pages/SPODetails';
import SPOList from './pages/SPOList';
import ChainActivity from './pages/ChainActivity';
import { useLiveRecentBlocks } from "./hooks/useLiveRecentBlocks";
import { useMissedBlocks } from "./hooks/useMissedBlocks";
import { useCurrentEpoch } from "./hooks/useCurrentEpoch";

export default function App() {

  const loaded = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const {blocks, transactions} = useLiveRecentBlocks(600, 10, unlocked);
  const [firstBlockTimestamp, setFirstBlockTimestamp] = useState(null);

  useEffect(() => {
    if (!unlocked || firstBlockTimestamp) return;

    fetch(`/api/block/get-block-at?height=1`)
      .then(res => res.json())
      .then(data => {
        const ts = new Date(data.data.block.timestamp).getTime();
        setFirstBlockTimestamp(ts);
      });
  }, [unlocked]);

  const missedBlocks  = useMissedBlocks(blocks[0]?.height, blocks[0]?.timestamp, firstBlockTimestamp);
 if (!unlocked) return <PasswordGate onAccessGranted={() => setUnlocked(true)} />;
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<Dashboard blockStream={blocks}  transactionStream={transactions}  missedBlocks={missedBlocks} />} />
        <Route path="/spos" element={<SPOList />} />
        <Route path="/transaction/:hash" element={<TransactionDetails />} />
        <Route path="/block/:height" element={<BlockDetails />} />
        <Route path="/spo/:author" element={<SPODetails />} />
        <Route path="/chainactivity" element={<ChainActivity />} />
      </Routes>
    </Router>
  );
}