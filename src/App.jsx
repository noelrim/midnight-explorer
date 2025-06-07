import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import PasswordGate from './components/PasswordGate';
import Dashboard from './pages/Dashboard';
import TransactionDetails from './pages/TransactionDetails';
import BlockDetails from './pages/BlockDetails';
import SPODetails from './pages/SPODetails';
import SPOList from './pages/SPOList';
import ChainActivity from './pages/ChainActivity';
import { useLiveRecentBlocks } from "./hooks/useLiveRecentBlocks";


export default function App() {

  const loaded = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const {blocks, transactions} = useLiveRecentBlocks(600, 10, unlocked);

  if (!unlocked) return <PasswordGate onAccessGranted={() => setUnlocked(true)} />;

  console.count("Page Reloaded");
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<Dashboard blockStream={blocks}  transactionStream={transactions}  />} />
        <Route path="/spos" element={<SPOList />} />
        <Route path="/transaction/:hash" element={<TransactionDetails />} />
        <Route path="/block/:height" element={<BlockDetails />} />
        <Route path="/spo/:author" element={<SPODetails />} />
        <Route path="/chainactivity" element={<ChainActivity />} />
      </Routes>
    </Router>
  );
}