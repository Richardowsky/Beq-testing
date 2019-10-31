const {
    web3
    , contract
    , provider
} = require("./init");

const showStats = async () => {
    console.log(`Accounts stats:`);
    for (address in provider.address) {
        const tokens = await contract.methods.balanceOf(address).call();
        const ethers = await web3.eth.getBalance(address);
        console.log(`   ${address}: ethers: ${ethers}, tokens: ${tokens}`);
    }
}

async function scenario() {
    await showStats();
}

scenario();

provider.engine.stop();

