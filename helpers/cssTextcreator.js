require("dotenv").config({
	path: "./.env",
});

const formatFontName = async (fontName) => {
	const fontNameFormatted = fontName.replace(/ /g, "+");
	console.log(fontNameFormatted);
	return fontNameFormatted;
};

const getFontFile = async (fontName) => {
	return "https://fonts.gstatic.com/s/crimsonpro/v23/q5uUsoa5M_tv7IihmnkabC5XiXCAlXGks1WZzm1MMZs-dtC4yJtEbtM.woff2";
};

// This function will return an HTML snippet like so -
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro&family=Literata">
const createCSSLink = async (fontName) => {
	console.log("In createCSS = ", fontName);
	let apiLink;
	if (process.env.NODE_ENV === "local") {
		apiLink = "localhost:3000";
	} else {
		apiLink = "someProdLink";
	}
	const finalLink = '<link rel="stylesheet" href="https://' + apiLink + "/css2?family=" + (await formatFontName(fontName)) + '">';
	console.log(finalLink);
	return finalLink;
};

// This function will return a CSS snippet like so -
// @font-face {
// 	font-family: 'Crimson Pro';
// 	font-style: normal;
// 	font-weight: 400;
// 	src: url(https://fonts.gstatic.com/s/crimsonpro/v23/q5uUsoa5M_tv7IihmnkabC5XiXCAlXGks1WZzm1MMZs-dtC4yJtEbtM.woff2) format('woff2');
// 	unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
//   }
const createCSS = async (cssInfo) => {
	console.log("In the helper function = ", cssInfo);
	let cssText = `@font-face {
		font-family: ${cssInfo.fontFamily};
		font-style: normal;
		font-weight: 400;
		src: url(${getFontFile(cssInfo.fontFamily)}) format('woff2');
		unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
	  }`;
	console.log(cssText);
	return cssText;
};

module.exports = {
	createCSSLink,
	createCSS,
};
