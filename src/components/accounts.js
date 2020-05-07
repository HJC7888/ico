import React, { Component } from 'react';

import web3 from '../libs/web3'

class Accounts extends Component {
    constructor(...args) {
        super(...args)

        this.state = {
            addresses: []
        }
    }

    async componentDidMount() {
        //window.ethereum.enable()//用户授权
        const accounts = await web3.eth.getAccounts()
        const balances = await Promise.all(accounts.map(address => web3.eth.getBalance(address)))
        this.setState({
            addresses: accounts.map((account, index) => {
                return { address: account, balance: web3.utils.fromWei(balances[index], "ether") }
            })
        })
    }


    render() {
        console.log(window.ethereum.selectedAddress)
        let addresses = this.state.addresses.map((account, index) => {
            return <li key={index}>{account.address}{account.balance}</li>
        })
        return (
            <ul>
                {addresses}
            </ul>
        )
    }
}

export default Accounts