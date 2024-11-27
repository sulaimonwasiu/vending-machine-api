//const { request } = require('../app')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (req, res, next) => {

  const { method, url, query, body } = req
  const timestamp = new Date().toISOString()

  logger.info(`${timestamp} - ${method} ${url}`)
  logger.info('Query Parameters:', query)
  logger.info('Request Body:', body)

  next()
}

// Token extractor
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

// User Extractor
const userExtractor = async (request, response, next) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  request.user = user

  next()
}

// Check role middleware
const checkRole = (request, response, next) => {
  if(request.user.role !== 'seller') {
    return response.status(401).send('Unauthorized')
  }
  next()
}


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      error: 'Validation Error',
      errors: err.message
    })
  }
  
  // Handle CastError
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Cast Error',
      message: 'Invalid ID'
    })
  }
  
  // Handle JSON Web Token errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  }
  
  // Handle SyntaxError
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Syntax Error',
      message: 'Invalid JSON payload'
    })
  }
  
  // Handle other types of errors
  logger.error(err.message)
  
  res.status(500).json({
    error: 'Internal Server Error'
  })
}



module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  checkRole,
  unknownEndpoint,
  errorHandler
}