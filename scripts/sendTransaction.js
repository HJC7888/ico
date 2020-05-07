const Web3 = require("web3")

const web3 = new Web3(new 
Web3.providers.HttpProvider('http://localhost:8545'));

async function send(fromIndex,to,amount){
    const accounts = await web3.eth.getAccounts()
    //console.log(accounts)
    amount = amount.toString()
    const tx = {from:accounts[fromIndex],to,value:web3.utils.toWei(amount)}

    const block = await web3.eth.sendTransaction(tx)

    console.log(block)
}

send(7,"0x0a9390b683A486Bf6d87572348D82F3D21F8F2Bc",30)

