const Web3 = require('web3');
const ProjectList = require('../src/build/ProjectList.json');
const address = require('../src/build/address.json');
const web3 = new Web3(new 
Web3.providers.HttpProvider('http://localhost:8545'));
const contract = new web3.eth.Contract(JSON.parse(ProjectList.interface), 
			address);

async function addBlock(){
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const projects = [
    {
    description: '叶问1',
    minInvest: web3.utils.toWei('5', 'ether'),
    maxInvest: web3.utils.toWei('20', 'ether'),
    goal: web3.utils.toWei('500', 'ether'),
    },
    {
    description: '叶问2',
    minInvest: web3.utils.toWei('10', 'ether'),
    maxInvest: web3.utils.toWei('150', 'ether'),
    goal: web3.utils.toWei('600', 'ether')
    },
    {
        description: '叶问3',
        minInvest: web3.utils.toWei('12', 'ether'),
        maxInvest: web3.utils.toWei('60', 'ether'),
        goal: web3.utils.toWei('800', 'ether')
    },
    {
        description: '叶问4',
        minInvest: web3.utils.toWei('12', 'ether'),
        maxInvest: web3.utils.toWei('60', 'ether'),
        goal: web3.utils.toWei('800', 'ether')
    },
    ];
    console.log(projects);

    const owner = accounts[0];
    const results = await Promise.all(projects.map(x =>
    contract.methods.createProject(x.description, x.minInvest, x.maxInvest, x.goal).send({ from: owner, gas: '1000000' })
    )
    );
    console.log(results);
}

addBlock();