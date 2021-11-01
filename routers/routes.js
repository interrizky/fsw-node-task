const express = require('express');
const routes = express.Router();

const multer = require('multer');
const fs = require('fs');
const path = require('path');

const {upload} = require('../helpers/file_helper');

const userController = require('../controllers/user_controller')
const productController = require('../controllers/product_controller')
const quizController = require('../controllers/quiz_controller')

/* ================================================================= */
/*                               LOGIN                               */
/* ================================================================= */
// halaman pertama
routes.get('/homepage', userController.homepage);
// func send login as user
routes.post('/login-user', userController.loginUser);
// func send login as guest
routes.post('/login-guest', userController.loginGuest);
/* ================================================================= */
/*                            REGISTRATION                           */
/* ================================================================= */
// halaman registrasi
routes.get('/register', userController.viewRegister);
// func send data registrasi
routes.post('/post-registration', userController.postRegistration);
/* ================================================================= */
/*                                USER                               */
/* ================================================================= */
// halaman AWAL  user
routes.get('/dashboard-user', userController.dashboardUser);
// halaman add products as user
routes.get('/add-data', userController.addData);
// function post-save data product to desired destination "./uploads" and database
// customFile adalah selector field untuk upload
routes.post('/post-data', upload.single('customFile'), productController.postData);
// delete datum from the table
routes.post('/delete-data/:param', productController.deleteData);
// get datum to edit
routes.get('/find-data/:param', productController.displayData);
// update data
// routes.post('/update-data', upload.single('customFile'), productController.updateData);
routes.post('/update-data', productController.updateData);
// populate data to table (1st time)
routes.get('/list-user-products/:search', productController.listUserTable);
// fetch data ke tabel dari onclick pagination yang disetup dari query
routes.post('/fetchTableUser/:page/:search', productController.fetchUserTable)
/* ================================================================= */
/*                               GUEST                               */
/* ================================================================= */

// halaman pertama as guest
// query -> table (load semua data namun dibatasi perPage) - 
// pagination (dari query load manual ke ejs, lalu kasi onclick func di tiap button)
// onsite url (tidak berubah)
routes.get('/dashboard-guest', userController.dashboardGuest);
// populate data to table (1st time)
routes.get('/list-guest-products/:search', productController.listGuestTable);
// fetch data ke tabel dari onclick pagination yang disetup dari query
routes.post('/fetchTableGuest/:page/:search', productController.fetchGuestTable)


// fetch data ke tabel dari onclick pagination yang disetup dari query awal
routes.post('/fetchTablePage/:page', productController.fetchGuestTable)

// trial
// routes.post('/dashboard-guest/:search/:page/', userController.dashboardGuest)
// routes.get('/dashboard-guest/:search/:page/', productController.testFunctionPage)

// populate search data to table include pagination (guest) -- gakdipake
routes.post('/search-data/:param', productController.searchDataTable);

// populate data to table (for guest) -- datatable
routes.get('/list-guest-products', productController.listGuestTable);

/* sukses */
// load searching = table & pagination
routes.post('/dashboard-guest/outpost/:search/:page/', productController.testFunction)
// pagination client side func
routes.get('/dashboard-guest/:search/:page/', productController.testFunctionPage)
// routes.post('/dashboard-guest/:search/:page/', productController.testFunctionPage)

/* ================================================================= */
/*                          DATATABLES                               */
/* ================================================================= */
// penggunaan datatables
routes.post('/datatables-x', productController.datatables);

/* ================================================================= */
/*                             QUIZ                                  */
/* ================================================================= */
// menampilkan halaman
routes.get('/quiz-dashboard', quizController.quizDashboard);
routes.get('/quiz-add-form', quizController.form);
routes.get('/quiz-edit-form/:_id', quizController.formEdit);
// post data to table
routes.get('/fetch', quizController.fetch);
// send data to dbase
routes.post('/quiz-post-form', quizController.create);
routes.post('/quiz-post-edit', quizController.edit)
// delete data
routes.post('/quiz-delete-data', quizController.delete)

//Export to index.JS
module.exports = routes;