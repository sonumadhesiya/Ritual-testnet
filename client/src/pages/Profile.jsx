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

          {!registeredName ? (
            <form onSubmit={handleRegister} style={{ borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
              <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", marginBottom: "12px", color: "var(--text-primary)" }}>
                Register Username
              </h4>
              
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-prefix">@</span>
                  <input
                    type="text"
                    className="premium-input prefixed"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    required
                    disabled={loading}
                  />
                </div>
                <p className="form-help">Lowercases, numbers, underscores (3-15 chars). Registration fee: 1.0 RITUAL.</p>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <FiLoader className="animate-pulse" style={{ fontSize: "24px", color: "var(--accent-color)", animation: "spin 2s linear infinite" }} />
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px" }}>Confirming in MetaMask...</p>
                </div>
              ) : (
                <button type="submit" className="submit-btn" disabled={!username}>
                  <span>Register Handle</span>
                </button>
              )}

              {txHash && (
                <div style={{ marginTop: "16px", background: "var(--bg-tertiary)", padding: "10px", borderRadius: "8px", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Tx Hash: </span>
                  <a href={`https://explorer.ritualfoundation.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", fontFamily: "var(--font-mono)" }}>
                    {txHash.slice(0,10)}...{txHash.slice(-8)}
                  </a>
                </div>
              )}
            </form>
          ) : (
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "24px", display: "flex", alignItems: "center", gap: "10px", color: "var(--success-color)" }}>
              <FiCheckCircle style={{ fontSize: "20px" }} />
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Your address is linked to @{registeredName}</span>
            </div>
          )}
        </div>

        {/* Right Side: Identity Lookup */}
        <div className="premium-card">
          <h3 className="card-title">Directory Lookup</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>
            Search for registered usernames on Ritual Network to find their associated public keys.
          </p>

          <form onSubmit={handleLookup} style={{ marginBottom: "24px" }}>
            <div className="form-group" style={{ display: "flex", gap: "8px", marginBottom: "0" }}>
              <div className="input-wrapper" style={{ flex: 1 }}>
                <input
                  type="text"
                  className="premium-input"
                  placeholder="Search @username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-btn" style={{ width: "auto", padding: "0 20px" }}>
                <FiSearch />
              </button>
            </div>
          </form>

          {searchResult && (
            <div className="animate-fade-in" style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
              borderRadius: "16px",
              padding: "20px",
            }}>
              {searchResult === "available" ? (
                <div>
                  <h4 style={{ color: "var(--success-color)", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FiTag />
                    <span>Handle Available!</span>
                  </h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "6px" }}>
                    No one has claimed this handle yet. Connect your wallet to register it.
                  </p>
                </div>
              ) : (
                <div>
                  <h4 style={{ color: "var(--text-primary)", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FiUser />
                    <span>Handle Registered</span>
                  </h4>
                  <p style={{ fontSize: "13px", marginTop: "12px", color: "var(--text-secondary)" }}>Linked Address:</p>
                  <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                    wordBreak: "break-all",
                    background: "var(--bg-secondary)",
                    padding: "10px",
                    borderRadius: "8px",
                    marginTop: "6px",
                    border: "1px solid var(--border-color)"
                  }}>
                    {searchOwner}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;