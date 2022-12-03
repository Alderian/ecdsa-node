const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();

console.log("Private key: ", "0x" + toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log("Public key: ", "0x" + toHex(publicKey.slice(-20)));
