import React, { useState, useRef, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { FiLink2, FiLogOut, FiCopy, FiCheck, FiChevronDown } from "react-icons/fi";

function Header() {
  const {
    walletAddress,
    isCorrectNetwork,
    connect,
    disconnect,
    switchNetwork,
    isLoading,
  } = useWallet();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="main-header">
      <div className="header-left">
        {walletAddress ? (
          isCorrectNetwork ? (
            <div className="network-badge correct">
              <span className="badge-dot animate-pulse"></span>
              <span>Ritual Testnet</span>
            </div>
          ) : (
            <button className="network-badge incorrect" onClick={switchNetwork} title="Switch to Ritual Testnet">
              <span className="badge-dot warning"></span>
              <span>Wrong Network (Switch)</span>
            </button>
          )
        ) : (
          <div className="network-badge offline">
            <span className="badge-dot"></span>
            <span>Disconnected</span>
          </div>
        )}
      </div>

      <div className="header-right">
        <a
          href="https://faucet.ritualfoundation.org"
          target="_blank"
          rel="noopener noreferrer"
          className="header-faucet-link"
        >
          <FiLink2 />
          <span>Faucet</span>
        </a>

        {!walletAddress ? (
          <button
            className="connect-btn"
            onClick={connect}
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <div className="wallet-dropdown-container" ref={dropdownRef}>
            <button
              className="wallet-connected-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="wallet-avatar"></div>
              <span>{formatAddress(walletAddress)}</span>
              <FiChevronDown className={`chevron-icon ${dropdownOpen ? "open" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="wallet-dropdown">
                <div className="dropdown-info">
                  <p className="address-label">Connected Wallet</p>
                  <p className="address-value">{walletAddress}</p>
                </div>
                <hr className="dropdown-divider" />
                <button className="dropdown-item" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <FiCheck className="copied-icon" />
                      <span>Copied Address!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
                <button className="dropdown-item logout" onClick={() => { disconnect(); setDropdownOpen(false); }}>
                  <FiLogOut />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;