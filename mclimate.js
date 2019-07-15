const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");

const dotenv = require("dotenv").config();
const axios = require("axios");

// Login using OAuth2
// Returns Access_token to include in further requests

router.post("/login", (req, res) => {
  axios({
    method: "post",
    url: process.env.API_URL + "/auth/login",
    data: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      username: req.body.username,
      password: req.body.password
    },
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => {
    res.cookie("access_token", response.data.auth.access_token, {
      maxAge: 86400000
    });
    res.redirect("/api/controllers");
  });
});

// Get a list of all controllers owned by user
router.get("/controllers", (req, res) => {
  axios({
    method: "get",
    url: process.env.API_URL + "/controllers",
    data: {
      serial_number: "XUS48048EUDA",
      command: "switch_on_off",
      state: "on"
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + req.cookies.access_token
    }
  }).then(function(response) {
    let controllers = response.data._embedded;

    console.log(controllers.controller);

    res.render("controllers", {
      title: "Controllers",
      controllers: controllers.controller
    });
  });
});

router.post("/controllers/switch", (req, res) => {
  axios({
    method: "post",
    url: process.env.API_URL + "/provider/send",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + req.cookies.access_token
    }
  }).then(function(response) {
    console.log("command run");
  });
});

module.exports = router;
