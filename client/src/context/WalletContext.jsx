import React, { createContext, useContext, useState, useEffect } from "react";
import { connectWallet, getBalance, getNetwork, switchToRitual, RITUAL_CHAIN_DECIMAL } from "../wallet";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0.0000");
  const [network, setNetwork] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isLoading, setIsLoading] = useState(false);

  // Apply and persist theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          
          const bal = await getBalance(address);
          setBalance(bal);

          const net = await getNetwork();
          setNetwork(net);
          setIsCorrectNetwork(net ? net.decimalChainId === RITUAL_CHAIN_DECIMAL : false);
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err);
      }
    }
  };

  useEffect(() => {
    checkWalletConnection();

    if (window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          const bal = await getBalance(address);
          setBalance(bal);
        } else {
          setWalletAddress("");
          setBalance("0.0000");
          setNetwork(null);
          setIsCorrectNetwork(false);
        }
      };

      const handleChainChanged = async () => {
        const net = await getNetwork();
        setNetwork(net);
        setIsCorrectNetwork(net ? net.decimalChainId === RITUAL_CHAIN_DECIMAL : false);
        if (walletAddress) {
          const bal = await getBalance(walletAddress);
          setBalance(bal);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [walletAddress]);

  const connect = async () => {
    setIsLoading(true);
    try {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
        const bal = await getBalance(address);
        setBalance(bal);
        const net = await getNetwork();
        setNetwork(net);
        setIsCorrectNetwork(net ? net.decimalChainId === RITUAL_CHAIN_DECIMAL : false);
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      alert(err.message || "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setWalletAddress("");
    setBalance("0.0000");
    setNetwork(null);
    setIsCorrectNetwork(false);
  };

  const switchNetwork = async () => {
    const success = await switchToRitual();
    if (success) {
      const net = await getNetwork();
      setNetwork(net);
      setIsCorrectNetwork(net ? net.decimalChainId === RITUAL_CHAIN_DECIMAL : true);
      if (walletAddress) {
        const bal = await getBalance(walletAddress);
        setBalance(bal);
      }
    } else {
      alert("Failed to switch network. Please try switching in MetaMask manually.");
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        balance,
        network,
        isCorrectNetwork,
        theme,
        toggleTheme,
        connect,
        disconnect,
        switchNetwork,
        isLoading,
        setBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);