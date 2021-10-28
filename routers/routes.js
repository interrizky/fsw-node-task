const express = require('express');
const routes = express.Router();

const multer = require('multer');
const fs = require('fs');
const path = require('path');

const {upload} = require('../helpers/file_helper');

const userController = require('../controllers/user_controller')
const productController = require('../controllers/product_controller')

// halaman pertama
routes.get('/homepage', userController.homepage);

// login as user
routes.post('/login-user', userController.loginUser);

// halaman login as user
routes.get('/dashboard-user', userController.dashboardUser);

// halaman add products as user
routes.get('/add-data', userController.addData);

// login as guest
routes.post('/login-guest', userController.loginGuest);

// halaman login as guest
routes.get('/dashboard-guest', userController.dashboardGuest);

// function post-save data product to desired destination "./uploads" and database
// customFile adalah selector field untuk upload
routes.post('/post-data', upload.single('customFile'), productController.postData);

// populate data to table (for user)
routes.get('/list-user-products', productController.listUserTable);

// delete datum from the table
routes.post('/delete-data/:param', productController.deleteData);

// get datum to edit
routes.get('/find-data/:param', productController.displayData);

// update data
// routes.post('/update-data', upload.single('customFile'), productController.updateData);
routes.post('/update-data', productController.updateData);

// populate search data to table
// routes.get('/search-data/:param', productController.searchDataTable);

// populate search data to table include pagination (guest)
routes.post('/search-data/:param', productController.searchDataTable);

// populate data to table (for guest)
routes.get('/list-guest-products', productController.listGuestTable);

// halaman registrasi
routes.get('/register', userController.viewRegister);
routes.post('/post-registration', userController.postRegistration);

// fetch data from pagination
// routes.post('/list-guest-alternative/:page', productController.fetchGuestTable);
routes.post('/fetchTablePage/:page', productController.fetchGuestTable)


/* trial */
routes.post('/dashboard-guest/outpost/:search/:page/', productController.testFunction)
routes.get('/dashboard-guest/outpost/:search/:page/', productController.testFunctionPage)


//Export to index.JS
module.exports = routes;