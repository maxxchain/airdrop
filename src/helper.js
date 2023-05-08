const Web3 = require('web3');
const { addresses } = require("./input");
const SHA256 = require('crypto-js/sha256');
const airdropABI = require('../artifacts/contracts/MaxxAirdrop.sol/MaxxAirdrop.json').abi;
require('dotenv').config()

const web3 = new Web3(process.env.RPC);
const { merkleTree } = require('./generateMerkle');
const airdropContractAddress = process.env.CONTRACT;
const airdropContract = new web3.eth.Contract(airdropABI, airdropContractAddress);
const userPrivateKey = process.env.PRIV_KEY;

async function claimTokens(userAddress) {
    const user = addresses.find(addr => addr.address.toLowerCase() == userAddress);
    if (!user) return false;

    const balance = user.balance;
    const merkleProof = merkleTree.getProof(SHA256(`${userAddress}${balance}`))
    const gas = await airdropContract.methods.claim(balance, userAddress, merkleProof).estimateGas();
    const rawTransaction = {
        to: airdropContractAddress,
        from: userAddress,
        gas: web3.utils.toHex(gas),
        data: airdropContract.methods.claim(balance, userAddress, merkleProof).encodeABI()
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, userPrivateKey);
    const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    return result;
}

async function getBalance(userAddress) {
    const user = addresses.find(addr => addr.address.toLowerCase() == userAddress);
    if (!user) return 0;

    return user.balance;
}

module.exports = {
    claimTokens,
    getBalance
}