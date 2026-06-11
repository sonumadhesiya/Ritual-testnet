import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import {
  FiHome,
  FiSend,
  FiDownload,
  FiClock,
  FiUser,
  FiSettings,
  FiSun,
  FiMoon,
  FiCompass,
  FiX,
} from "react-icons/fi";
import logo from "../assets/images.png";

function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const { theme, toggleTheme } = useWallet();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <img src={logo} alt="Ritual Pay" className="brand-logo" />
        <h2 className="brand-title">Ritual Pay</h2>
        <button className="sidebar-close-btn" type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <FiX />
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={isActive("/")}>
            <Link to="/" className="menu-link" onClick={() => setMobileOpen(false)}>
              <FiHome className="nav-icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={isActive("/send")}>
            <Link to="/send" className="menu-link" onClick={() => setMobileOpen(false)}>
              <FiSend className="nav-icon" />
              <span>Send Funds</span>
            </Link>
          </li>
          <li className={isActive("/receive")}>
            <Link to="/receive" className="menu-link" onClick={() => setMobileOpen(false)}>
              <FiDownload className="nav-icon" />
              <span>Receive Payments</span>
            </Link>
          </li>
          <li className={isActive("/transactions")}>
            <Link to="/transactions" className="menu-link" onClick={() => setMobileOpen(false)}>
              <FiClock className="nav-icon" />
              <span>History</span>
            </Link>
          </li>
          <li className={isActive("/profile")}>
            <Link to="/profile" className="menu-link" onClick={() => setMobileOpen(false)}>
              <FiUser className="nav-icon" />
              <span>Identity Profile</span>
            </Link>
          </li>
          <li className={isActive("/settings")}>
            <Link to="/settings" className="menu-link" onClick={() => setMobileOpen(false)}>
              <FiSettings className="nav-icon" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="gas-card">
          <div className="gas-card-header">
            <FiCompass className="gas-icon" />
            <span>Need Test Gas?</span>
          </div>
          <p className="gas-card-text">Get RITUAL test tokens to pay transaction fees on-chain.</p>
          <a
            href="https://faucet.ritualfoundation.org"
            target="_blank"
            rel="noopener noreferrer"
            className="gas-btn"
          >
            Claim Faucet
          </a>
        </div>

        <div className="theme-toggle-container">
          <button
            className={`theme-btn ${theme === "light" ? "active" : ""}`}
            onClick={() => {
              if (theme !== "light") toggleTheme();
            }}
            title="Light Mode"
          >
            <FiSun />
            <span>Light</span>
          </button>
          <button
            className={`theme-btn ${theme === "dark" ? "active" : ""}`}
            onClick={() => {
              if (theme !== "dark") toggleTheme();
            }}
            title="Dark Mode"
          >
            <FiMoon />
            <span>Dark</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;