import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { timeAgo } from "../utils/time";

let hasShownInitialDelay = false;

export default function RecentTransactionsTable({ tx }) {
  const now = Date.now();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasShownInitialDelay) {
      const timer = setTimeout(() => {
        hasShownInitialDelay = true;
        setReady(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setReady(true);
    }
  }, []);

  return (
    <div className="panel">
      <h2>Recent Transactions <span style={{ fontSize: "12px" }}>(last hour)</span></h2>
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
          {!ready || tx?.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                Loading transactions...
              </td>
            </tr>
          ) : (
            tx.map((t) => (
              <tr key={t.hash}>
                <td>
                  <Link to={`/transaction/${t.hash}`}>
                    {t.hash.slice(0, 8)}..{t.hash.slice(-4)}
                  </Link>
                  <br />
                  <span className="transaction-time">{timeAgo(now, t.timestamp)}</span>
                </td>
                <td>
                  <Link to={`/block/${t.blockHeight}`}>{t.blockHeight}</Link>
                </td>
                <td>{t.OutputAddress || "—"}</td>
                <td>{t.TotalOutput || "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
