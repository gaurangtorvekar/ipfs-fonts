require("dotenv").config({
	path: "./.env",
});
const fsp = require("fs");
const fs = fsp.promises;
const axios = require("axios");
var FormData = require("form-data");
const { getFilesFromPath, Web3Storage } = require("web3.storage");

// 1. Check the JSON in the project folder to see if this font already fs.exist
// 2. If it doesn't exist, then upload to IPFS through web3.storage
// 3. Save this link in the JSON file
// 4. Use this link to serve the font
const addFont = async (fontNameArg, fileObj) => {
	let response = await fs.readFile("sampleFonts.json");
	JSONData = JSON.parse(response);
	console.log("JSONData = ", JSONData);

	if (!JSONData.some((font) => font.fontName === fontNameArg)) {
		console.log("Adding a new font to the JSON now...");
		const client = new Web3Storage({ token: process.env.WEB3STORAGE_API_TOKEN });
		const filePath = "uploads/fonts/" + fileObj.originalname;
		const fontFile = await fs.readFile(fileObj.path);
		await fs.writeFile(filePath, fontFile);
		const fontFileToUpload = await getFilesFromPath(filePath);
		const rootCid = await client.put(fontFileToUpload);
		console.log(rootCid);
		const dbwebLink = `https://${rootCid}.ipfs.dweb.link/${fileObj.originalname}`;
		console.log(dbwebLink);
		const fontJSON = {
			"fontName": fontNameArg,
			"fontDwebLink": dbwebLink,
		};
		JSONData.push(fontJSON);
		console.log("New JSON data = ", JSONData);
		const data = JSON.stringify(JSONData);
		await fs.writeFile("sampleFonts.json", data);
	}
};

module.exports = {
	addFont,
};
