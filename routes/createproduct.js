const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const axios = require("axios");
const cors = require('cors');
const path = require('path');
const multer = require("multer");
const { Console } = require("console");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image/upload/product');
  },
  filename: function (req, file, cb) {
   const uniquSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
   cb(null, file.fieldname + '-' + uniquSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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

routes.post("/", upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'picture', maxCount: 100 }
]), async (req, res) => {
  try {
    let { username, 
          password,
          productname,
          productsubtitle,
          productdescription,
          productprice,
          productquantity,
          productinformation
    } = req.body;
    let { icon, 
          picture
    } = req.files;

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
    console.log(response);
    if (response.data.status) {
      if (productname === "" || productsubtitle === "" || productdescription === "" || productprice === ""  || productquantity === "" || productinformation === "" || productinformation === undefined || productinformation == "[]" || icon === undefined || picture === undefined) {
        res.status(200).json({ status: false, message: "Bạn cần điền đầy đủ thông tin" });
        return;
      }
      else {
        const productInfo = JSON.parse(productinformation);
        if (Number(productprice) < 1000) {
            res.status(200).json({ status: false, message: `Giá sản phẩm phải lớn hơn ${Number(1000).toLocaleString('de-DE')}đ` });
            return;
          }
          else {
            if (Number(productquantity) < 1) {
              res.status(200).json({ status: false, message: `Số lượng sản phẩm phải lớn hơn ${Number(1).toLocaleString('de-DE')}` });
              return;
            }
            else {
                let productdescriptionHTML = await parseMarkup(productdescription.replace("\n", "<br>"));
                let productinformationHTML = "";
                for (const items of productInfo) {
                    const { title, value } = items;
                    const HTML = `<div class="main-right-header-content-center-center-center-items"><div class="main-right-header-content-center-center-center-items-left"><h class="overflow-1">${title}</h></div><div class="main-right-header-content-center-center-center-items-right"><p class="overflow-1">${value}</p></div></div>`;
                    productinformationHTML += HTML; 
                }
                const productpath = productname.replace(" ", "-") + "-" + String(Math.round(Math.random() * 1e9));
                // console.log(response.data.userid, productname, productsubtitle, productdescriptionHTML, productdescriptionHTML, productprice, productquantity, icon.path, productpath);
                // console.log(req.files.icon[0].path);
                const success = await CreateProduct(response.data.userid, productname, productsubtitle, productinformationHTML, productdescriptionHTML, productprice, productquantity, req.files.icon[0].path, productpath);
                if (success) {
                  res.status(200).json({ status: true, message: `Đã tạo sản phẩm thành công! Sản phẩm đã được gửi đến quản trị viên chờ duyệt` });
                }
                else {
                  res.status(200).json({ status: false, message: `Lỗi khi tạo sản phẩm` });
                }
            }
        }
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

  async function CreateProduct(sellerid, producttitle, productsubtitle, productinformation, productcontent, productprice, productquantity, producticonpath, productpath) {
    const result = database.query(`INSERT INTO Product (sellerid, producttitle, productsubtitle, information, productcontent, price, quantity, producticonpath, productpath, status) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [sellerid, producttitle, productsubtitle, productinformation, productcontent, productprice, productquantity, producticonpath, productpath, "Đang chờ duyệt"]);
    if (result.rowsAffected > 0 || result.changedRows > 0) {
      return true;
    }
    return false;
}

function parseMarkup(text) {
  const tags = {
    header: content => `<h4>${content}</h4>`,
    subheader: content => `<h5>${content}</h5>`,
    list: content => `<li>${content}</li>`,
    red: content => `<span class="red">${content}</span>`,
    green: content => `<span class="green">${content}</span>`,
    blue: content => `<span class="blue">${content}</span>`,
    aqua: content => `<span class="aqua">${content}</span>`,
    pink: content => `<span class="pink">${content}</span>`,
    yellow: content => `<span class="yellow">${content}</span>`,
    black: content => `<span class="black">${content}</span>`,
  };

  function processNestedTags(input) {
    const regex = /\[(\w+)\]((?:[^\[\]]|\[(?:(?!\]).)*\])*)(?=\[\w+\]|\s*$)/g;
    return input.replace(regex, (match, tag, content) => {
      if (tags[tag]) {
        return tags[tag](processNestedTags(content));
      }
      return match;
    });
  }

  return processNestedTags(text);
}

module.exports = routes;