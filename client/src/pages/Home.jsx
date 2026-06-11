import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiActivity,
  FiZap,
  FiCpu,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

function Home() {
  const { walletAddress, balance, connect, isCorrectNetwork, switchNetwork, isLoading } = useWallet();
  const [txCount, setTxCount] = useState(0);

  useEffect(() => {
    if (walletAddress) {
      const local = JSON.parse(localStorage.getItem("ritual_tx_history") || "[]");
      const filtered = local.filter((tx) => tx.from?.toLowerCase() === walletAddress?.toLowerCase());
      setTxCount(filtered.length);
    }
  }, [walletAddress]);

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  if (!walletAddress) {
    // Disconnected Landing Hero Section
    return (
      <div className="home-landing animate-fade-in" style={{ padding: "60px 0", textAlign: "center", position: "relative" }}>
        <div style={{ marginBottom: "28px" }}>
          <span className="network-badge correct" style={{ textTransform: "uppercase", letterSpacing: "1.5px", fontSize: "11px", fontWeight: "800" }}>
            ⚡ Ritual Ecosystem
          </span>
        </div>

        <h1 className="hero-title" style={{
          fontFamily: "var(--font-heading)",
          fontSize: "68px",
          fontWeight: "800",
          lineHeight: "1.1",
          color: "var(--text-primary)",
          letterSpacing: "-2.5px",
          maxWidth: "900px",
          margin: "0 auto 24px"
        }}>
          Intelligent Payments for the <span style={{ background: "linear-gradient(90deg, #A855F7, #4F46E5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Decentralized Future</span>
        </h1>

        <p className="hero-desc" style={{
          fontSize: "18px",
          color: "var(--text-secondary)",
          maxWidth: "640px",
          margin: "0 auto 48px",
          lineHeight: "1.6"
        }}>
          The first community-owned AI coprocessor and Web3 payment engine. Seamlessly route transactions, execute intelligent on-chain inferences, and secure assets on Ritual.
        </p>

        <div style={{ marginBottom: "80px", display: "flex", justifyContent: "center", gap: "16px" }}>
          <button className="connect-btn" onClick={connect} disabled={isLoading} style={{ padding: "16px 36px", fontSize: "16px", borderRadius: "14px" }}>
            {isLoading ? "Connecting Wallet..." : "Connect MetaMask Wallet"}
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          maxWidth: "1100px",
          margin: "0 auto"
        }}>
          <div className="stat-card">
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(124, 58, 237, 0.1)", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", margin: "0 auto 20px" }}>
              <FiCpu />
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: "800", marginBottom: "10px", color: "var(--text-primary)" }}>AI Coprocessing</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5" }}>Run complex machine learning tasks directly inside Web3 transactions with automated node inferences.</p>
          </div>

          <div className="stat-card">
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(79, 70, 229, 0.1)", color: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", margin: "0 auto 20px" }}>
              <FiZap />
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: "800", marginBottom: "10px", color: "var(--text-primary)" }}>Microscopic Fees</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5" }}>Gas costs on the Ritual Testnet are virtually zero. Perfect for high-frequency smart contracts.</p>
          </div>

          <div className="stat-card">
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(168, 85, 247, 0.1)", color: "#A855F7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", margin: "0 auto 20px" }}>
              <FiShield />
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: "800", marginBottom: "10px", color: "var(--text-primary)" }}>Agent Integrations</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5" }}>Interact directly with AI agents that can trigger transactions and execute payment routines under your rules.</p>
          </div>
        </div>
      </div>
    );
  }

  // Connected Wallet Dashboard
  return (
    <div className="home-dashboard animate-fade-in">
      <div style={{ marginBottom: "40px" }}>
        <h1 className="page-title">Ritual Terminal</h1>
        <p className="page-subtitle">Intelligent payments and node status for the decentralized future.</p>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-card-label">Wallet Balance</p>
          <div className="stat-card-value">{balance} RITUAL</div>
          <p className="stat-card-sub">Native Gas & Coprocessor Asset</p>
        </div>

        <div className="stat-card">
          <p className="stat-card-label">Connected Wallet</p>
          <div className="stat-card-value" style={{ fontSize: "20px", fontFamily: "var(--font-mono)", wordBreak: "break-all", padding: "8px 0" }}>
            {formatAddress(walletAddress)}
          </div>
          <p className="stat-card-sub">Provider: MetaMask</p>
        </div>

        <div className="stat-card">
          <p className="stat-card-label">Network Status</p>
          <div className="stat-card-value" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "24px" }}>
            <span className={`badge-dot ${isCorrectNetwork ? "correct" : "warning"}`} style={{ width: "10px", height: "10px" }}></span>
            <span>{isCorrectNetwork ? "Ritual Testnet" : "Wrong Network"}</span>
          </div>
          <p className="stat-card-sub">
            {isCorrectNetwork ? (
              "Connected (Chain 1979)"
            ) : (
              <button onClick={switchNetwork} style={{ background: "transparent", border: "none", color: "var(--accent-color)", fontWeight: "700", cursor: "pointer", textDecoration: "underline", padding: 0 }}>
                Switch Network
              </button>
            )}
          </p>
        </div>

        <div className="stat-card">
          <p className="stat-card-label">Total Transactions</p>
          <div className="stat-card-value">{txCount}</div>
          <p className="stat-card-sub">Inferences & Transfers Sent</p>
        </div>

        <div className="stat-card">
          <p className="stat-card-label">Account Status</p>
          <div className="stat-card-value" style={{ color: "var(--success-color)", display: "flex", alignItems: "center", gap: "6px" }}>
            <FiCheckCircle />
            <span>Active</span>
          </div>
          <p className="stat-card-sub">Inference Permissions Granted</p>
        </div>
      </div>

      {/* Sub Grids for Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
        <div className="premium-card">
          <h3 className="card-title">Launch Payment</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Link to="/send" className="menu-link" style={{ display: "flex", alignItems: "center", justify: "space-between", padding: "18px", background: "var(--bg-secondary)", borderRadius: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(124, 58, 237, 0.1)", color: "#7C3AED", display: "flex", alignItems: "center", justify: "center", fontSize: "18px" }}>
                  <FiArrowUpRight />
                </div>
                <div>
                  <h4 style={{ color: "var(--text-primary)", fontWeight: "700" }}>Transfer Tokens</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Send gas & payment tokens to any target address.</p>
                </div>
              </div>
              <FiArrowUpRight style={{ color: "var(--text-muted)" }} />
            </Link>

            <Link to="/receive" className="menu-link" style={{ display: "flex", alignItems: "center", justify: "space-between", padding: "18px", background: "var(--bg-secondary)", borderRadius: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", display: "flex", alignItems: "center", justify: "center", fontSize: "18px" }}>
                  <FiArrowDownLeft />
                </div>
                <div>
                  <h4 style={{ color: "var(--text-primary)", fontWeight: "700" }}>Receive Tokens</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Obtain custom payment codes and address hashes.</p>
                </div>
              </div>
              <FiArrowDownLeft style={{ color: "var(--text-muted)" }} />
            </Link>
          </div>
        </div>

        <div className="premium-card">
          <h3 className="card-title">Active AI Coprocessor Logs</h3>
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <FiActivity className="animate-pulse" style={{ fontSize: "40px", color: "var(--accent-glow)", marginBottom: "16px" }} />
            <h4 style={{ color: "var(--text-primary)", fontWeight: "700", marginBottom: "6px" }}>Infernet Status: Online</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", maxWidth: "340px", margin: "0 auto" }}>
              Secure model execution nodes are responsive. ZK validation circuits are verifying proofs in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;