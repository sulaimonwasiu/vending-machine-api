const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value % 5 === 0
      },
      message: 'Cost must be a multiple of 5'
    }
  },
  amountAvailable: {
    type: Number,
    default: 0
  },
  sellerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


const Product = mongoose.model('Product', productSchema)

module.exports = Product