require("dotenv").config({
	path: "./.env",
});

const formatFontName = async (fontName) => {
	const fontNameFormatted = fontName.replace(/ /g, "+");
	console.log(fontNameFormatted);
	return fontNameFormatted;
};

// This function will return an HTML snippet like so -
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro&family=Literata">
const createCSS = async (fontName) => {
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

module.exports = {
	createCSS,
};
