const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const axios = require("axios");
const cors = require('cors');

const database = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "sa",
  password: "123456",
  database: "ProjectWebsite",
});

database.connect((err) => {
  if (err) throw err;
  console.log("API create product successfully connected to the server");
});

const routes = express.Router();
routes.use(cors());
routes.use(express.json());
routes.use(bodyParser.urlencoded({ extended: true }));

routes.get("/", async (req, res) => {
    res.status(403).json( { message: "Bạn không có quyền truy cập vào ứng đường dẩn này" } );
});

routes.post("/", async (req, res) => {
    let { username, password, productname, productsubtitle, productdescription, productprice, productquantity, productinformation } = req.body;

    console.log(req.body);

    username = await normalizeString(username);
    password = await normalizeString(password);

    axios.post('http://localhost:3000/API/authentication', {
      username: username,
      password: password
  }, {
      headers: {
        'Content-Type': 'application/json'
      }
  })
  .then(async response => {
    if (response.data.status) {
        console.log(response.data);
    }
  })
  .catch(e => {
    res.status(200).json({ status: false, message: e.toString() });
  });
});

function normalizeString(str) {
    return String(str)
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
  }

module.exports = routes;