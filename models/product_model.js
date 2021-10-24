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

var productSchema = new Mongoose.Schema({
	name: { type: String },
  price: { type: String },
  quantity: { type: String },
	desc: { type: String },
  owner: { type: String },
	img:
	{
		data: Buffer,
		contentType: String
	}
}, schemaOptions);

// products adalah nama schema / tabel di MangoDB-nya
const products = Mongoose.model('products', productSchema);
module.exports = products;
