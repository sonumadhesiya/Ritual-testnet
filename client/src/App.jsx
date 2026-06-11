import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import Send from "./pages/Send";
import Receive from "./pages/Receive";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { useWallet } from "./context/WalletContext";
import { FiLock, FiChevronRight } from "react-icons/fi";
import "./App.css";

// Gated Access Page wrapper
function GatedRoute({ children, title }) {
  const { walletAddress, connect, isLoading } = useWallet();

  if (!walletAddress) {
    return (
      <div className="gated-container">
        <div className="gated-card animate-fade-in">
          <div className="gated-lock-icon">
            <FiLock />
          </div>
          <h2 className="gated-title">{title || "Secure Wallet Area"}</h2>
          <p className="gated-desc">
            This module requires an active on-chain connection. Connect your MetaMask wallet to view balances, register profiles, and sign transactions.
          </p>
          <button className="gated-connect-btn" onClick={connect} disabled={isLoading}>
            <span>{isLoading ? "Connecting MetaMask..." : "Connect MetaMask Wallet"}</span>
            <FiChevronRight className="arrow" />
          </button>
        </div>
      </div>
    );
  }

  return children;
}

function App() {
  const { theme } = useWallet();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-layout" data-theme={theme}>
        <div className="bg-glow-blob blob-1"></div>
        <div className="bg-glow-blob blob-2"></div>
        <Sidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
        <div className={`mobile-nav-backdrop ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} />

        <div className="main-content">
          <Header toggleSidebar={() => setSidebarOpen((open) => !open)} />

          <main className="content-viewport">
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route
                path="/send"
                element={
                  <GatedRoute title="Send Funds">
                    <Send />
                  </GatedRoute>
                }
              />
              
              <Route
                path="/receive"
                element={
                  <GatedRoute title="Receive Payments">
                    <Receive />
                  </GatedRoute>
                }
              />
              
              <Route
                path="/transactions"
                element={
                  <GatedRoute title="Transaction History">
                    <Transactions />
                  </GatedRoute>
                }
              />
              
              <Route
                path="/profile"
                element={
                  <GatedRoute title="Identity Profile">
                    <Profile />
                  </GatedRoute>
                }
              />
              
              <Route
                path="/settings"
                element={
                  <GatedRoute title="Configuration Settings">
                    <Settings />
                  </GatedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;