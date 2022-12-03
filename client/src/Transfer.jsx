import { useState } from "react";
import server from "./server";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import * as secp from "ethereum-cryptography/secp256k1";

function hashTransaction(transaction) {
  return hashMessage(JSON.stringify(transaction));
}

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

async function signTransaction(transactionHash, privateKey) {
  return secp.sign(transactionHash, privateKey, { recovered: true });
}

function Transfer({ address, setBalance, privateKey, nounce, setNounce }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const transaction = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        nounce: nounce + 1
      };

      const hash = hashTransaction(transaction)
      transaction.transactionHash = toHex(hash)
      const [signature, recoveryBit] = await signTransaction(transaction.transactionHash, privateKey)

      transaction.signature = toHex(signature)
      transaction.recoveryBit = recoveryBit

      const {
        data: { balance },
      } = await server.post(`send`, transaction);
      setBalance(balance);
      setNounce(nounce + 1)
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
