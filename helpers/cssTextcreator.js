require("dotenv").config({
	path: "./.env",
});
const fs = require("fs").promises;
const path = require("path");
const lodash = require("lodash");
const { checkPayment } = require(path.resolve(__dirname, "./checkPayment.js"));

const formatFontName = async (fontName) => {
	const fontNameFormatted = fontName.replace(/ /g, "+");
	console.log(fontNameFormatted);
	return fontNameFormatted;
};

const cleanFontName = async (fontName) => {
	const cleanedFontName = fontName.replace("+", / /g);
	return cleanedFontName;
};

const getFontFile = async (fontName) => {
	let response = await fs.readFile("sampleFonts.json");
	JSONData = JSON.parse(response);
	console.log("JSONData = ", JSONData);
	const cleanedFontName = await cleanFontName(fontName);
	console.log("cleanedFontName = ", cleanedFontName);
	const JSONObj = lodash.filter(JSONData, { "fontName": cleanedFontName });
	console.log("Selected JSON = ", JSONObj);
	if (JSONObj[0]) {
		return JSONObj[0].fontDwebLink;
	} else {
		return null;
	}
};

const getFileExtension = async (fontName) => {
	let response = await fs.readFile("sampleFonts.json");
	JSONData = JSON.parse(response);
	console.log("JSONData = ", JSONData);
	var JSONObj = lodash.filter(JSONData, { "fontName": fontName });
	console.log("Selected JSON = ", JSONObj);
	if (JSONObj) {
		return JSONObj[0].fileFormat;
	} else {
		return null;
	}
};

// This function will return an HTML snippet like so -
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro&family=Literata">
const createCSSLink = async (fontName) => {
	console.log("In createCSS = ", fontName);
	let apiLink;
	if (process.env.NODE_ENV === "local") {
		apiLink = "http://localhost:3000";
	} else {
		apiLink = "https://ipfs-fonts.herokuapp.com";
	}
	const finalLink = `<link rel="stylesheet" href="${apiLink}/css2?family=${await formatFontName(fontName)}">`;
	console.log(finalLink);
	return finalLink;
};

const checkPaidFont = async (fontName) => {
	var JSONObj = lodash.filter(JSON.parse(await fs.readFile("sampleFonts.json")), { "fontName": fontName });
	console.log("Selected JSON in checkPaidFont = ", JSONObj);
	if (JSONObj) {
		if (JSONObj[0].paidFont) {
			return true;
		} else {
			return null;
		}
	} else {
		return null;
	}
};

const cssText = async (fontFamily, fontURL) => {
	if (fontURL) {
		let cssText = `@font-face {
			font-family: ${fontFamily};
			src: url(${fontURL});
		  }`;
		console.log(cssText);
		return cssText;
	} else {
		return null;
	}
};

// This function will return a CSS snippet like so -
// @font-face {
// 	font-family: 'Crimson Pro';
// 	src: url(https://fonts.gstatic.com/s/crimsonpro/v23/q5uUsoa5M_tv7IihmnkabC5XiXCAlXGks1WZzm1MMZs-dtC4yJtEbtM.woff2) format('woff2');
// }
const createCSS = async (cssInfo) => {
	console.log("In the helper function = ", cssInfo);
	const fontURL = await getFontFile(cssInfo.fontFamily);
	const isPaidFont = await checkPaidFont(cssInfo.fontFamily);
	console.log("isPaidFont = ", isPaidFont);
	let text;
	if (isPaidFont) {
		const ipfsHash = await checkPayment(cssInfo.userAddress);
		if (ipfsHash) {
			console.log("Got back IPFS Hash = ", ipfsHash);
			text = await cssText(cssInfo.fontFamily, fontURL);
			console.log("Got back text = ", text);
			return text;
		} else {
			return null;
		}
	} else {
		console.log("In the else condition, fontURL = ", fontURL);
		text = await cssText(cssInfo.fontFamily, fontURL);
		return text;
	}
};

module.exports = {
	createCSSLink,
	createCSS,
};
