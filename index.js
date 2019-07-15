const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const dotenv = require("dotenv").config();

const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Homepage Route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Login"
  });
});

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MClimate API routes
app.use("/api", require("./mclimate.js"));

// Init Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
