function WalletCard({
  wallet,
  balance,
  network,
  transactions,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        marginTop: "80px",
        flexWrap: "wrap",
      }}
    >
      <div>
  <Card
    title="Wallet"
    value={wallet.slice(0, 12) + "..."}
  />

  <div
    style={{
      textAlign: "center",
      marginTop: "10px",
    }}
  >
    <button
      onClick={() =>
        navigator.clipboard.writeText(wallet)
      }
    >
      Copy Address
    </button>
  </div>
</div>

      <Card
        title="Balance"
        value={Number(balance).toFixed(4)}
      />

      <Card
        title="Network"
        value={network}
      />

      <Card
        title="Transactions"
        value={transactions}
      />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        width: "320px",
        height: "180px",
        background: "#111111",
        borderRadius: "20px",
        border: "1px solid #333",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          color: "#ffffff",
          marginBottom: "20px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#bdbdbd",
          fontSize: "20px",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default WalletCard;
