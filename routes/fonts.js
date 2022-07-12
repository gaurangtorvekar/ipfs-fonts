var express = require("express");
var router = express.Router();
const { createCSSLink, createCSS } = require("../helpers/cssTextcreator.js");
const { addFont } = require("../helpers/addFont.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

/* GET users listing. */
router.get("/", async (req, res, next) => {
	res.send("respond with a resource1");
});

module.exports = router;
