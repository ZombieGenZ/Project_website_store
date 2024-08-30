const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const axios = require("axios");
const cors = require('cors');
const nodemailer = require('nodemailer');

const email = `your_email`;
const pass = `your_password`;

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

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
      user: email,
      pass: pass
  }
});



routes.post("/", async (req, res) => {
    let { to, subject, text, html } = req.body;
    
    try {
        if (to !== "" && to !== undefined && to !== null) {
            let info = await transporter.sendMail({
                from: `"GALAXY VIRUS TEAM" <${email}>`,
                to: `${to}`,
                subject: `${subject}`,
                text: `${text}`,
                html: `${html}`
            });
      
            res.status(200).json({ status: true, message: `Gửi email thành công!`, messageid: info.messageId });
        }
        else {
            res.status(200).json({ status: false, message: `Vui lòng điền đầy đủ thông tin!` });
        }
    } catch (error) {
        console.error(error);
        res.status(200).json({ status: false, message: `Gửi email thấy bại!`, message: error.toString(), messageid: null })
      }
});

module.exports = routes;