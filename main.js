const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const axios = require("axios");

const port = 3000;

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.status(200);
    res.render("store");
});
app.get("/productpanagement", (req, res) => {
    res.status(200);
    res.render("productpanagement");
});
app.get("/censorproduct", (req, res) => {
    res.status(200);
    res.render("censorproduct");
});
app.get("/product", (req, res) => {
    res.status(200);
    res.render("store");
});
app.get("/product/:id", (req, res) => {
    res.status(200);
    axios.post('http://localhost:3000/API/getproductdata')
    .then(async response => {
      if (response.data.status) {
        if (response.data.data !== null) {
            let success = false;
            response.data.data.forEach(items => {
                if(items.productpath == req.params.id) {
                    success = true;
                    res.render("product", { productid: items.productid });
                }
            });
            if (!success) {
                res.render("404notfound");
            }
        }
        else {
            res.render("404notfound");
        }
      }
      else {
          res.render("404notfound");
      }
    })
    .catch(e => {
      console.error(e);
      res.render("404notfound");
    });
});

app.get("/404", (req, res) => {
    res.status(200);
    res.render("404notfound");
});

const registerAPIRoutes = require("./routes/register");
const authenticationAccountAPIRoutes = require("./routes/authentication");
const authenticationPermissionAPIRoutes = require("./routes/authenticationpermission");
const createProductAPIRoutes = require("./routes/createproduct");
const getAllProductDataAPIRoutes = require("./routes/getallproductdata");
const editProductAPIRoutes = require("./routes/editproduct");
const deleteProductAPIRoutes = require("./routes/deleteproduct");
const searchProductManagementAPIRoutes = require("./routes/searchproductmanagement");
const getPictureAPIRoutes = require("./routes/getpicture");
const chanageProductStatusAPIRoutes = require("./routes/chanageProductStatus");
const getProductDataAPIRoutes = require("./routes/getproductdata");
const getProductDataViewAPIRoutes = require("./routes/getproductdataview");

app.use('/API/register', registerAPIRoutes);
app.use('/API/authentication', authenticationAccountAPIRoutes);
app.use('/API/authenticationpermission', authenticationPermissionAPIRoutes);
app.use('/API/createroduct', createProductAPIRoutes);
app.use('/API/getallproductdata', getAllProductDataAPIRoutes);
app.use('/API/editproduct', editProductAPIRoutes);
app.use('/API/deleteproduct', deleteProductAPIRoutes);
app.use('/API/searchproductmanagement', searchProductManagementAPIRoutes);
app.use('/API/getpicture', getPictureAPIRoutes);
app.use('/API/chanageproductstatus', chanageProductStatusAPIRoutes);
app.use('/API/getproductdata', getProductDataAPIRoutes);
app.use('/API/getproductdataview', getProductDataViewAPIRoutes);

app.listen(port);