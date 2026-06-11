import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { FiClock, FiExternalLink, FiRefreshCw, FiTrash2 } from "react-icons/fi";

function Transactions() {
  const { walletAddress } = useWallet();
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    const local = JSON.parse(localStorage.getItem("ritual_tx_history") || "[]");
    const filtered = local.filter((tx) => tx.from?.toLowerCase() === walletAddress?.toLowerCase());
    setHistory(filtered);
  };

  useEffect(() => {
    loadHistory();
  }, [walletAddress]);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your local transaction history?")) {
      const local = JSON.parse(localStorage.getItem("ritual_tx_history") || "[]");
      const keep = local.filter((tx) => tx.from?.toLowerCase() !== walletAddress?.toLowerCase());
      localStorage.setItem("ritual_tx_history", JSON.stringify(keep));
      setHistory([]);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return "-";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatHash = (hash) => {
    if (!hash) return "-";
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const formatTime = (timeStr) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleString();
    } catch (e) {
      return timeStr;
    }
  };

  return (
    <div className="transactions-container animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div>
          <h1 className="page-title">Transaction History</h1>
          <p className="page-subtitle">Inspect your historical transfer logs on the Ritual Testnet.</p>
        </div>
        
        {history.length > 0 && (
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={loadHistory}
              className="theme-btn"
              style={{ padding: "8px 12px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}
              title="Refresh"
            >
              <FiRefreshCw />
              <span>Refresh</span>
            </button>
            <button
              onClick={clearHistory}
              className="theme-btn logout"
              style={{ padding: "8px 12px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}
              title="Clear Local History"
            >
              <FiTrash2 />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      <div className="premium-card" style={{ padding: "0", overflow: "hidden" }}>
        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 32px" }}>
            <FiClock style={{ fontSize: "40px", color: "var(--text-muted)", marginBottom: "16px" }} />
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: "700", marginBottom: "8px", color: "var(--text-primary)" }}>
              No Transactions Found
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "320px", margin: "0 auto" }}>
              Send RITUAL tokens or make test payments to populate this transaction ledger.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Tx Hash</th>
                  <th>Action</th>
                  <th>Recipient</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {history.map((tx, idx) => (
                  <tr key={tx.hash || idx}>
                    <td>
                      <a
                        href={`https://explorer.ritualfoundation.org/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tx-hash-link"
                      >
                        <span>{formatHash(tx.hash)}</span>
                        <FiExternalLink style={{ fontSize: "12px" }} />
                      </a>
                    </td>
                    <td style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                      Transfer
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                      {formatAddress(tx.to)}
                    </td>
                    <td style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                      {tx.amount} {tx.symbol || "RITUAL"}
                    </td>
                    <td>
                      <span className="tx-status-badge success">
                        Success
                      </span>
                    </td>
                    <td style={{ fontSize: "13px" }}>
                      {formatTime(tx.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;