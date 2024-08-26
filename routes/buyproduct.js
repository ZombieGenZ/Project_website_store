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
    console.log("API buy product successfully connected to the server");
});

const routes = express.Router();
routes.use(cors());
routes.use(express.json());
routes.use(bodyParser.urlencoded({ extended: true }));

routes.get("/", async (req, res) => {
    res.status(403).json( { message: "Bạn không có quyền truy cập vào đường dẩn này" } );
});

routes.post("/", async (req, res) => {
    let { username, password, productid, quantity } = req.body;
    username = await normalizeString(username);
    password = await normalizeString(password);

    try {
        if (quantity > 0) {
          axios.post('http://localhost:3000/API/authenticationpermission', {
            username: username,
            password: password
        }, {
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(async responseUser => {
          if (responseUser.data.status) {
                axios.post('http://localhost:3000/API/getproductdata')
                .then(async responseProduct => {
                  if (responseProduct.data.status) {
                    let success = false;
                    responseProduct.data.data.forEach(async items => {
                        if(items.productid == productid) {
                          const totalPrice = (quantity * items.price);
                          if (responseUser.data.money >= totalPrice) {
                            if ((items.quantity - quantity) >= 0) {
                              const VAT = 15 / 100; // 15%
                              const totalRevenue = totalPrice - (totalPrice * VAT);
                              const success = await CreatePurchaseHistory(responseUser.data.userid, items.productid, totalPrice, quantity);
                              const success_updatemoney = await UpdateUserMoney(responseUser.data.userid, totalPrice);
                              const success_updateproduct = await UpdateProductData(productid, quantity);
                              const success_updaterevenue = await UpdateUserRevenue(totalRevenue, items.sellerid);
                              if (success && success_updatemoney && success_updateproduct && success_updaterevenue) {
                                res.status(200).json({ status: true, message: "Mua sản phẩm thành công!" });
                                return;
                              }
                              else {
                                res.status(200).json({ status: false, message: "Lỗi khi mua sản phẩm!" });
                                return;
                              }
                            }
                            else {
                              res.status(200).json({ status: false, message: "Số lượng sản phẩm còn lại không đủ!" });
                            }
                          }
                          else {
                            res.status(200).json({ status: false, message: "Số dư không đủ" });
                            return;
                          }
                        }
                    });
                  }
                  else {
                      res.status(200).json({ status: false, message: "Không thể tìm thấy sản phẩm được chỉ định" });
                  }
                })
                .catch(e => {
                  console.error(e);
                  res.status(200).json({ status: false, message: "Lỗi khi lấy dử liệu sản phẩm" });
                });
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
        else {
          res.status(200).json({ status: false, message: "Số lượng phải lớn hơn 0" });
        }
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

async function CreatePurchaseHistory(userid, productid, totalprice, totalquantity) {
  try {
    const result = await database.query(`INSERT INTO PurchaseHistory (userid, productid, totalprice, totalquantity) VALUE (?, ?, ?, ?)`, 
      [userid, productid, totalprice, totalquantity]);
      return true;
  }
  catch (e) {
    return false;
  }
}

async function UpdateProductData(productid, quantity) {
  try {
    const result = await database.query(`UPDATE Product SET quantity = quantity - ?, totalsold = totalsold + ? WHERE productid = ?`, 
      [quantity, quantity, productid]);
      return true;
  }
  catch (e) {
    console.error(e);
    return false;
  }
}

async function UpdateUserMoney(userid, total) {
  try {
    const result = await database.query(`UPDATE Account SET money = money - ? WHERE userid = ?`, 
      [total, userid]);
      return true;
  }
  catch (e) {
    return false;
  }
}

async function UpdateUserRevenue(total, userid) {
  try {
    const result = await database.query(`UPDATE Account SET revenue = revenue + ? WHERE userid = ?`, 
      [total, userid]);
      return true;
  }
  catch (e) {
    return false;
  }
}

module.exports = routes;