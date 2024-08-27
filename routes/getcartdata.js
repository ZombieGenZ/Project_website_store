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
  console.log("API get purchase history data successfully connected to the server");
});

const routes = express.Router();
routes.use(cors());
routes.use(express.json());
routes.use(bodyParser.urlencoded({ extended: true }));

routes.get("/", async (req, res) => {
    res.status(403).json( { message: "Bạn không có quyền truy cập vào đường dẩn này" } );
});

routes.post("/", async (req, res) => {
    const { username, password } = req.body;
    try {
        axios.post('http://localhost:3000/API/authenticationpermission', {
          username: username,
          password: password
      }, {
          headers: {
            'Content-Type': 'application/json'
          }
      })
        .then(async responseUser => {
          if (responseUser.status) {
            const success = await GetCartData(responseUser.data.userid);
            res.status(200).json({ status: true, data: success });
          }
          else {
            res.status(200).json({ status: false, message: "Bạn không có quyền truy cập vào dử liệu này" });
          }
      })
      .catch(e => {
        console.error(e);
        res.status(200).json({ status: false, message: e.toString() });
      });
    } catch (e) {
      res.status(200).json({ status: false, data: null, message: e.toString(), });
    }
});

  async function GetCartData(userid) {
    return new Promise((resolve, reject) => {
      database.query(`SELECT cartid, userid, Cart.productid, producttitle, price, productpath FROM Cart JOIN Product ON Product.productid = Cart.productid WHERE userid = ?`, [userid], (err, res) => {
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