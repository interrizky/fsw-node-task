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

// function post-save data product to deired destination "./uploads"
// customFile adalah selector field untuk upload
routes.post('/post-data', upload.single('customFile'), productController.postData);

// router.get('/getSingleFiles', getallSingleFiles);

// function to populate data to tables
routes.get('/get-data', productController.getData);

// login as guest
routes.post('/login-guest', userController.loginGuest);

// halaman login as guest
routes.get('/dashboard-guest', userController.dashboardGuest);


//Export to index.JS
module.exports = routes;