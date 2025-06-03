import React from "react";
import { Link } from 'react-router-dom';
import { timeAgo } from "../utils/time"; // Same here, ensure this function is accessible

export default function RecentTransactionsTable({ transactions }) {
  const now = Date.now();

  return (
    <div className="panel">
      <h2>Recent Transactions</h2>
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
          {transactions.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                Loading transactions...
              </td>
            </tr>
          )}
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>
                <Link to={`/transaction/${t.id}`}>{t.id.slice(0, 8)}..{t.id.slice(-4)}</Link>
                <br />
                <span className="transaction-time">{timeAgo(now, t.Timestamp.seconds * 1000)}</span>
              </td>
              <td>
                <Link to={`/block/${t.BlockHeight}`}> {t.BlockHeight}</Link>
               </td>
              <td>{t.OutputAddress || "—"}</td>
              <td>{t.TotalOutput || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
