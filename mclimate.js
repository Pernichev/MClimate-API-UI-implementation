const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const axios = require("axios");

const auth = require("./auth.js");

// OAuth 2 Login
router.get("/callback", (req, res) => {
  let authCode = req.query.code;
  console.log(authCode);
  axios({
    method: "post",
    url: process.env.API_URL + "/token",
    data: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: "http://localhost:5000/api/callback"
    },
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function(response) {
    res.cookie("access_token", response.data.auth.access_token, {
      maxAge: 86400000
    });
    res.cookie("refresh_token", response.data.auth.refresh_token, {
      maxAge: 86400000
    });
    res.redirect("/api/controllers");
  });
});

// Manual login
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
    res.cookie("refresh_token", response.data.auth.refresh_token, {
      maxAge: 86400000
    });
    res.redirect("/api/controllers");
  });
});

// Renew access token
router.post("/renew_token", auth.isAuth, (req, res) => {
  axios({
    method: "post",
    url: process.env.API_URL + "/auth/renew",
    data: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: req.cookies.refresh_token
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
router.get("/controllers", auth.isAuth, (req, res) => {
  console.log(req.cookies);
  axios({
    method: "get",
    url: process.env.API_URL + "/controllers",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + req.cookies.access_token
    }
  }).then(function(response) {
    let controllers = response.data._embedded;

    res.render("controllers", {
      title: "Controllers",
      controllers: controllers.controller
      // cookieExpTime:
    });
  });
});

// Switch ON/OFF state of a device
router.post("/controllers/switch_state", auth.isAuth, (req, res) => {
  let serial_number = req.body.serial_number;
  let command = req.body.command;
  let state = req.body.state;

  axios({
    method: "post",
    url: process.env.API_URL + "/provider/send",
    data: {
      serial_number: serial_number,
      command: command,
      state: state
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + req.cookies.access_token
    }
  }).then(function(response) {
    res.json({ msg: "success" });
  });
});

module.exports = router;
