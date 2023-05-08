const { addresses } = require("./input");
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

// Replace this with your list of address and balances
const elements = [...addresses];

// Sort the elements by address
elements.sort((a, b) => a.address.localeCompare(b.address));

// Calculate the leaf nodes
const leafNodes = elements.map(el => SHA256(`${el.address}${el.balance}`));

// Create the Merkle tree
const merkleTree = new MerkleTree(leafNodes, SHA256);

// Get the Merkle root
const merkleRoot = merkleTree.getHexRoot();

console.log('Merkle root:', merkleRoot);

module.exports = {
    merkleTree
}