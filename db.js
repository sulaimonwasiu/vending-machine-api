const mongoose = require('mongoose')
const config = require('./utils/config')
 

const connect = async () => {
  try{
    await mongoose.connect(config.MONGODB_URI)
    console.log('Database connected!')
  } catch(error){
    console.error('Not connected!', error.message)
  }
}

const disConnect = async () => {
  try{
    await mongoose.connection.close()
    console.log('Database disconnected!')
  } catch(error){
    console.error('Not disconnected!', error.message)
  }
}




module.exports = {connect, disConnect}