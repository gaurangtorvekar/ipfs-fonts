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

const getFontFile = async (fontName) => {
	// TODO - handle font names with a +
	let response = await fs.readFile("sampleFonts.json");
	JSONData = JSON.parse(response);
	console.log("JSONData = ", JSONData);
	var JSONObj = lodash.filter(JSONData, { "fontName": fontName });
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
			return JSONObj[0].fontDwebLink;
		}
	} else {
		return false;
	}
};

// This function will return a CSS snippet like so -
// @font-face {
// 	font-family: 'Crimson Pro';
// 	src: url(https://fonts.gstatic.com/s/crimsonpro/v23/q5uUsoa5M_tv7IihmnkabC5XiXCAlXGks1WZzm1MMZs-dtC4yJtEbtM.woff2) format('woff2');
// }
//TODO - For paid fonts, ask the user to include a TXN hash that proves that they have paid for the font. Enable max-TXNs that enable X times use of the font
const createCSS = async (cssInfo) => {
	console.log("In the helper function = ", cssInfo);
	// let cssText = `@font-face {
	// 	font-family: ${cssInfo.fontFamily};
	// 	font-style: normal;
	// 	font-weight: 300;
	// 	src: url(${await getFontFile(cssInfo.fontFamily)}) format(${await getFileExtension(cssInfo.fontFamily)});
	// 	unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
	//   }`;
	const fontURL = await getFontFile(cssInfo.fontFamily);
	const isPaidFont = await checkPaidFont(cssInfo.fontFamily);
	if (isPaidFont) {
		checkPayment();
	}
	return "AOK";
	if (fontURL) {
		let cssText = `@font-face {
			font-family: ${cssInfo.fontFamily};
			src: url(${fontURL});
		  }`;
		console.log(cssText);
		return cssText;
	} else {
		return null;
	}
};

module.exports = {
	createCSSLink,
	createCSS,
};
