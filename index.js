const express = require('express');
const app = express();
const port = 9702;

const formdata = require('form-data');

const path = require('path');
const cors = require('cors');

const multer = require('multer');

const {upload} = require('./helpers/file_helper');

const morgan = require('morgan'); 
app.use(morgan('dev'));

app.listen(port, () => { console.log(`Server is running in port ${ port }`) })

// for parsing application/xwww- //form-urlencoded
app.use(express.urlencoded( {extended: true} ))
// for parsing application/json
app.use(express.json())
// for parsing multipart/form-data
// app.use(upload.array()); 

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setting Up FE display folder
app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine

// Reading Folders & Files in Public Folder
app.use(express.static('public'))

//Routes Connection - MongoDB
const connMongoDB = require('./routers/db_conn')
connMongoDB();

// Router
const router = require('./routers/routes')
app.use(router);