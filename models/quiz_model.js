 /* Create Schema */
const Mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
};

var quizSchema = new Mongoose.Schema({
	title: { type: String },
  excerpt: { type: String },
  description: { type: String },
	price: { type: String },
  id: { type: String },
  rate: { type: String },
  related: { type: String },
}, schemaOptions);

// implement pagination-v2
quizSchema.plugin(mongoosePaginate);

// products adalah nama schema / tabel di MangoDB-nya
const products = Mongoose.model('quiz', quizSchema);
module.exports = products;