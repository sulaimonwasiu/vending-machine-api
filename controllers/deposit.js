const depositRouter = require('express').Router()
const authenticate = require('../utils/middleware').userExtractor



// Get a buyer deposit: Check my balance
depositRouter.get('/user', authenticate, async (request, response) => {
  if (request.user.role !== 'buyer') 
    return response.status(401).send('Unauthorized')

  response.json(request.user)
})

// Deposit route
depositRouter.post('/', authenticate, async (request, response) => {
  const user = request.user
  const {amount} = request.body
  
  // Must be a buyer
  if (user.role !== 'buyer') 
    return response.status(401).send('Unauthorized')
  
  // Validate amount is supported coin value
  if([5,10,20,50,100].indexOf(amount) == -1) {
    return response.status(400).send('Invalid coin value')
  }
  
  // Deposit valid coin
  user.deposit += amount
  await user.save()
  response.json({message: 'Your deposit was successful.'})
})


module.exports = depositRouter