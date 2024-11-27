require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const productsRouter = require('./controllers/products')
const depositRouter = require('./controllers/deposit')
const buyRouter = require('./controllers/buy')
const resetRouter = require('./controllers/reset')

const {connect} = require('./db')
const middleware = require('./utils/middleware')


connect()

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/user', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/product', productsRouter)
app.use('/api/deposit', depositRouter)
app.use('/api/buy', buyRouter)
app.use('/api/reset', resetRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



module.exports = app