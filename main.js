const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

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

const registerAPIRoutes = require("./routes/register");
const authenticationAccountAPIRoutes = require("./routes/authentication");
const authenticationPermissionAPIRoutes = require("./routes/authenticationpermission");
const createProductAPIRoutes = require("./routes/createproduct");
const getAllProductDataAPIRoutes = require("./routes/getallproductdata");
const editProductAPIRoutes = require("./routes/editproduct");
const deleteProductAPIRoutes = require("./routes/deleteproduct");
const searchProductManagementAPIRoutes = require("./routes/searchproductmanagement");

app.use('/API/register', registerAPIRoutes);
app.use('/API/authentication', authenticationAccountAPIRoutes);
app.use('/API/authenticationpermission', authenticationPermissionAPIRoutes);
app.use('/API/createroduct', createProductAPIRoutes);
app.use('/API/getallproductdata', getAllProductDataAPIRoutes);
app.use('/API/editproduct', editProductAPIRoutes);
app.use('/API/deleteproduct', deleteProductAPIRoutes);
app.use('/API/searchproductmanagement', searchProductManagementAPIRoutes);

app.listen(port);