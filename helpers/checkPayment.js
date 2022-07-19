require("dotenv").config({
	path: "./.env",
});
const path = require("path");
const { abi } = require(path.resolve(__dirname, "../build/contracts/FontPayment.json"));
const fs = require("fs");
const { ethers } = require("ethers");

const receipt = [];

const checkPayment = async (userAddress) => {
	console.log("Inside checkPayment method...");
	const provider = new ethers.providers.InfuraProvider("maticmum", process.env.INFURA_KEY);
	let wallet = new ethers.Wallet("0x" + process.env.PRIVATE_KEY, provider);
	const contract = new ethers.Contract(process.env.CONTRACT, abi, wallet);
	const buyersArray = await contract.buyers(userAddress);
	// const { transactionHash } = await txData.wait();
	// console.log("TXN Hash = ", transactionHash);
	console.log("Buyers Array = ", buyersArray);
	console.log("Amount Paid = ", buyersArray.amountPaid.toString());
	console.log("Timestamp = ", buyersArray.lastPurchase.toString());
	console.log("IPFS Hash = ", buyersArray.ipfsHash.toString());
	if (buyersArray.amountPaid) {
		return true;
	} else {
		return false;
	}
};

module.exports = {
	checkPayment,
};
