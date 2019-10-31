const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledContract = require("./build/inQ-C1.json");

const mnemonic = "dinner brown century empty hundred peanut later six replace attend audit very";
const provider = new HDWalletProvider(
    mnemonic,
    "https://ropsten.infura.io/v3/897089ebc50a4ee4bf29a6ac033b9207", 0, 10);
exports.provider = provider;

exports.SPENDER_ADDRESS = provider.addresses[0];
exports.RECEIVER_ADDRESS = provider.addresses[1];
exports.NO_ETHER_ADDRESS = provider.addresses[2];
const CONTRACT_ADDRESS = '0x66a2fc9038f1bc8b44b2983c10d1714ed6d368c8';
exports.CONTRACT_ADDRESS = CONTRACT_ADDRESS;
exports.OWNER_ADDRESS = '0x84A2A06fd5196B20B9365b62022db2e18d8fA301';
const web3 = new Web3(provider);
exports.web3 = web3;
// web3.eth.getBlockNumber().then(blockNumber => console.log("Chain height =", blockNumber));

exports.contract = new web3.eth.Contract(compiledContract.abi, CONTRACT_ADDRESS);

