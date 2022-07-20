var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var fontsRouter = require("./routes/fonts");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

var app = express();

const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		title: "web3 fonts API",
		version: "1.0.0",
		description: "A decentralized font delivery network",
		license: {
			name: "Licensed Under GPL 3.0",
			url: "https://www.gnu.org/licenses/gpl-3.0.txt",
		},
		contact: {
			name: "Gaurang Torvekar",
			url: "https://www.linkedin.com/in/gaurangtorvekar/",
		},
	},
	servers: [
		{
			url: "https://ipfs-fonts.herokuapp.com",
			description: "Production server",
		},
		{
			url: "http://localhost:3000",
			description: "Development server",
		},
	],
};

const options = {
	swaggerDefinition,
	// Paths to files containing OpenAPI definitions
	apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/fonts", fontsRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
