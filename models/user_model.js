/* Create Schema */
const Mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
};

var userSchema = new Mongoose.Schema({
  username: { type: String },
  password: { type: String },  
  email: { type: String },
  address: { type: String },
  age: { type: String }
}, schemaOptions)

// user_registration adalah nama schema / tabel di MangoDB-nya
const user = Mongoose.model('user_registration', userSchema);
module.exports = user;