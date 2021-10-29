const quizModel = require('../models/quiz_model');

const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

exports.edit = (request, response) => {
  console.log(request)

  let options = {
    title: request.body.title,
    excerpt: request.body.excerpt,
    description: request.body.description,
    price: request.body.price,
    id: request.body.id,
    rate: request.body.rate,
    related: request.body.related,    
  }

  quizModel.updateOne({_id: request.body._id}, options)
  .then(resp => {
    response.render('quiz-edit',  { message: "Update Success", result: resp })
  })
  .catch(err => {
    response.send({
      message: "failed to update data",
      result: err
    })
  })  

}

exports.formEdit = async (request, response) => {
  let id = request.params._id;

  const hasil = await quizModel.findOne({ _id: id }).exec();
  response.status(200).render('quiz-edit', {
    message: "Dipslaying Data in Edit Form",
    result: hasil
  })
}

exports.delete = (request, response) => {
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

exports.fetch = async (request, response) => {
  const hasil = await quizModel.find({})
  response.status(200).send({
    result: hasil
  });
}

exports.form = (request, response) => {
  response.render('quiz-add');
}

exports.quizDashboard = (request, response) => {
  response.render('quiz-dashboard');
}

exports.create = async (request, response) => {
  try {
    const dataOptions = new quizModel({
      title: request.body.title,
      excerpt: request.body.excerpt,
      description: request.body.description,
      price: request.body.price,
      id: request.body.id,
      rate: request.body.rate,
      related: request.body.related,
    });
    // const file = request.file;
    // console.log(file);    
    const posting = await dataOptions.save();
    if( posting !== null || posting === undefined ) {
      response.status(201).render('quiz-add', {message: 'File Uploaded Successfully', result: dataOptions});
    }
  } catch {
    response.status(400).send(error.message);
  }
}



