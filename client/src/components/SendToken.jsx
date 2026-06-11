import { useState } from "react";

function SendToken() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleSend = () => {
    alert(
      `Sending ${amount} RITUAL to ${address}`
    );
  };

  return (
    <div className="send-card">
      <h2>Send Ritual</h2>

      <input
        type="text"
        placeholder="Recipient Address"
        value={address}
        onChange={(e) =>
          setAddress(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />

      <button onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

export default SendToken;