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
	name: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: String, required: true },
	desc: { type: String },
  owner: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: String, required: true },
}, schemaOptions);

// products adalah nama schema / tabel di MangoDB-nya
const products = Mongoose.model('products', productSchema);
module.exports = products;