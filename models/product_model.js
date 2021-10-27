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

// implement pagination-v2
productSchema.plugin(mongoosePaginate);

// products adalah nama schema / tabel di MangoDB-nya
const products = Mongoose.model('products', productSchema);
module.exports = products;