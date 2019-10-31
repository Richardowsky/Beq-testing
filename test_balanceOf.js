const {
    contract
    , web3
    , CONTRACT_ADDRESS
    , OWNER_ADDRESS
    , SPENDER_ADDRESS,
    provider
} = require("./init");

async function test() {
    console.log("Test balanceOf");
    await ownerBalance();
    await emptyAddress();
    await numberAddress();
    await jsonAddress();
    await stringAddress();
    await addressWithout0x();
    await twoArguments();
}

const ownerBalance = async () => {
    console.log("   Test contract owner balance");
    console.log(`       owner address: ${OWNER_ADDRESS}`);
    const ownerBalance = await contract.methods.balanceOf(OWNER_ADDRESS).call();
    console.log("       owner balance =", ownerBalance);
}

const emptyAddress = async () => {
    console.log("   Test empty address")
    try {
        await contract.methods.balanceOf().call();
        console.error("       === TEST FAILD ===");
    }
    catch (err) {
        console.log("       Can't get balance of empty address: ");
    }
}

const numberAddress = async () => {
    console.log("   Test number address");
    try {
        await contract.methods.balanceOf(123).call();
        console.error("       === TEST FAILD ===");
    }
    catch (err) {
        console.log("       Can't get balance of number: ", err.reason);
    }
}

const jsonAddress = async () => {
    console.log("   Test json address");
    try {
        await contract.methods.balanceOf({}).call();
        console.error("       === TEST FAILD ===");
    }
    catch (err) {
        console.log("       Can't get balance of json: ", err.reason);
    }
}

const stringAddress = async () => {
    console.log("   Test string address");
    try {
        await contract.methods.balanceOf("abc").call();
        console.error("       === TEST FAILD ===");
    }
    catch (err) {
        console.log("       Can't get balance of string: ", err.reason);
    }
}

const addressWithout0x = async () => {
    console.log("   Test address without hex prefix");
    const testAddress = OWNER_ADDRESS.slice(2);
    console.log(`       test address: ${testAddress}`);
    const balance = await contract.methods.balanceOf(testAddress).call();
    console.log(`       balance = ${balance}`);
}

const twoArguments = async () => {
    console.log("   Test balance with two arguments");
    console.log(`       first arg: ${OWNER_ADDRESS}`);
    console.log(`       second arg: ${SPENDER_ADDRESS}`);
    try {
        await contract.methods.balanceOf(OWNER_ADDRESS, SPENDER_ADDRESS).call();
        console.error("       === TEST FAILD ===");
    }
    catch (err) {
        console.log("       Can't get balance with two args: ");
    }
}


test();

provider.engine.stop();