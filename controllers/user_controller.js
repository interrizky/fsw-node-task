const userModel = require('../models/user_model');
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
    const userData = await userModel.findOne( {username: uname, password: pass} ).exec()

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

exports.dashboardGuest = (request, response) => {
  response.render('guest');
}

exports.addData = (request, response) => {
  response.render('new-form', {message: ""})
}