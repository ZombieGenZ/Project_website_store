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
  console.log("API get product data successfully connected to the server");
});

const routes = express.Router();
routes.use(cors());
routes.use(express.json());
routes.use(bodyParser.urlencoded({ extended: true }));

routes.get("/", async (req, res) => {
    res.status(403).json( { message: "Bạn không có quyền truy cập vào đường dẩn này" } );
});

routes.post("/", async (req, res) => {
    const { keyword } = req.body;
    try {
      let productData = await GetProductData(keyword);
      res.status(200).json({ status: true, data: productData });
    } catch (e) {
      res.status(200).json({ status: false, data: null, message: e.toString(), });
    }
});

  async function GetProductData(keyword) {
    return new Promise((resolve, reject) => {
      database.query(`SELECT productid, sellerid, username, producttitle, productsubtitle, information, productcontent, price, quantity, producticonpath, productpath, status, Verify, totalsold, ratingstar FROM Product JOIN Account ON Product.sellerid = Account.userid WHERE status LIKE '<span class="badge text-bg-success">Đã được duyệt</span>' AND (producttitle LIKE '%${keyword}%' OR productsubtitle LIKE '%${keyword}%' OR productcontent LIKE '%${keyword}%')`, (err, res) => {
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