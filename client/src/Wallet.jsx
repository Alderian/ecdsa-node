import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, nounce }) {
  async function onChange(evt) {
    let privateKey = evt.target.value;

    if (privateKey.startsWith("0x")) {
      privateKey = privateKey.slice(2)
    }

    setPrivateKey(privateKey);
    const address = "0x" + toHex(secp.getPublicKey(privateKey).slice(1).slice(-20));

    setAddress(address)
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input placeholder="Type your private key: 0x1" value={privateKey} onChange={onChange}></input>
      </label>

      <label>
        Wallet Address: {address.slice(0, 6) + "..." + address.slice(-4)}
      </label>

      <label>
        Nounce: {nounce}
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
