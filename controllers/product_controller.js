const productModel = require('../models/product_model');
const jwt = require('jsonwebtoken');

exports.postData = (request, response) => {
  console.log(request.body);
  console.log(request.body.product);
  console.log(request.body.price);
  console.log(request.body.quantity);
  console.log(request.body.customFile);
  console.log(request.body.owner);
  console.log(request.body.description);

    // for(var pair of request.body.entries()) {
    //   console.log(pair[0]+', '+pair[1]);
    // }  

  // let obj = {
  //   name: request.body.name,
  //   price: request.body.price,
  //   quantity: request.body.quantity,
  //   desc: request.body.desc,
  //   owner: request.body.owner,
  //   img: {
  //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + request.file.filename)),
  //     contentType: 'image/png'
  //   }
  // }

  // productModel.create(obj, (err, item) => {
  //     if (err) { 
  //       console.log(err); 
  //     } else { 
  //       response.redirect('/add-data'); 
  //       // atau response.send();
  //     }
  // })
}

exports.getData = (request, response) => {
  console.log(request);
}