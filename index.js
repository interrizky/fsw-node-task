const express = require('express');
const app = express();
const port = 9702;

const morgan = require('morgan'); 
app.use(morgan('dev'));

app.listen(port, () => { console.log(`Server is running in port ${ port }`) })

app.use(express.urlencoded( {extended: true} ))
app.use(express.json())

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
