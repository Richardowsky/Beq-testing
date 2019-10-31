const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledContract = require("./build/inQ-C1.json");

const mnemonic = "dinner brown century empty hundred peanut later six replace attend audit very";
const provider = new HDWalletProvider(
    mnemonic,
    "https://ropsten.infura.io/v3/897089ebc50a4ee4bf29a6ac033b9207", 0, 2);

const SENDER_ADDRESS = provider.addresses[0];
const RECEIVER_ADDRESS = provider.addresses[1];
const CONTRACT_ADDRESS = '0x66a2fc9038f1bc8b44b2983c10d1714ed6d368c8';
const OWNER_ADDRESS = '0x84A2A06fd5196B20B9365b62022db2e18d8fA301';
const MALFORMED_ADDRESS = '0x84A2A06fd5196B20B9365b62022db2e18d8fA30';

const web3 = new Web3(provider);
// web3.eth.getBlockNumber().then(blockNumber => console.log("Chain height =", blockNumber));

const contract = new web3.eth.Contract(compiledContract.abi, CONTRACT_ADDRESS);

async function wrapper() {
    // const symbol = await contract.methods.symbol().call();
    // console.log("Token symbol: ", symbol);

    // const totalSupply = await contract.methods.totalSupply().call();
    // console.log("Total supply =", totalSupply);

    // let senderBalance = await contract.methods.balanceOf(SENDER_ADDRESS).call();
    // console.log("Sender balance =", senderBalance);

    // try {
    //     await contract.methods.balanceOf(MALFORMED_ADDRESS).call();
    //     console.log("====== TEST ERROR =======");
    // }
    // catch (err) {
    //     console.error("Error getting balance: ", err.reason);
    // }

    // console.log("Sending 1 NQC1 from receiver to sender...");
    // await contract.methods.transfer(SENDER_ADDRESS, 1).send({ from: RECEIVER_ADDRESS, gas: 100000 });
    // console.log("Sender balance =", await contract.methods.balanceOf(SENDER_ADDRESS).call());

    // try {
    //     console.log("Sending -1 NQC1 from sender to receiver...");
    //     await contract.methods.transfer(RECEIVER_ADDRESS, -1).send({ from: SENDER_ADDRESS, gas: 100000 });
    //     console.error("===== TEST ERROR ======");
    // }
    // catch (err) {
    //     console.log("Error sending negative amount of tokens");
    // }

    // try {
    //     console.log("Approving 10 NQC1 from sender to receiver...");
    //     await contract.methods.approve(RECEIVER_ADDRESS, 10).send({ from: SENDER_ADDRESS, gas: 100000 });
    // }
    // catch (err) {
    //     console.log("Approved funds exceed balance", err);
    // }

    console.log("\nTest SPEND MORE THAN APPROVED")
    await spendMoreThanApproved();
}

wrapper();

// approveAndSpend();



async function approveAndSpend() {
    console.log("Approving 1 NQC1 from sender to receiver...");
    await contract.methods.approve(RECEIVER_ADDRESS, 1).send({ from: SENDER_ADDRESS, gas: 100000 });
    console.log("Allowness of receiver over sender's tokens: ", await contract.methods.allowance(SENDER_ADDRESS, RECEIVER_ADDRESS).call());
    await contract.methods.transferFrom(SENDER_ADDRESS, RECEIVER_ADDRESS, 1).send({ from: RECEIVER_ADDRESS, gas: 100000 });
    console.log("   Sender balance =", await contract.methods.balanceOf(SENDER_ADDRESS).call());
    console.log("   Sending funds back to owner...");
    await contract.methods.transfer(SENDER_ADDRESS, 1).send({ from: RECEIVER_ADDRESS, gas: 100000 });
    console.log("   Sender balance = ", await contract.methods.balanceOf(SENDER_ADDRESS).call());
}

async function spendMoreThanApproved() {
    console.log("   Approving 1 NQC1 from sender to receiver...");
    await contract.methods.approve(RECEIVER_ADDRESS, 1).send({ from: SENDER_ADDRESS, gas: 100000 });
    console.log("   Allowance =", await contract.methods.allowance(SENDER_ADDRESS, RECEIVER_ADDRESS).call());
    try {
        await contract.methods.transferFrom(SENDER_ADDRESS, RECEIVER_ADDRESS, 5).send({ from: RECEIVER_ADDRESS, gas: 100000 });
    }
    catch (err) {
        console.error("   Error spending more than approved");
    }
    const allowance = await contract.methods.allowance(SENDER_ADDRESS, RECEIVER_ADDRESS).call();
    await contract.methods.decreaseAllowance(RECEIVER_ADDRESS, allowance).send({ from: SENDER_ADDRESS, gas: 100000 });
    console.log("   Allowance =", await contract.methods.allowance(SENDER_ADDRESS, RECEIVER_ADDRESS).call());
}

provider.engine.stop();