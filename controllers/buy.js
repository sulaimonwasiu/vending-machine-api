const buyRouter = require('express').Router()
const authenticate = require('../utils/middleware').userExtractor
const calculateChange = require('../utils/calcChange')
const Product = require('../models/product')



buyRouter.post('/', authenticate, async (request, response) => {
  const user = request.user
  const {productId, amount} = request.body
  const coins = [5,10,20,50,100]
    
  // Must be a buyer
  if (user.role !== 'buyer') 
    return response.status(401).send('Unauthorized')

  // Find product
  const product = await Product.findById(productId)

  // Validate product exists
  if(!product) {
    return response.status(404).send('Product not found')
  }

  // Calculate total cost
  const total = product.cost * amount

  // Validate user has enough funds
  if(user.deposit < total) {
    return response.status(400).send('Insufficient funds')
  }

  // Deduct funds from user and update product stock
  user.deposit -= total
  product.amountAvailable -= amount


  // Return change
  const change = user.deposit
  const changeCoins = calculateChange(coins, change)

  // Save updated user
  await user.save()
  await product.save()

  response.json({
    total, 
    product,
    changeCoins
  })

})


module.exports = buyRouter