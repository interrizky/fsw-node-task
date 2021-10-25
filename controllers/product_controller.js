const productModel = require('../models/product_model');

const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

exports.postData = async(request, response) => {
  console.log(request)
  console.log(request.body);

  try {
    // const file = new SingleFile({
    //     fileName: req.file.originalname,
    //     filePath: req.file.path,
    //     fileType: req.file.mimetype,
    //     fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
    // });
    // await file.save();
    const file = request.file;
    console.log(file);
    response.status(201).send('File Uploaded Successfully');
  } catch {
    response.status(400).send(error.message);
  }
}

exports.getData = (request, response) => {
  console.log(request);
}