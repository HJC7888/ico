import web3  from './web3'

import ProjectList from '../build/ProjectList.json'

import address from '../build/address.json'


const contract = new web3.eth.Contract(JSON.parse(ProjectList.interface),address)

export default contract