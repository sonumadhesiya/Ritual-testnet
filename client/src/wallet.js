import { ethers } from "ethers";

// Ritual Testnet Constants
export const RITUAL_CHAIN_ID = "0x7BB"; // 1979 in hex
export const RITUAL_CHAIN_DECIMAL = 1979;
export const RITUAL_CHAIN_PARAMS = {
  chainId: RITUAL_CHAIN_ID,
  chainName: "Ritual Testnet",
  rpcUrls: ["https://rpc.ritualfoundation.org"],
  nativeCurrency: {
    name: "RITUAL",
    symbol: "RITUAL",
    decimals: 18,
  },
  blockExplorerUrls: ["https://explorer.ritualfoundation.org"],
};

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to use this application.");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    
    // Automatically attempt switching to Ritual on connect
    await switchToRitual();
    
    return accounts[0];
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

export const getBalance = async (address) => {
  if (!window.ethereum || !address) return "0.0000";
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    return parseFloat(ethers.formatEther(balance)).toFixed(4);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0.0000";
  }
};

export const getNetwork = async () => {
  if (!window.ethereum) return null;
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    return {
      chainId: "0x" + network.chainId.toString(16).toUpperCase(),
      name: network.name,
      decimalChainId: Number(network.chainId),
    };
  } catch (error) {
    console.error("Error fetching network:", error);
    return null;
  }
};

export const switchToRitual = async () => {
  if (!window.ethereum) return false;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: RITUAL_CHAIN_ID }],
    });
    return true;
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (error.code === 4902 || error.code === -32603) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [RITUAL_CHAIN_PARAMS],
        });
        return true;
      } catch (addError) {
        console.error("Error adding Ritual chain:", addError);
        return false;
      }
    }
    console.error("Error switching to Ritual chain:", error);
    return false;
  }
};

export const sendTransaction = async (to, amount) => {
  if (!window.ethereum) throw new Error("MetaMask not found");
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const tx = await signer.sendTransaction({
      to: to,
      value: ethers.parseEther(amount),
    });
    
    return tx;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};