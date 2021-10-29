const userModel = require('../models/user_model');
const productModel = require('../models/product_model');

const jwt = require('jsonwebtoken');

exports.homepage = (request, response) => {
  response.render('login')
}

exports.loginUser = async(request, response) => {
  let uname = request.body.username;
  let pass = request.body.password;

  //if - else checking input
  if( uname === '' || pass === '' || uname === null || pass === null ) {
    response.status(404).send( {
      message: "Hey, Invalid username or password",
      result: "Hey, Invalid username or password"
    } )
  } else {
    const userData = await userModel.findOne( {'username': uname, 'password': pass} ).exec()

    console.log(userData)

    if( userData === null || userData === 'undefined' ) {
      response.status(404).send({
        message: "Hey, Invalid username or password",
        result: "Hey, Invalid username or password"
      })      
    } else {
      let token = jwt.sign( {
        username: userData.username,
        email: userData.email,
      }, 'myPrivateKey' );

      let passingData = {
        uid: userData._id,
        username: userData.username,
        email: userData.email,
        age: userData.age,
        address: userData.address,
        token: token,
        token_type: 'Bearer'
      }

      response.status(200).send({
        message: "Login Accepted",
        result: passingData
      })
    }
  }
}

exports.dashboardUser = (request, response) => {
  response.render('user', {message: ""});
}

exports.loginGuest = async(request, response) => {
  let uname = request.body.username;
  let pass = request.body.password;

  console.log(uname, pass);

  //if - else checking input
  if( uname === "guest" && pass === "guest" ) {
      let token = jwt.sign( {
        username: uname
      }, 'myPrivateGuestKey' );

      let passingData = {
        username: uname,
        token: token,
        token_type: 'Bearer'
      }

      response.status(200).send({
        message: "Login Accepted",
        result: passingData
      })
  } else {
    response.status(404).send({
      message: "Hey, Invalid username or password",
      result: "Hey, Invalid username or password"
    })
  }
}

exports.dashboardGuest = async(request, response) => {
  // Here is way to calculate:

  // limit = size
  // offset = page * size
  // Notice that we start counting from page 0.

  // For example, if we want get page number 5 (page=5) and on each page there is 8 records (size=8), the calculations will look like this:

  // limit = size = 8
  // offset = page * size = 5 * 8 = 40
  console.log(request)

  let perPage = 4
  // let search = request.params.search || null
  // let page = request.params.page || 1
  let search = request.body.search || null
  let page = request.body.page || 1  
  // let offset = 0;
  let offset = (perPage * page) - perPage  

  try {
    if( search == null || search == undefined ) {
      let state = 'dashboard'    
      let source = 'dari awal dashboard'  

      console.log(state)
      console.log(source)

      await productModel.find({}).skip((perPage * page) - perPage).limit(perPage).exec(async function(err, products) {

        await productModel.count().exec(function(err, count) {
          if (err) return next(err)

          response.render('guest', {
            state: state,
            search:'',
            result: products,
            current: page,
            pages: Math.ceil(count / perPage),
            offset: offset,
            source: source        
          })
        })
      })
    } else {
      let state = 'search'
      let source = 'dari post'

      console.log(request)
      console.log(state)
      console.log(source)

      let options = [{'name': {$regex: '.*' + search.toString() + '.*'}}, {'desc': {$regex: '.*' + search.toString() + '.*'}}, {'price': {$regex: '.*' + search.toString() + '.*'}}, {'owner': {$regex: '.*' + search.toString() + '.*'}}];

      await productModel.find({ $or: options })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec( function(err, products) {
        // console.log(products)

        productModel.find({ $or: options }).count().exec(function(err, count) {
          if (err) return next(err)

          // response.render('guest', {
          //   state: state,
          //   search: search,
          //   result: products,
          //   current: page,
          //   pages: Math.ceil(count / perPage),
          //   offset: offset,
          //   source: source    
          // })            
          response.status(200).render('guest', {
            state: JSON.stringify(state),
            search: JSON.stringify(search),
            result: JSON.stringify(products),
            current: JSON.stringify(page),
            pages: JSON.stringify(Math.ceil(count / perPage)),
            offset: JSON.stringify(offset),
            source: JSON.stringify(source)    
          })                    
        })
      })    
    }
  } catch (e) {
    console.log(e)
  }

}

exports.addData = (request, response) => {
  response.render('new-form', {message: ""})
}

exports.viewRegister = (request, response) => {
  response.render('register')
}

exports.postRegistration = async (request, response) => {
  let datax = await request.body;

  const options = new userRegistrationModel({
    username: datax.username,
    password: datax.password,
    email: datax.email,
    address: datax.address,
    age: datax.age
  })

  /* saving to database then sending to frontend - grab in callback result */
  userModel.save(options)
  .then(res => {
    response.send({
      message: "Success",
      result: res
    })
  })
  .catch(err => {
    response.send({
      message: "Failed",
      result: err
    })
  })    
}