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
    console.log("API register successfully connected to the server");
});

const routes = express.Router();
routes.use(cors());
routes.use(express.json());
routes.use(bodyParser.urlencoded({ extended: true }));

routes.get("/", async (req, res) => {
    res.status(403).json( { message: "Bạn không có quyền truy cập vào đường dẩn này" } );
});

routes.post("/", async (req, res) => {
    let { username, email, password, comfirmpassword } = req.body;
    username = await normalizeString(username);
    email = await normalizeString_Email(email);
    password = await normalizeString(password);
    comfirmpassword = await normalizeString(comfirmpassword);
    try {
        if (username === "" || email === "" || password === "" || comfirmpassword === "") {
            res.status(200).json( { status: false, message: "Cần điền đầy đủ thông tin" } );
        }
        else {
            if (username.length < 4 || username.length > 20) {
                res.status(200).json( { status: false, message: "Tên người dùng chỉ có thể dài từ 4 đến 20 ký tự" } );
            }
            else {
                const accpetUsername = checkAlphanumericAccept(username);
                if (accpetUsername === false) {
                    res.status(200).json( { status: false, message: "Trong tên người dùng không được có ký tự đặt biệt" } );
                }
                else {
                    const isEmail = checkEmailAccept(email);
                    if (!isEmail) {
                        res.status(200).json( { status: false, message: "Địa chỉ email không hợp lệ" } );
                    }
                    else {
                        if (password !== comfirmpassword) {
                            res.status(200).json( { status: false, message: "Hai mật khẩu không khớp nhau" } );
                        }
                        else {
                            if (password.length < 8 || password.length > 50) {
                                res.status(200).json( { status: false, message: "Mật khẩu chỉ có thể dài từ 8 đến 50 ký tự" } );
                            }
                            else {
                                const existUsername = await CheckUsername(username);
                                const existEmail = await CheckEmail(email);
                                if (existUsername || existEmail) {
                                    const error = [];
                                    if (existUsername) {
                                        error.push("Tên người dùng");
                                    }
                                    if (existEmail) {
                                        error.push("Địa chỉ email");
                                    }
                                    const message = `${error.join(" và ")} đã tồn tại`;
                                    res.status(200).json({ status: false, message: message });
                                }
                                else {
                                    const succeeded = await CreateAccount(username, email, password);
                                    if (!succeeded) {
                                        res.status(200).json({ status: true, message: "Bạn đã đăng ký tài khoản thành công!", username: username, password: password });
                                    }
                                    else {
                                        res.status(200).json( { status: false, message: "Không thể thêm người dùng này" } );
                                    }
                                }
                            }
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error(e);
            res.status(200).json({ status: false, message: e.toString() });
        }
});

async function CheckUsername(username) {
  return new Promise((resolve, reject) => {
    database.query(`SELECT * FROM Account WHERE username = ?`, [username], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.length > 0);
      }
    });
  });
}

async function CheckEmail(email) {
  return new Promise((resolve, reject) => {
    database.query(`SELECT * FROM Account WHERE email = ?`, [email], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.length > 0);
      }
    });
  });
}

async function CreateAccount(username, email, password) {
    const result = database.query(`INSERT INTO Account (username, email, password) VALUE (?, ?, ?)`, [username, email, password]);
    if (result.rowsAffected > 0 || result.changedRows > 0) {
      return true;
    }
    return false;
}

function checkEmailAccept(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function checkAlphanumericAccept(str) {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(str);
}
function normalizeString(str) {
    return String(str)
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
  }
  function normalizeString_Email(str) {
    return String(str)
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();
  }
module.exports = routes;