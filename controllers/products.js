const bcrypt = require('bcrypt')
const productsRouter = require('express').Router()
const Product = require('../models/product')
const {userExtractor, checkRole } = require('../utils/middleware')



// Get all product
productsRouter.get('/', async (request, response) => {
  const products = await Product.find({})
  response.json(products)
})

// Create a product
productsRouter.post('/', userExtractor, checkRole, async (request, response) => {
  const product = new Product({...request.body, sellerId: request.user._id })
  const user = request.user
  const savedProduct = await product.save()

  user.products = user.products.concat(savedProduct._id)
  await user.save()
  response.status(201).json(savedProduct)

})

// Delete a product
productsRouter.delete('/:id', userExtractor, checkRole, async (request, response) => {
  const product = await Product.findById(request.params.id)
  !product ? response.status(404).end() : null
  const user = request.user
  
  if (product.sellerId.toString() === user._id.toString()){
    await Product.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }else{
    response.status(401).json({
      'message': 'this seller is not authorized to delete this product'
    })
  }
})

// Product update

productsRouter.put('/:id', userExtractor, checkRole, async (request, response) => {
  const product = await Product.findById(request.params.id)
  !product ? response.status(404).end() : null
  const user = request.user
  
  if (product.sellerId.toString() === user._id.toString()){
    const updatedProduct = await Product.findByIdAndUpdate(request.params.id, request.body)
    response.json({ message: 'product updated successfully', updatedProduct })
  }else{
    response.status(401).json({
      'message': 'this seller is not authorized to update this product'
    })
  } 
})


module.exports = productsRouter