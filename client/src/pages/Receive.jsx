import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { FiCopy, FiCheck, FiShare2 } from "react-icons/fi";

function Receive() {
  const { walletAddress } = useWallet();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [amount, setAmount] = useState("");

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const getPaymentLink = () => {
    const base = window.location.origin + "/send";
    if (!amount) return `${base}?to=${walletAddress}`;
    return `${base}?to=${walletAddress}&amount=${amount}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getPaymentLink());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="receive-container animate-fade-in" style={{ maxWidth: "540px", margin: "0 auto" }}>
      <h1 className="page-title">Receive Payments</h1>
      <p className="page-subtitle">Generate a payment link or show your QR code to receive RITUAL tokens.</p>

      <div className="premium-card" style={{ textAlign: "center" }}>
        {/* Visual QR Code Generator */}
        <div style={{
          width: "200px",
          height: "200px",
          background: "white",
          border: "1px solid var(--border-color)",
          borderRadius: "16px",
          margin: "0 auto 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)"
        }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", fill: "#0f172a" }}>
            <rect x="0" y="0" width="25" height="25" />
            <rect x="5" y="5" width="15" height="15" fill="white" />
            <rect x="9" y="9" width="7" height="7" />

            <rect x="75" y="0" width="25" height="25" />
            <rect x="80" y="5" width="15" height="15" fill="white" />
            <rect x="84" y="9" width="7" height="7" />

            <rect x="0" y="75" width="25" height="25" />
            <rect x="5" y="80" width="15" height="15" fill="white" />
            <rect x="9" y="84" width="7" height="7" />

            {/* Random QR block coordinates to simulate actual QR layout */}
            <rect x="35" y="5" width="5" height="15" />
            <rect x="45" y="0" width="10" height="5" />
            <rect x="60" y="10" width="5" height="10" />
            <rect x="35" y="25" width="15" height="5" />
            <rect x="5" y="35" width="15" height="5" />
            <rect x="0" y="45" width="5" height="10" />
            <rect x="25" y="40" width="10" height="10" />
            <rect x="45" y="35" width="20" height="5" />
            <rect x="70" y="30" width="10" height="5" />
            <rect x="85" y="35" width="5" height="15" />
            <rect x="35" y="50" width="5" height="20" />
            <rect x="45" y="55" width="15" height="5" />
            <rect x="65" y="45" width="10" height="15" />
            <rect x="80" y="55" width="15" height="5" />
            <rect x="80" y="65" width="5" height="10" />
            <rect x="50" y="70" width="15" height="5" />
            <rect x="35" y="80" width="20" height="5" />
            <rect x="60" y="85" width="5" height="15" />
            <rect x="70" y="80" width="25" height="5" />
            <rect x="80" y="90" width="10" height="10" />
          </svg>
        </div>

        <p className="address-label" style={{ marginBottom: "8px" }}>Your Wallet Address</p>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-tertiary)",
          padding: "12px 16px",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          marginBottom: "30px"
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "var(--text-primary)",
            wordBreak: "break-all",
            textAlign: "left",
            marginRight: "10px"
          }}>
            {walletAddress}
          </span>
          <button
            onClick={handleCopyAddress}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: copiedAddress ? "var(--success-color)" : "var(--text-muted)",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              flexShrink: 0
            }}
            title="Copy Address"
          >
            {copiedAddress ? <FiCheck /> : <FiCopy />}
          </button>
        </div>

        <hr className="dropdown-divider" style={{ margin: "24px 0" }} />

        {/* Payment Request Link Generator */}
        <h3 className="card-title" style={{ fontSize: "16px", marginBottom: "16px", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}>
          <FiShare2 />
          <span>Create Shareable Payment Link</span>
        </h3>

        <div className="form-group" style={{ textAlign: "left" }}>
          <label className="form-label">Requested Amount (Optional)</label>
          <input
            type="number"
            className="premium-input"
            placeholder="0.0 RITUAL"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-tertiary)",
          padding: "12px 16px",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          textAlign: "left"
        }}>
          <span style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginRight: "10px"
          }}>
            {getPaymentLink()}
          </span>
          <button
            onClick={handleCopyLink}
            disabled={!walletAddress}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: copiedLink ? "var(--success-color)" : "var(--accent-color)",
              fontWeight: "600",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexShrink: 0
            }}
          >
            {copiedLink ? (
              <>
                <FiCheck />
                <span>Copied Link!</span>
              </>
            ) : (
              <>
                <FiCopy />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receive;