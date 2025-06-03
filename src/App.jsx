import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import TransactionDetails from './pages/TransactionDetails';
import BlockDetails from './pages/BlockDetails';
import SPODetails from './pages/SPODetails';
import SPOList from './pages/SPOList';
import ChainActivity from './pages/ChainActivity';

// import other pages...

export default function App() {
  return (
    <Router>
      <TopBar />
      <Routes> 
        <Route path="/" element={<Dashboard />} />
        <Route path="/spos" element={<SPOList />} />
        <Route path="/transaction/:hash" element={<TransactionDetails />} /> 
        <Route path="/block/:height" element={<BlockDetails />} />
        <Route path="/spo/:author" element={<SPODetails />} />
        <Route path="/chainactivity" element={<ChainActivity />} />
      </Routes>
    </Router>
  );
}
