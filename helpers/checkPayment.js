require("dotenv").config({
	path: "./.env",
});
const path = require("path");
const { abi } = require(path.resolve(__dirname, "../build/contracts/FontPayment.json"));
const fs = require("fs");

const receipt = [];

const checkPayment = async () => {
	console.log("Inside checkPayment method...");
	// if (!isArray(data)) return;
	// const provider = new .providers.InfuraProvider(
	//   process.env.MATIC_PROVIDER
	// );
	// let wallet = new .Wallet("0x" + process.env.PRIV_KEY, provider);
	// const contract = new .Contract(
	//   process.env.CONTRACT,
	//   abi,
	//   wallet
	// );
	// for (let i = 0; i < data.length; i++) {
	//   const element = data[i];
	//   const txData = await contract.safeTransferFrom(
	//     wallet.address,
	//     element.ethAddress,
	//     element.tokenId,
	//     1,
	//     "0x"
	//   );
	//   const { transactionHash } = await txData.wait();
	//   const recpt = {
	//     i: i + 1,
	//     transactionHash,
	//     ...element,
	//   };
	//   receipt.push(recpt);
	// }
	// fs.writeFileSync("receipt-1.json", JSON.stringify(receipt));
};

module.exports = {
	checkPayment,
};
