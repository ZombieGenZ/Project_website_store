const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
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
  console.log("API get user successfully connected to the server");
});

const routes = express.Router();
routes.use(cors());
routes.use(express.json());
routes.use(bodyParser.urlencoded({ extended: true }));



routes.post("/", async (req, res) => {
    let { productid } = req.body;

    try {
      const pictureData = await GetUserData();
      res.status(200).json({ status: true, data: pictureData });
    }
    catch (e) {
      res.status(200).json({ status: false, data: null, message: e.toString() });
    }
});

  async function GetUserData() {
    return new Promise((resolve, reject) => {
      database.query(`SELECT userid, username, money, revenue, avatarpath, Verify, createtime, permissionid, bio, penalty FROM Account`, (err, res) => {
        if (err) {
          reject(err);
        } else {
          if (res.length > 0) {
            resolve(res);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

module.exports = routes;