const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

var auth = require("./auth");

const app = express();

app.use(cookieParser());

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Homepage Route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Login"
  });
});

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", require("./mclimate.js"));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Init Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
