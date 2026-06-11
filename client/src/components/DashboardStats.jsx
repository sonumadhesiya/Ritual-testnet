function DashboardStats({
  wallet,
  balance,
  network,
}) {
  return (
    <div className="stats-grid">

      <div className="stat-card">
        <h3>Balance</h3>
        <p>{balance || "0.0000"} RITUAL</p>
      </div>

      <div className="stat-card">
        <h3>Network</h3>
        <p>{network || "Ritual Testnet"}</p>
      </div>

      <div className="stat-card">
        <h3>Wallet</h3>
        <p>
          {wallet
            ? wallet.slice(0, 8) + "..."
            : "Not Connected"}
        </p>
      </div>

      <div className="stat-card">
        <h3>Status</h3>
        <p>
          {wallet
            ? "Connected"
            : "Disconnected"}
        </p>
      </div>

    </div>
  );
}

export default DashboardStats;