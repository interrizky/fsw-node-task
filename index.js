const express = require('express');
const app = express();
const port = 9702;

const fs = require('fs');
const path = require('path');
const formdata = require('form-data');

const multer = require('multer'); 
const upload = multer();

const morgan = require('morgan'); 
app.use(morgan('dev'));

app.listen(port, () => { console.log(`Server is running in port ${ port }`) })

// for parsing application/xwww- //form-urlencoded
app.use(express.urlencoded( {extended: true} ))
// for parsing application/json
app.use(express.json())
// for parsing multipart/form-data
app.use(upload.array()); 

// Setting Up FE display folder
app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine

// Reading CSS Folders & Files in Public Folder
app.use(express.static('public'))

//Routes Connection - MongoDB
const connMongoDB = require('./routers/db_conn')
connMongoDB();

// Router
const router = require('./routers/routes')
app.use(router);

//Upload Files to Mongo
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
// const upload = multer({ storage });
