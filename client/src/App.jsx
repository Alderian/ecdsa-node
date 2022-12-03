import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [nounce, setNounce] = useState(0);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        address={address}
        setAddress={setAddress}
        nounce={nounce} setNounce={setNounce}
      />
      <Transfer setBalance={setBalance} address={address} privateKey={privateKey} nounce={nounce} setNounce={setNounce} />
    </div>
  );
}

export default App;
