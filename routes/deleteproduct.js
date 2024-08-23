const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const axios = require("axios");
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const database = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "sa",
  password: "123456",
  database: "ProjectWebsite",
});

database.connect((err) => {
  if (err) throw err;
  console.log("API delete product successfully connected to the server");
});

const routes = express.Router();
routes.use(cors());
routes.use(express.json());
routes.use(bodyParser.urlencoded({ extended: true }));

routes.get("/", async (req, res) => {
    res.status(403).json( { message: "Bạn không có quyền truy cập vào ứng đường dẩn này" } );
});

routes.post("/", async (req, res) => {
  try {
    let { username, 
          password,
          productid,
    } = req.body;

    username = await normalizeString(username);
    password = await normalizeString(password);

    axios.post('http://localhost:3000/API/authenticationpermission', {
      username: username,
      password: password
  }, {
      headers: {
        'Content-Type': 'application/json'
      }
  })
  .then(async response => {
    if (response.data.status) {
      if (response.data.permission.acceptproductmanagement || response.data.permission.acceptproductmanagementall) {
        if (response.data.permission.acceptproductmanagementall) {
          // const picture_path = await GetPicturePath(productid);
          const success_delete_picture = await await DeletePicture(productid);
          const success_delete_product = await await DeleteProduct(productid);
          if (success_delete_picture && success_delete_product) {
            res.status(200).json({ status: true, message: `Đã xóa sản phẩm thành công!` });
          }
          else {
            res.status(200).json({ status: false, message: `Lỗi khi xóa sản phẩm` });
          }
        }
        else {
          const isAuthor = await CheckAuthor(response.data.userid, productid);
          if (isAuthor) {
            // const picture_path = await GetPicturePath(productid);
            const success_delete_picture = await DeletePicture(productid);
            const success_delete_product = await DeleteProduct(productid);
            if (success_delete_picture && success_delete_product) {
              res.status(200).json({ status: true, message: `Đã xóa sản phẩm thành công!` });
            }
            else {
              res.status(200).json({ status: false, message: `Lỗi khi xóa sản phẩm` });
            }
            }
          else {
            res.status(200).json({ status: false, message: `Bạn không có quyền thực hiện điều này` });
          }
        }
      }
      else {
        res.status(200).json({ status: false, message: "Bạn không có quyền thực hiện điều này" });
      }
    }
    else {
      res.status(200).json({ status: false, message: "Lỗi xác thực người dùng" });
    }
  })
  .catch(e => {
    console.error(e);
    res.status(200).json({ status: false, message: e.toString() });
  });
  }
  catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: e.toString() });
  }
});

function normalizeString(str) {
    return String(str)
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
  }

  async function GetPicturePath(productid) {
    try {
      const result = await database.query(`SELECT picturepath FROM Picture WHERE productid = ?`, 
        [ productid ]);
        return true;
    }
    catch (e) {
      return false;
    }
}

  async function DeletePicture(productid) {
    try {
      const result = await database.query(`DELETE FROM Picture WHERE productid = ?`, 
        [ productid ]);
        return true;
    }
    catch (e) {
      return false;
    }
}

  async function DeleteProduct(productid) {
    try {
      const result = await database.query(`DELETE FROM Product WHERE productid = ?`, 
        [ productid ]);
        return true;
    }
    catch (e) {
      return false;
    }
}

async function CheckAuthor(userid, productid) {
  try {
    const [results] = await database.query(
      `SELECT sellerid FROM Product WHERE productid = ?`, 
      [productid]
    );

    if (results.length > 0) {
      return results[0].sellerid === userid;
    } else {
      return false;
    }
  }
  catch (e) {
    return false;
  }
}

module.exports = routes;