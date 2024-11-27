const resetRouter = require('express').Router()
const authenticate = require('../utils/middleware').userExtractor


resetRouter.put('/', authenticate, async (request, response) => {
  const user = request.user
  user.deposit = 0
  await user.save()
  response.json({success: true})
})


module.exports = resetRouter