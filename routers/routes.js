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

/* ================================================================= */
/*                               GUEST                               */
/* ================================================================= */

// halaman pertama as guest
// query -> table (load semua data namun dibatasi perPage) - 
// pagination (dari query load manual ke ejs, lalu kasi onclick func di tiap button)
// onsite url (tidak berubah)
routes.get('/dashboard-guest', userController.dashboardGuest);
// fetch data ke tabel dari onclick pagination yang disetup dari query awal
routes.post('/fetchTablePage/:page', productController.fetchGuestTable)

// trial
// routes.post('/dashboard-guest/:search/:page/', userController.dashboardGuest)
// routes.get('/dashboard-guest/:search/:page/', productController.testFunctionPage)

/* sukses */
// load searching = table & pagination
routes.post('/dashboard-guest/outpost/:search/:page/', productController.testFunction)
// pagination client side func
routes.get('/dashboard-guest/:search/:page/', productController.testFunctionPage)
// routes.post('/dashboard-guest/:search/:page/', productController.testFunctionPage)

routes.post('/logout', userController.logout);

//Export to index.JS
module.exports = routes;