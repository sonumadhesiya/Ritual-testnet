function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 60px",
        borderBottom: "1px solid #222",
      }}
    >
      <h2
        style={{
          color: "#a855f7",
          margin: 0,
        }}
      >
        Ritual
      </h2>

      <div
        style={{
          color: "#fff",
        }}
      >
        Ritual Testnet
      </div>
    </div>
  );
}

export default Navbar;