import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { sendTransaction, getBalance } from "../wallet";
import { FiUser, FiSearch, FiCheckCircle, FiLoader, FiTag } from "react-icons/fi";

const RITUAL_TREASURY = "0x63bb880c07c2aB7bBcdED0b471F884b2F2000000";

function Profile() {
  const { walletAddress, balance, setBalance } = useWallet();
  const [username, setUsername] = useState("");
  const [registeredName, setRegisteredName] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null); // null, 'available', 'claimed'
  const [searchOwner, setSearchOwner] = useState("");

  useEffect(() => {
    const claims = JSON.parse(localStorage.getItem("ritual_username_claims") || "{}");
    const name = Object.keys(claims).find(key => claims[key].toLowerCase() === walletAddress?.toLowerCase());
    if (name) {
      setRegisteredName(name);
    }
  }, [walletAddress]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username) return;

    const valid = /^[a-z0-9_]{3,15}$/.test(username);
    if (!valid) {
      alert("Usernames must be between 3 and 15 characters, lowercase, and contain only letters, numbers, or underscores.");
      return;
    }

    const claims = JSON.parse(localStorage.getItem("ritual_username_claims") || "{}");
    if (claims[username]) {
      alert("Username is already claimed!");
      return;
    }

    setLoading(true);
    setTxHash("");

    try {
      const tx = await sendTransaction(RITUAL_TREASURY, "1.0");
      setTxHash(tx.hash);
      
      await tx.wait();

      claims[username] = walletAddress;
      localStorage.setItem("ritual_username_claims", JSON.stringify(claims));
      
      setRegisteredName(username);
      setUsername("");
      
      const newBal = await getBalance(walletAddress);
      setBalance(newBal);

      alert(`Congratulations! @${username} has been registered to your address.`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    const query = searchQuery.trim().toLowerCase().replace("@", "");
    const claims = JSON.parse(localStorage.getItem("ritual_username_claims") || "{}");
    
    if (claims[query]) {
      setSearchResult("claimed");
      setSearchOwner(claims[query]);
    } else {
      setSearchResult("available");
      setSearchOwner("");
    }
  };

  return (
    <div className="profile-container animate-fade-in">
      <h1 className="page-title">Identity Profile</h1>
      <p className="page-subtitle">Claim a custom web3 username or lookup other users on Ritual Net.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        
        {/* Left Side: Identity Info & Claim Panel */}
        <div className="premium-card">
          <h3 className="card-title">Your Profile</h3>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, var(--accent-color), #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "white"
            }}>
              <FiUser />
            </div>
            <div>
              <h4 style={{ fontSize: "18px", color: "var(--text-primary)" }}>
                {registeredName ? `@${registeredName}` : "Anonymous User"}
              </h4>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-secondary)" }}>
                {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "var(--text-secondary)" }}>USDC Balance</span>
              <strong style={{ color: "var(--text-primary)" }}>1,000.00 USDC</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "var(--text-secondary)" }}>RITUAL Balance</span>
              <strong style={{ color: "var(--text-primary)" }}>{balance} RITUAL</strong>
            </div>
          </div>


        </div>

        {/* Right Side: Identity Lookup */}

      </div>
    </div>
  );
}

export default Profile;