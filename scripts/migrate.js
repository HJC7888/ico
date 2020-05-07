const Web3 = require("web3") // web3-1.0.0-beta.36
const fs = require("fs-extra")
const path = require("path")

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

const projectListFile = path.resolve(__dirname,"../src/build","ProjectList.json")

const  {interface,bytecode} = require(projectListFile)

async function deployContract(){
    const accounts = await web3.eth.getAccounts()

    const tx = {
        from:accounts[0],
        gas:2000000
    }

    const instance = await new web3.eth.Contract(JSON.parse(interface)).deploy({data:"0x"+bytecode}).send(tx)

    console.log("合约地址:",instance.options.address)

    const adrFile = path.resolve(__dirname,"../src/build/address.json")
    fs.writeFileSync(adrFile,JSON.stringify(instance.options.address))
}

deployContract()