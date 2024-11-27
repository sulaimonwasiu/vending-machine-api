const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const authenticate = require('../utils/middleware').userExtractor


// Register a user
usersRouter.post('/', async (request, response) => {
  const { username, password, role} = request.body
    
  
  //unique username
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }
  
  //password be at least 3 characters long
  password.length < 3
    ? response.status(400).json({
      error: 'password must be at least 3 charaters long'})
    : null
    
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  
  const user = new User({
    username,
    passwordHash,
    role
  })
  
  const savedUser = await user.save()
  
  response.status(201).json(savedUser)
})

// Get all users
usersRouter.get('/', authenticate, async (request, response) => {
  if (request.user.role !== 'seller') 
    return response.status(401).send('Unauthorized')

  const results = await User.find({})
  response.json(results)
  
})

// Delete a user
usersRouter.delete('/:id', authenticate, async (request, response) => {
  const user = request.user

  if (user.role !== 'seller') 
    return response.status(401).send('Unauthorized')
  
  const merchant = await User.findById(request.params.id)
  !merchant ? response.status(404).end() : null


  if (merchant){
    await User.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }else{
    response.status(401).json({
      'message': 'this user is not authorized to delete this merchant'
    })
  }
})


module.exports = usersRouter