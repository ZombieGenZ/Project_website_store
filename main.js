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
                if(items.productpath == req.params.id || items.productid == req.params.id) {
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
app.get("/purchasedproducts", (req, res) => {
    res.status(200);
    res.render("purchasedproducts");
});
app.get("/shoppingcart", (req, res) => {
    res.status(200);
    res.render("cart");
});
app.get("/profile", (req, res) => {
    res.status(200);
    res.render("profileme");
});
app.get("/profile/:id", (req, res) => {
    res.status(200);
    axios.post('http://localhost:3000/API/getalluserdata')
    .then(async response => {
      if (response.data.status) {
        if (response.data.data !== null) {
            let success = false;
            response.data.data.forEach(items => {
                console.log(items);
                if(items.userid == req.params.id || items.username == req.params.id) {
                    console.log(items.userid);
                    success = true;
                    res.render("profile", { userid: items.userid });
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
app.get("/accountmanagement", (req, res) => {
    res.status(200);
    res.render("accountpanagement");
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
const buyProductAPIRoutes = require("./routes/buyproduct");
const checkBuyAPIRoutes = require("./routes/checkbuy");
const checkEvaluateAPIRoutes = require("./routes/checkevaluate");
const createEvaluateAPIRoutes = require("./routes/createevaluate");
const getEvaluateDataAPIRoutes = require("./routes/getevaluatedata");
const editEvaluateAPIRoutes = require("./routes/editevaluate");
const deleteEvaluateAPIRoutes = require("./routes/deleteevaluate");
const addToCartAPIRoutes = require("./routes/addtocart");
const getPurchaseHistoryDataAPIRoutes = require("./routes/getpurchasehistorydata");
const searchPurchaseHistoryDataAPIRoutes = require("./routes/searchpurchasehistorydata");
const getCartDataAPIRoutes = require("./routes/getcartdata");
const searchCartDataAPIRoutes = require("./routes/searchcartdata");
const buyProductCartAPIRoutes = require("./routes/buyproductcart");
const SearchProductDataAPIRoutes = require("./routes/searchproductdata");
const getUserAPIRoutes = require("./routes/getuser");
const getUserDataAPIRoutes = require("./routes/getuserdata");
const chanageAvatarAPIRoutes = require("./routes/chanageAvatar");
const chanageUsernameAPIRoutes = require("./routes/chanageusername");
const chanageEmailAPIRoutes = require("./routes/chanageemail");
const chanagePasswordAPIRoutes = require("./routes/chanagepassword");
const chanageBioAPIRoutes = require("./routes/chanagebio");
const getAllUserDataAPIRoutes = require("./routes/getalluserdata");
const getUserDataNonAccountAPIRoutes = require("./routes/getuserdatanonaccount");
const getAllAccountDataAPIRoutes = require("./routes/getallaccountdata");

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
app.use('/API/buyproduct', buyProductAPIRoutes);
app.use('/API/checkbuy', checkBuyAPIRoutes);
app.use('/API/checkevaluate', checkEvaluateAPIRoutes);
app.use('/API/createevaluate', createEvaluateAPIRoutes);
app.use('/API/getevaluatedata', getEvaluateDataAPIRoutes);
app.use('/API/editevaluate', editEvaluateAPIRoutes);
app.use('/API/deleteevaluate', deleteEvaluateAPIRoutes);
app.use('/API/addtocart', addToCartAPIRoutes);
app.use('/API/getpurchasehistorydata', getPurchaseHistoryDataAPIRoutes);
app.use('/API/searchpurchasehistorydata', searchPurchaseHistoryDataAPIRoutes);
app.use('/API/getcartdata', getCartDataAPIRoutes);
app.use('/API/searchcartdata', searchCartDataAPIRoutes);
app.use('/API/buyproductcart', buyProductCartAPIRoutes);
app.use('/API/searchproductdata', SearchProductDataAPIRoutes);
app.use('/API/getuser', getUserAPIRoutes);
app.use('/API/getuserdata', getUserDataAPIRoutes);
app.use('/API/chanageavatar', chanageAvatarAPIRoutes);
app.use('/API/chanageusername', chanageUsernameAPIRoutes);
app.use('/API/chanageemail', chanageEmailAPIRoutes);
app.use('/API/chanagepassword', chanagePasswordAPIRoutes);
app.use('/API/chanagebio', chanageBioAPIRoutes);
app.use('/API/getalluserdata', getAllUserDataAPIRoutes);
app.use('/API/getuserdatanonaccount', getUserDataNonAccountAPIRoutes);
app.use('/API/getallaccountdata', getAllAccountDataAPIRoutes);

app.use((req, res, next) => {
    res.status(404).render("404notfound");
});

app.listen(port);