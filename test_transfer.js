const {
    contract
    , web3
    , CONTRACT_ADDRESS
    , OWNER_ADDRESS
    , SPENDER_ADDRESS: SENDER_ADDRESS
    , RECEIVER_ADDRESS
    , NO_ETHER_ADDRESS
    , provider
} = require("./init");

async function test() {
    console.log("Test transfer");
    await beforeAll();
    await transfer1();
    await transfer10pow9();
    // await insufficientFunds();
    await noReceiver();
    await stringTokens();
    await jsonArg();
    await stringOne();
    await wrongOrderOfArgs();
    await bothJsons();
    await threeArgs();
}

let receiverBalance;
let senderBalance;

const beforeAll = async () => {
    receiverBalance = await contract.methods.balanceOf(RECEIVER_ADDRESS).call();
    await contract.methods.transfer(SENDER_ADDRESS, receiverBalance).send({ from: RECEIVER_ADDRESS, gas: 100000 });
    console.log(`   Before all`);
    senderBalance = await contract.methods.balanceOf(SENDER_ADDRESS).call();
    receiverBalance = await contract.methods.balanceOf(RECEIVER_ADDRESS).call();
    console.log(`       sender balance=${senderBalance}, receiverBalance=${receiverBalance}`);
}

const beforeEach = async () => {
    receiverBalance = await contract.methods.balanceOf(RECEIVER_ADDRESS).call();
    senderBalance = await contract.methods.balanceOf(SENDER_ADDRESS).call();
    console.log(`       before transfer: sender balance=${senderBalance}, receiverBalance=${receiverBalance}`);
}

const afterEach = async () => {
    receiverBalance = await contract.methods.balanceOf(RECEIVER_ADDRESS).call();
    senderBalance = await contract.methods.balanceOf(SENDER_ADDRESS).call();
    console.log(`       after transfer: sender balance=${senderBalance}, receiverBalance=${receiverBalance}`);
}

const transfer1 = async () => {
    console.log(`   Test transfer 1 token`);
    await beforeEach();
    await contract.methods.transfer(RECEIVER_ADDRESS, 1).send({ from: SENDER_ADDRESS, gas: 100000 });
    await afterEach();
}

const transfer10pow9 = async () => {
    console.log(`   Test transfer 1 000 000 000 tokens`);
    await beforeEach();
    try {
        await contract.methods.transfer(RECEIVER_ADDRESS, 1000000000).send({ from: SENDER_ADDRESS, gas: 100000 });
        console.error("      ==== TEST ERROR ===");
    }
    catch (err) {
        console.error("       Error sending tokens", err);
    }
}

const insufficientFunds = async () => {
    console.log(`   Test insufficient funds`);
    await beforeEach();
    console.log(`       NO_ETHER_ADDRESS: ${NO_ETHER_ADDRESS}`);
    await contract.methods.transfer(NO_ETHER_ADDRESS, 1).send({ from: SENDER_ADDRESS, gas: 100000 });
    const no_ether_balance = await contract.methods.balanceOf(NO_ETHER_ADDRESS).call();
    console.log(`       no_ether_contract balance=${no_ether_balance}`);
    try {
        await contract.methods.transfer(RECEIVER_ADDRESS, 1).send({ from: NO_ETHER_ADDRESS, gas: 100000 });
        console.error(`      === TEST FAILED ===`);
    }
    catch (err) {
        console.log(`       Can't transfer`);
    }
}

const noReceiver = async () => {
    console.log("   Test transfer without specifying receiver");
    console.log(`       sender: ${SENDER_ADDRESS}`);
    try {
        await contract.methods.transfer(1).send({ from: SENDER_ADDRESS, gas: 100000 });
        console.error("       === TEST FAILD ===");
    }
    catch (err) {
        console.log("       Can't transfer without receiver: ");
    }
}

const stringTokens = async () => {
    console.log("   Test transfer with string tokens");
    await beforeEach();
    await contract.methods.transfer(RECEIVER_ADDRESS, "1").send({ from: SENDER_ADDRESS, gas: 100000 });
    await afterEach();
}

const jsonArg = async () => {
    console.log("   Test transfer with json arg");
    const amount = 1;
    await beforeEach();
    try {
        await contract.methods.transfer({ RECEIVER_ADDRESS, amount }).send({ from: SENDER_ADDRESS, gas: 100000 });
        console.error(`      === TEST FAILED ===`);
    }
    catch (err) {
        console.log("       Can't transfer with json arg: ");
    }
}

const stringOne = async () => {
    console.log("   Test transfer with string 'one'");
    await beforeEach();
    try {
        await contract.methods.transfer(RECEIVER_ADDRESS, "one").send({ from: SENDER_ADDRESS, gas: 100000 });
        console.error(`      === TEST FAILED ===`);
    }
    catch (err) {
        console.log("       Can't transfer: ");
    }
}

const wrongOrderOfArgs = async () => {
    console.log(`   Test with wrong order of arguments`);
    await beforeEach();
    try {
        await contract.methods.transfer(1, RECEIVER_ADDRESS).send({ from: SENDER_ADDRESS, gas: 100000 });
        console.error(`      === TEST FAILED ===`);
    }
    catch (err) {
        console.log("       Can't transfer: ");
    }
}

const bothJsons = async () => {
    console.log(`   Test with both json arguments`);
    await beforeEach();
    try {
        await contract
            .methods
            .transfer({ address: RECEIVER_ADDRESS }, { amount: 1 })
            .send({ from: SENDER_ADDRESS, gas: 100000 });
        console.error(`      === TEST FAILED ===`);
    }
    catch (err) {
        console.log("       Can't transfer ", err.reason);
    }
}

const threeArgs = async () => {
    console.log(`   Test with three arguments`);
    await beforeEach();
    try {
        await contract.methods.transfer(RECEIVER_ADDRESS, 1, 1).send({ from: SENDER_ADDRESS, gas: 100000 });
        console.error(`      === TEST FAILED ===`);
    }
    catch (err) {
        console.log("       Can't transfer");
    }
}

test();

provider.engine.stop();