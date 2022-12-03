const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

// Prepared a list of private keys for testing only.. using generate.js script
const balances = {
    // Private key:  0x98879d5fa55c1af4744f6a1527a11d05eb35d4ef03105e005fff3c715644dab6
    "0x55458ef028a8e2ff23ae3c55e40a457519fef753": 100,
    // Private key:  0xed7a162b2a22aa80e468eae09d6284168105197957925c2ae8bc9a182cc13676
    "0x7e7e5299b0be3c0853aaa93adcf4139abed0c06c": 50,
    // Private key:  0x4a521ffc4361d241c49153a0be061e6f8f2178039457406cb38c494f35b8c9a6
    "0x7ec3940b48dfca14a35e080503a1e5a31b66c019": 75,
};

const lastTransactionNounce = {};

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = balances[address] || 0;
    res.send({ balance });
});

app.post("/send", (req, res) => {
    const { sender, recipient, amount, nounce, transactionHash, signature, recoveryBit } = req.body;

    publicKey = secp
        .recoverPublicKey(hexToBytes(transactionHash), hexToBytes(signature), recoveryBit)
        .slice(-20);

    if (sender !== "0x" + toHex(publicKey)) {
        res.status(409).send({ message: "Sender is not the signer" });
        return;
    }

    const lastNounce = lastTransactionNounce[sender] || 0;
    if (lastNounce >= nounce) {
        res.status(409).send({ message: "Sender is trying to replay nounce:", nounce });
        return;
    }

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
        return;
    }

    lastTransactionNounce[sender] = nounce;
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}
