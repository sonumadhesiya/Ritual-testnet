import React from "react";
import { useWallet } from "../context/WalletContext";
import { FiSliders, FiGlobe, FiCpu } from "react-icons/fi";

function Settings() {
  const { theme, toggleTheme, walletAddress, isCorrectNetwork } = useWallet();

  return (
    <div className="settings-container animate-fade-in" style={{ maxWidth: "680px", margin: "0 auto" }}>
      <h1 className="page-title">Configuration Settings</h1>
      <p className="page-subtitle">Inspect blockchain connection details and manage local options.</p>

      {/* Network Config */}
      <div className="premium-card">
        <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 24px" }}>
          <FiGlobe style={{ color: "var(--accent-color)" }} />
          <span>Blockchain Network Network</span>
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            <span style={{ color: "var(--text-secondary)" }}>Network Name</span>
            <strong style={{ color: "var(--text-primary)" }}>Ritual Testnet</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            <span style={{ color: "var(--text-secondary)" }}>Chain ID</span>
            <strong style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>1979 (0x7BB)</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            <span style={{ color: "var(--text-secondary)" }}>RPC Endpoint</span>
            <strong style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "13px" }}>https://rpc.ritualfoundation.org</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "4px" }}>
            <span style={{ color: "var(--text-secondary)" }}>Block Explorer</span>
            <strong style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "13px" }}>https://explorer.ritualfoundation.org</strong>
          </div>
        </div>
      </div>

      {/* Preferences Config */}
      <div className="premium-card">
        <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 24px" }}>
          <FiSliders style={{ color: "var(--accent-color)" }} />
          <span>Preferences & Display</span>
        </h3>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px", marginBottom: "16px" }}>
          <div>
            <h4 style={{ color: "var(--text-primary)", fontWeight: "600", fontSize: "14px" }}>Color Theme</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>Toggle between light and dark visual aesthetics.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="theme-btn active"
            style={{ padding: "8px 16px", width: "auto", border: "1px solid var(--border-color)", cursor: "pointer" }}
          >
            <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4 style={{ color: "var(--text-primary)", fontWeight: "600", fontSize: "14px" }}>Connection Status</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>MetaMask dApp connection status.</p>
          </div>
          <span style={{
            fontSize: "13px",
            fontWeight: "600",
            color: walletAddress ? (isCorrectNetwork ? "var(--success-color)" : "var(--warning-color)") : "var(--text-muted)"
          }}>
            {walletAddress ? (isCorrectNetwork ? "Connected & Active" : "Wrong Network") : "Disconnected"}
          </span>
        </div>
      </div>

      {/* System info */}
      <div className="premium-card">
        <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 24px" }}>
          <FiCpu style={{ color: "var(--accent-color)" }} />
          <span>System Information</span>
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            <span style={{ color: "var(--text-secondary)" }}>Wallet Provider</span>
            <strong style={{ color: "var(--text-primary)" }}>{window.ethereum ? "MetaMask Detected" : "Not Found"}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            <span style={{ color: "var(--text-secondary)" }}>Library API</span>
            <strong style={{ color: "var(--text-primary)" }}>ethers.js v6.13</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)" }}>App Version</span>
            <strong style={{ color: "var(--text-primary)" }}>1.0.0 (Production Build)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;