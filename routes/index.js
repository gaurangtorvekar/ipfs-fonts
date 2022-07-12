var express = require("express");
var router = express.Router();
const { createCSSLink, createCSS } = require("../helpers/cssTextcreator.js");
const { addFont } = require("../helpers/addFont.js");
const multer = require("multer");

/* GET home page. */
router.get("/", async (req, res, next) => {
	res.send("Hello World!");
});

router.post("/addFont", multer({ storage: multer.memoryStorage() }).single("font"), async (req, res) => {
	console.log(req.file);
	await addFont(req.body.fontName, req.file);
	res.send("AOK");
});

// This API endpoint will return an HTML snippet like so -
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro&family=Literata">
router.get("/getFontLink", async (req, res) => {
	console.log(req.body);
	const cssText = await createCSSLink(req.body.fontName);
	console.log("CSS Text within the API call = ", cssText);
	res.send(cssText);
});

// This API endpoint will return a CSS snippet like so -
// @font-face {
// 	font-family: 'Crimson Pro';
// 	src: url(https://fonts.gstatic.com/s/crimsonpro/v23/q5uUsoa5M_tv7IihmnkabC5XiXCAlXGks1WZzm1MMZs-dtC4yJtEbtM.woff2) format('woff2');
//   }
router.get("/css2", async (req, res) => {
	const fontFamily = req.query.family;
	let cssInfo = {
		fontFamily: fontFamily,
	};
	const cssText = await createCSS(cssInfo);
	console.log("In the API", cssText);
	if (cssText) {
		res.send(cssText);
	} else {
		res.send("Cannot find text");
	}
});

module.exports = router;
