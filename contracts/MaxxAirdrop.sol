// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MaxxAirdrop is Ownable, ReentrancyGuard {
	bytes32 public merkleRoot;
	mapping(address => bool) public claimed;

	constructor(bytes32 _merkleRoot) {
		merkleRoot = _merkleRoot;
	}

	function claim(
		uint256 amount,
		address payable receiver,
		bytes32[] calldata merkleProof
	) public nonReentrant {
		// Verify that the address hasn't claimed before
		require(!claimed[receiver], "MerkleAirdrop: PWR already claimed");

		// Verify the proof and check if the user is eligible for the airdrop
		bytes32 node = keccak256(abi.encodePacked(receiver, amount));
		require(
			MerkleProof.verify(merkleProof, merkleRoot, node),
			"MerkleAirdrop: Invalid proof"
		);

		// Mark the tokens as claimed
		claimed[receiver] = true;

		// Transfer eth
		sendPWR(receiver, amount);
	}

	function sendPWR(address payable _to, uint256 _amount) private {
		(bool sent, ) = _to.call{value: _amount}("");
		require(sent, "MerkleAirdrop: Transfer failed");
	}

	function retrieve(uint256 _amount) public onlyOwner {
		(bool sent, ) = payable(owner()).call{value: _amount}("");
		require(sent, "MerkleAirdrop: Transfer failed");
	}
}
