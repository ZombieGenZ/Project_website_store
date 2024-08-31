const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const routes = express.Router();
routes.use(cors());
routes.use(express.json());
routes.use(bodyParser.urlencoded({ extended: true }));



routes.post("/", async (req, res) => {
    const BANK_ID = "YOUR_BANK_ID";
    const ACCOUNT_NO = "YOUR_ACCOUNT_NO";
    const TEMPLATE = "YOUR_TEMPLATE";
    const DESCRIPTION = "YOUR_DESCRIPTION";
    const ACCOUNT_NAME = "YOUR_ACCOUNT_NAME";

    let { amount } = req.body;
    try {
      if (!isNaN(Number(amount))) {
        if (Number(amount) > 0) {
          const url = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${DESCRIPTION}&accountName=${ACCOUNT_NAME}`;
          res.status(200).json({ status: true, url: url });
        }
        else {
          res.status(200).json({ status: false, url: null, message: "Số tiền phải lớn hơn 0 và không được lớn hơn 13 chử số" });
        }
      }
      else {
        res.status(200).json({ status: false, url: null, message: "Số tiền phải là số" });
      }
    }
    catch (e) {
      res.status(200).json({ status: false, url: null, message: e.toString() });
    }
});

module.exports = routes;