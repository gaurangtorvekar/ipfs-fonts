var express = require("express");
var router = express.Router();
const { createCSSLink, createCSS } = require("../helpers/cssTextcreator.js");
const { addFont } = require("../helpers/addFont.js");
const { checkPayment } = require("../helpers/checkPayment.js");
const multer = require("multer");
const fs = require("fs").promises;
const lodash = require("lodash");

/* GET home page. */
router.get("/", async (req, res, next) => {
	res.send("Hello World!");
});

/**
 * @swagger
 * /addFont:
 *   post:
 *     summary: Add a new font
 *     description: Upload a font file to IPFS, and get a CID. Can also be used for paid fonts.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fontName:
 *                 type: string
 *               paidFont:
 *                 type: string
 *               font:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The root CID of the font file on IPFS.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: bafybeia77inkw5nfumsu3kv33s6upph7wznhzw7htnn7juuv2snr6jduua
 */
router.post("/addFont", multer({ storage: multer.memoryStorage() }).single("font"), async (req, res) => {
	try {
		const cid = await addFont(req.body.fontName, req.body.paidFont, req.file);
		res.send(cid);
	} catch (e) {
		return e;
	}
});

/**
 * @swagger
 * /getFontLink:
 *   get:
 *     summary: Get the font link
 *     description: Supply a font name, and get the HTML tag <link>
 *     parameters:
 *       - in: query
 *         name: fontName
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the font
 *     responses:
 *       200:
 *         description: HTML link tag
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro&family=Literata">
 */
router.get("/getFontLink", async (req, res) => {
	try {
		const cssText = await createCSSLink(req.query.fontName);
		console.log("CSS Text within the API call = ", cssText);
		res.send(cssText);
	} catch (e) {
		return e;
	}
});

/**
 * @swagger
 * /getAllFonts:
 *   get:
 *     summary: Get all the fonts
 *     description: Returns all the fonts from the repo's sampleFonts.json file
 *     responses:
 *       200:
 *         description: An array of all fonts
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: ["Roboto","Literata"]
 */
router.get("/getAllFonts", async (req, res) => {
	try {
		let response = await fs.readFile("sampleFonts.json");
		JSONData = JSON.parse(response);
		if (JSONData) {
			let fontNames = [];
			await JSONData.forEach((element) => {
				fontNames.push(element.fontName);
			});
			res.send(fontNames);
		} else {
			res.send("Couldn't find fonts");
		}
	} catch (e) {
		return e;
	}
});

/**
 * @swagger
 * /css2:
 *   get:
 *     summary: Get the font CSS
 *     description: Returns the font related CSS that is embedded in the webpage DOM
 *     parameters:
 *       - in: query
 *         name: family
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the font
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Polygon address of the user
 *     responses:
 *       200:
 *         description: HTML link tag
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro&family=Literata">
 */
// This API endpoint will return a CSS snippet like so -
// @font-face {
// 	font-family: 'Crimson Pro';
// 	src: url(https://fonts.gstatic.com/s/crimsonpro/v23/q5uUsoa5M_tv7IihmnkabC5XiXCAlXGks1WZzm1MMZs-dtC4yJtEbtM.woff2) format('woff2');
//   }
router.get("/css2", async (req, res) => {
	try {
		let cssInfo = {
			fontFamily: req.query.family,
			userAddress: req.query.address,
		};
		const cssText = await createCSS(cssInfo);
		console.log("In the API", cssText);
		if (cssText) {
			res.send(cssText);
		} else {
			res.send("Cannot find text");
		}
	} catch (e) {
		return e;
	}
});

module.exports = router;
