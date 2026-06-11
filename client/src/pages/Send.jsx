import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { sendTransaction, getBalance } from "../wallet";
import { ethers } from "ethers";
import { FiSend, FiLoader, FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";

function Send() {
  const { walletAddress, balance, setBalance, isCorrectNetwork, switchNetwork } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("RITUAL");
  const [txState, setTxState] = useState("IDLE"); // IDLE, SUBMITTING, MINING, SUCCESS, ERROR
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    if (!ethers.isAddress(recipient)) {
      alert("Invalid Ethereum address format.");
      return;
    }

    if (parseFloat(amount) <= 0) {
      alert("Amount must be greater than zero.");
      return;
    }

    if (token === "RITUAL" && parseFloat(amount) > parseFloat(balance)) {
      alert("Insufficient RITUAL balance.");
      return;
    }

    setTxState("SUBMITTING");
    setErrorMessage("");

    try {
      if (!isCorrectNetwork) {
        const switched = await switchNetwork();
        if (!switched) {
          throw new Error("Please switch to Ritual Testnet in MetaMask.");
        }
      }

      if (token === "USDC") {
        setTxState("MINING");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const fakeHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
        setTxHash(fakeHash);
        
        saveTransactionToLocal(fakeHash, recipient, amount, "USDC");
        setTxState("SUCCESS");
        return;
      }

      // Real on-chain tx
      const tx = await sendTransaction(recipient, amount);
      setTxHash(tx.hash);
      setTxState("MINING");

      await tx.wait();
      
      const newBal = await getBalance(walletAddress);
      setBalance(newBal);

      saveTransactionToLocal(tx.hash, recipient, amount, "RITUAL");
      setTxState("SUCCESS");

    } catch (error) {
      console.error(error);
      setErrorMessage(error.reason || error.message || "Transaction failed");
      setTxState("ERROR");
    }
  };

  const saveTransactionToLocal = (hash, to, amountValue, symbol) => {
    const history = JSON.parse(localStorage.getItem("ritual_tx_history") || "[]");
    const newTx = {
      hash,
      to,
      from: walletAddress,
      amount: amountValue,
      symbol,
      timestamp: new Date().toISOString(),
      status: "Success",
    };
    history.unshift(newTx);
    localStorage.setItem("ritual_tx_history", JSON.stringify(history));
  };

  const resetForm = () => {
    setRecipient("");
    setAmount("");
    setTxHash("");
    setTxState("IDLE");
  };

  return (
    <div className="send-container animate-fade-in" style={{ maxWidth: "540px", margin: "0 auto" }}>
      <h1 className="page-title">Send Funds</h1>
      <p className="page-subtitle">Transfer tokens instantly across the Ritual Testnet.</p>

      {txState === "IDLE" && (
        <form onSubmit={handleSend} className="premium-card">
          <div className="form-group">
            <label className="form-label">Asset</label>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                className={`theme-btn ${token === "RITUAL" ? "active" : ""}`}
                style={{ padding: "12px", border: "1px solid var(--border-color)", flex: 1 }}
                onClick={() => setToken("RITUAL")}
              >
                <span>RITUAL</span>
              </button>
              <button
                type="button"
                className={`theme-btn ${token === "USDC" ? "active" : ""}`}
                style={{ padding: "12px", border: "1px solid var(--border-color)", flex: 1 }}
                onClick={() => setToken("USDC")}
              >
                <span>USDC (Simulated)</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Recipient Wallet Address</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="premium-input"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>
            <p className="form-help">Enter the recipient's 42-character Hexadecimal public address.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Amount</label>
            <div className="input-wrapper">
              <input
                type="number"
                step="any"
                min="0.000001"
                className="premium-input"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              <span className="form-help">Available: {token === "RITUAL" ? `${balance} RITUAL` : "1,000.00 USDC"}</span>
              <button
                type="button"
                onClick={() => setAmount(token === "RITUAL" ? balance : "100")}
                style={{ border: "none", background: "transparent", color: "var(--accent-color)", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
              >
                Use Max
              </button>
            </div>
          </div>

          {!isCorrectNetwork && (
            <div className="network-badge incorrect" onClick={switchNetwork} style={{ width: "100%", justifyContent: "center", padding: "12px", marginBottom: "20px" }}>
              <FiInfo style={{ marginRight: "8px" }} />
              <span>Click to switch to Ritual Testnet first</span>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={!recipient || !amount}>
            <FiSend style={{ marginRight: "8px", verticalAlign: "middle" }} />
            <span>Send Transaction</span>
          </button>
        </form>
      )}

      {(txState === "SUBMITTING" || txState === "MINING") && (
        <div className="premium-card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <FiLoader className="animate-pulse" style={{ fontSize: "50px", color: "var(--accent-color)", margin: "0 auto 24px", animation: "spin 2s linear infinite" }} />
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>
            {txState === "SUBMITTING" ? "Requesting Signature" : "Mining Transaction"}
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
            {txState === "SUBMITTING"
              ? "Please confirm the transaction details in your MetaMask wallet extension."
              : "Broadcasting transfer to the Ritual Network blockchain. Waiting for block confirmation."}
          </p>
          {txHash && (
            <div style={{ marginTop: "24px" }}>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Transaction Hash</p>
              <a
                href={`https://explorer.ritualfoundation.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-mono)", fontSize: "12px", textDecoration: "underline", wordBreak: "break-all" }}
              >
                {txHash}
              </a>
            </div>
          )}
        </div>
      )}

      {txState === "SUCCESS" && (
        <div className="premium-card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <FiCheckCircle style={{ fontSize: "60px", color: "var(--success-color)", margin: "0 auto 24px" }} />
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
            Transfer Complete!
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "30px" }}>
            Successfully sent <strong style={{ color: "var(--text-primary)" }}>{amount} {token}</strong> to <strong style={{ color: "var(--text-primary)" }}>{recipient.slice(0,6)}...{recipient.slice(-4)}</strong>.
          </p>
          
          <div style={{ background: "var(--bg-tertiary)", padding: "16px", borderRadius: "12px", marginBottom: "30px", textAlign: "left" }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>TX Hash</p>
            <a
              href={`https://explorer.ritualfoundation.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-color)", textDecoration: "underline", wordBreak: "break-all" }}
            >
              {txHash}
            </a>
          </div>

          <button onClick={resetForm} className="submit-btn" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
            Make Another Transfer
          </button>
        </div>
      )}

      {txState === "ERROR" && (
        <div className="premium-card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <FiXCircle style={{ fontSize: "60px", color: "var(--danger-color)", margin: "0 auto 24px" }} />
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>
            Transaction Failed
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "30px" }}>
            {errorMessage || "An unexpected error occurred during execution."}
          </p>

          <button onClick={resetForm} className="submit-btn">
            Retry Transfer
          </button>
        </div>
      )}
    </div>
  );
}

export default Send;