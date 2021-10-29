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

exports.listGuestTable = async(request, response) => {
  
  productModel.find().sort( {_id: -1} ).exec()

  // const tradesCollection = await productModel.find().skip(offset).limit(limit)

  // const tradesCollectionCount = await productModel.count()

  // const totalPages = Math.ceil(tradesCollectionCount / limit)
  // const currentPage = Math.ceil(tradesCollectionCount % offset)
    // res.status(200).send({
    //   data: tradesCollection,
    //   paging: {
    //     total: tradesCollectionCount,
    //     page: currentPage,
    //     pages: totalPages,
    //   },  

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

exports.searchDataTable = async (request, response) => {
  let owner = request.headers.owner
  let param = request.params.param

  console.log(owner, param)

  let perPage = 4
  let page = request.params.page || 1

  if( owner == 'guest' ) {
    let options = [{'name': {$regex: '.*' + param.toString() + '.*'}}, {'desc': {$regex: '.*' + param.toString() + '.*'}}, {'price': {$regex: '.*' + param.toString() + '.*'}}, {'owner': {$regex: '.*' + param.toString() + '.*'}}];

    await productModel.find({ $or: options }).skip((perPage * page) - perPage).limit(perPage).exec(async function(err, products) {
      console.log(products)
      await productModel.count().exec(function(err, count) {
        if (err) return next(err)
        response.send({
          message: "Displaying Collections From Search",
          result: products,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })      
  } else {
    let tokenAuth = request.headers.authorization;

    // Check Token
    if( tokenAuth === undefined || tokenAuth === null || tokenAuth === '' ) {
      response.status(403).send( {message: 'failed to get data', status: 403} );
    } else {
      // Split the token type
      let newTokenAuth = tokenAuth.split(' ');
      // Check Token if it is Bearer
      if( newTokenAuth[0] != 'Bearer') {
        response.status(403).send( {message: 'failed to get data', status: 403} );
      } else {
        // Checking Token
        const token = jwt.verify(newTokenAuth[1], 'myPrivateKey', (error, result) => {
          if (error) return false; if (result) return result
        })
        // Decide if token = true or false
        if( !token ) {
          response.status(401).send( {message: 'failed to get token', status: 401} );
        } else {
          productModel.find({'owner': owner.toString(), $or: [
            {'name': {$regex: '.*' + param.toString() + '.*'}}, 
            {'desc': {$regex: '.*' + param.toString() + '.*'}}, 
            {'price': {$regex: '.*' + param.toString() + '.*'}}, 
            {'owner': {$regex: '.*' + param.toString() + '.*'}}
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
    }    
  }
}


exports.deleteData = (request, response) => {
  let tokenAuth = request.headers.authorization;

  // Check Token
  if( tokenAuth === undefined || tokenAuth === null || tokenAuth === '' ) {
    response.status(403).send( {message: 'failed to get data', status: 403} );
  } else {
    // Split the token type
    let newTokenAuth = tokenAuth.split(' ');
    // Check Token if it is Bearer
    if( newTokenAuth[0] != 'Bearer') {
      response.status(403).send( {message: 'failed to get data', status: 403} );
    } else {
      // Checking Token
      const token = jwt.verify(newTokenAuth[1], 'myPrivateKey', (error, result) => {
        if (error) return false; if (result) return result
      })
      // Decide if token = true or false
      if( !token ) {
        response.status(401).send( {message: 'failed to get token', status: 401} );
      } else {
        let param = request.params.param;

        productModel.deleteOne( { '_id': param } )
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
    }
  }  
}

exports.displayData = async (request, response) => {
  let param = await request.params.param;

  productModel.findOne({ '_id': param })
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

          // cari image di directory kemudian di-remove
          productModel.findOne({ '_id': datax._id })
          .then(response => {
            // console.log(response);

            // cara 1
            // let fileNameInDir = response.filePath.split('/');
            // fileNameInDir[0]; //uploads
            // fileNameInDir[1]; //nama file di dir
            // // console.log(fileNameInDir[0])
            // // console.log(fileNameInDir[1])

            // fs.readdir('uploads', (err, files) => {
            //   if (err) throw err;
            //   // baca semua files dalam directory 'uploads'
            //   for (const file of files) {
            //     // klo sama, di-delete
            //     if( file ==  fileNameInDir[1] ) {
            //       fs.unlink(path.join('uploads', file), err => {
            //         if (err) throw err;
            //       });
            //     }
            //   }
            // })
            
            //cara dua
            fs.unlink(response.filePath, err => {
              if (err) throw err;
            });            
          })
          .catch(error => {
            console.log(error);
          })

          // upload image baru ke directory
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

          productModel.updateOne({'_id': datax._id}, options)
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

exports.fetchGuestTable = async (request, response) => {
  let perPage = 4
  let page = request.params.page || 1
  let offset = (perPage * page) - perPage

  await productModel.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, products) {
        productModel.count().exec(function(err, count) {
            if (err) return next(err)

            // console.log("Total Data : "+count)
            // console.log("Page Saat Ini : "+page)
            // console.log("Page Akhir : "+Math.ceil(count / perPage))
            // console.log("Offset : "+offset)

            response.send({
              result: products,
              current: page,
              pages: Math.ceil(count / perPage),
              offset: offset
            })
        })
    })  
}

exports.testFunction = async (request, response) => {
  let perPage = 4
  // let page = request.params.page || 1

  let search = request.params.search;
  let page = request.params.page || 1 // Page 

  let offset = (perPage * page) - perPage

  let state = 'search'
  let source = 'dari post'

  // console.log(search)
  // console.log(page)

  let options = [{'name': {$regex: '.*' + search.toString() + '.*'}}, {'desc': {$regex: '.*' + search.toString() + '.*'}}, {'price': {$regex: '.*' + search.toString() + '.*'}}, {'owner': {$regex: '.*' + search.toString() + '.*'}}];

  await productModel.find({ $or: options })
  .skip((perPage * page) - perPage)
  .limit(perPage)
  .exec( function(err, products) {
    // console.log(products)

    productModel.find({ $or: options }).count().exec(function(err, count) {
      if (err) return next(err)

      // console.log("Total Data Hasil Search : "+count)
      // console.log("Page Saat Ini : "+page)
      // console.log("Page Akhir : "+Math.ceil(count / perPage))
      // console.log("Offset : "+offset)
      // console.log("Source : "+source)

      /* bisa balikin hasil */
      response.send({
        state: state,
        search: search,
        result: products,
        current: page,
        pages: Math.ceil(count / perPage),
        offset: offset,
        source: source    
      })            
    })
  })  
}

exports.testFunctionPage = (request, response) => {
  let perPage = 4
  // let page = request.params.page || 1

  let search = request.params.search;
  let page = request.params.page || 1 // Page 

  let offset = (perPage * page) - perPage

  let state = 'search'    
  let source = 'dari get'

  console.log(search)
  console.log(page)

  let options = [{'name': {$regex: '.*' + search.toString() + '.*'}}, {'desc': {$regex: '.*' + search.toString() + '.*'}}, {'price': {$regex: '.*' + search.toString() + '.*'}}, {'owner': {$regex: '.*' + search.toString() + '.*'}}];

  productModel.find({ $or: options }).skip((perPage * page) - perPage).limit(perPage).exec( function(err, products) {
    // console.log(products)

    productModel.find({ $or: options }).count().exec(function(err, count) {
      if (err) return next(err)

      console.log("Total Data Hasil Search : "+count)
      console.log("Page Saat Ini : "+page)
      console.log("Page Akhir : "+Math.ceil(count / perPage))
      console.log("Offset : "+offset)
      console.log("Source : "+source)

      response.render('guest', {
        state: state,
        search: search,
        result: products,
        current: page,
        pages: Math.ceil(count / perPage),
        offset: offset,
        source: source
      })
      
      // response.send({
      //   state: state,
      //   search: search,
      //   result: products,
      //   current: page,
      //   pages: Math.ceil(count / perPage),
      //   offset: offset,
      //   source: source
      // })   
    })
  })  
}