import logo from "./logo.svg";
import "./App.css";
import React from "react";

import web3 from './provider/web3';
import lottery from "./contracts/lottery";

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    window.ethereum.request({ method: "eth_requestAccounts" });

    await this.loadContractData();
  }

  loadContractData = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const value = '';

    this.setState({ manager, players, balance, value });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });
    } catch (e) {
      this.setState({ message: `Failed: ${this.processError(e)}` }, () => this.loadContractData());
      return;
    }

    this.setState({ message: 'You have been entered!' }, () => this.loadContractData());
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
    } catch (e) {
      this.setState({ message: `Failed: ${this.processError(e)}` }, () => this.loadContractData());
      return;
    }

    this.setState({ message: 'A winner has been picked!' }, () => this.loadContractData());
  }

  processError = (error) => {
    try {
      const messageJson = JSON.parse(error.message.slice(error.message.indexOf('{'), error.message.length - 1));
      const messageData = messageJson.value.data.data;

      return messageData[Object.keys(messageData)[0]].reason;
    } catch (e) {
      console.log(e);
      return error.message;
    }
  }

  render() {
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter: </label>
            <input type="text" value={this.state.value} onChange={event => this.setState({ value: event.target.value })}></input>
            <button>Enter</button>
          </div>
        </form>
        <hr />
        <button type="button" onClick={this.onClick}>Pick a winner!</button>
        <hr />
        <span>{this.state.message}</span>
      </div>
    );
  }
}
export default App;
