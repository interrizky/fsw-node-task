const productModel = require('../models/product_model');

const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

exports.postData = async(request, response) => {
  try {
    const dataOptions = new productModel({
        name: request.body.product,
        price: request.body.price,
        quantity: request.body.quantity,
        desc: request.body.description,
        owner: request.body.owner,      
        fileName: request.file.originalname,
        filePath: request.file.path,
        fileType: request.file.mimetype,
        fileSize: fileSizeFormatter(request.file.size, 2) // 0.00
    });
    // const file = request.file;
    // console.log(file);    
    const posting = await dataOptions.save();
    if( posting !== null || posting === undefined ) {
      // response.status(201).send({ message: 'File Uploaded Successfully', result: dataOptions});
      response.status(201).render('new-form', {message: 'File Uploaded Successfully', result: dataOptions});
    }
  } catch {
    response.status(400).send(error.message);
  }
}

const fileSizeFormatter = (bytes, decimal) => {
    if(bytes === 0){
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
}

exports.listUserTable = (request, response) => {
  productModel.find({ owner: request.headers.owner.toString() }).sort( {_id: -1} ).exec()
    .then(resp => {
    response.send({
      message: "Displaying Current Collections From MongoDB",
      result: resp
    })
    })
    .catch(err => {
    response.send({
      message: "Failed To Read Data",
      result: err
    })
  })
}

exports.listGuestTable = (request, response) => {
  productModel.find().sort( {_id: -1} ).exec()
    .then(resp => {
    response.send({
      message: "Displaying Current Collections From MongoDB",
      result: resp
    })
    })
    .catch(err => {
    response.send({
      message: "Failed To Read Data",
      result: err
    })
  })
}

exports.searchDataTable = (request, response) => {
  let owner = request.headers.owner
  let param = request.params.param

  console.log(owner, param)

  if( owner == 'guest' || owner == "guest" ) {
    productModel.find({ $or: [
      {name: {$regex: '.*' + param.toString() + '.*'}}, 
      {desc: {$regex: '.*' + param.toString() + '.*'}}, 
      {price: {$regex: '.*' + param.toString() + '.*'}}, 
      {owner: {$regex: '.*' + param.toString() + '.*'}}
    ]}).exec()
    .then(resp => {
      response.send({
        message: "Displaying Current Collections From MongoDB",
        result: resp
      })
    }).catch(err => {
      response.send({
        message: "Failed To Read Data",
        result: err
      })
    })
  } else {
    productModel.find({owner: owner.toString(), $or: [
      {name: {$regex: '.*' + param.toString() + '.*'}}, 
      {desc: {$regex: '.*' + param.toString() + '.*'}}, 
      {price: {$regex: '.*' + param.toString() + '.*'}}, 
      {owner: {$regex: '.*' + param.toString() + '.*'}}
    ]}).exec()
    .then(resp => {
      response.send({
        message: "Displaying Current Collections From MongoDB",
        result: resp
      })
    }).catch(err => {
      response.send({
        message: "Failed To Read Data",
        result: err
      })
    })    
  }
}

exports.deleteData = (request, response) => {
  let param = request.params.param;
  // console.log(_id);
  // console.log('Bearer ? '+newTokenAuth[0]);
  // console.log('Token ? ' +newTokenAuth[1]);

  productModel.deleteOne( { _id: param } )
  .then(resp => {
    response.send({
      message: "Delete Success",
      result: param
    })
  })
  .catch(err => {
    response.send({
      message: "Failed to Delete Data",
      result: err
    })
  })   
}

exports.displayData = async (request, response) => {
  let param = await request.params.param;

  productModel.findOne({ _id: param })
  .then(resp => {
    let options = {
      _id:JSON.stringify(resp._id),
      owner:JSON.stringify(resp.owner),
      name:JSON.stringify(resp.name),
      price:JSON.stringify(resp.price),
      quantity:JSON.stringify(resp.quantity),
      desc:JSON.stringify(resp.desc),
      fileName: JSON.stringify(resp.originalname),
      filePath: JSON.stringify(resp.path),
      fileType: JSON.stringify(resp.mimetype),
      fileSize: fileSizeFormatter(JSON.stringify(resp.size, 2)) // 0.00
    } 
    response.render('edit-form', {message: '', options: options})
  })
  .catch(err => {
    response.send({
      message: "Failed to read data to edit",
      result: err
    })
  })
}

exports.updateData = (req, res) => {
  /* file upload helpers */
  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, 'uploads');
      },
      filename: (req, file, cb) => {
          cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
      }
  });

  const filefilter = (req, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
          cb(null, true);
      } else {
          cb(null, false);
      }
  }

  const upload = multer({ storage: storage, fileFilter: filefilter }).any();
  /* file upload helpers */

  // console.log(request);
  // upload.single('customFile');

  upload(req, res, function(err) {
      if (err) {
          console.log(err);
          return res.end('Error');
      } else {
        // isian aja ga pake update image
        if( req.files[0] == undefined ) {
          console.log('isian aja')
          // console.log(req);
          console.log(req.body);

          let datax = req.body;
          
          let options = {
            name: datax.product,
            price: datax.price,
            quantity: datax.quantity,
            desc: datax.description,
            owner: datax.owner,      
          }

          productModel.updateOne({_id: datax._id}, options)
          .then(resp => {
            res.render('edit-form',  { message: "Update Success", options: resp })
          })
          .catch(err => {
            res.send({
              message: "failed to update data",
              result: err
            })
          })
        } else {
          console.log('isian & image')
          // console.log(req);
          console.log(req.body);
          console.log(req.files[0]);

          let datax = req.body;
          let filex = req.files[0];

          let options = {
            name: datax.product,
            price: datax.price,
            quantity: datax.quantity,
            desc: datax.description,
            owner: datax.owner,      
            fileName: filex.originalname,
            filePath: filex.path,
            fileType: filex.mimetype,
            fileSize: fileSizeFormatter(filex.size, 2) // 0.00
          }

          productModel.updateOne({_id: datax._id}, options)
          .then(resp => {
            res.render('edit-form',  { message: "Update Success", options: resp })
          })
          .catch(err => {
            res.send({
              message: "failed to update data",
              result: err
            })
          })
        }
      }
  });  
}