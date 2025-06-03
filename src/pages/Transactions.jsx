
import { React, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import REQUEST from "../services/requestService"; 
import { useBlock } from "../hooks/useBlock";
import { useSPOData } from "../hooks/useSPOData";

export default function Transactions() {
  const now = Date.now();
  const { height } = useParams();
  const { block, loading } = useBlock(height);
  const { spoMap, totalAda, numberOfSPOs  } = useSPOData();
  const date = new Date(block?.timestamp);
  if (loading) return <p>Loading block...</p>;
  if (!block) return <p>Block not found.</p>;

  return (
    <div className="panel">
      <h2>{block.transactions.length} Transaction(s) in Block {block.height}</h2>
      <table>
        <thead>
          <tr>
            <th>Tx Hash</th>
            <th>Block</th>
            <th>Output Address</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {block.transactions.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                Loading transactions...
              </td>
            </tr>
          )}
          {block.transactions.map((t) => (
            <tr key={t.id}>
              <td>
                <Link to={`/transaction/${t.hash}`}>{t.hash.slice(0, 8)}..{t.hash.slice(-4)}</Link>
                <br />
                <span className="transaction-time">{timeAgo(now, t.timestamp)}</span>
              </td>
              <td>{block.height}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
