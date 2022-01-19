import web3 from "../provider/web3";
import lottery from "./lottery.json";

export default new web3.eth.Contract(lottery.abi, lottery.address);