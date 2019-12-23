'use strict'

const jwt = require('../modules/jwt')

module.exports = {
  type: 'CreateUserToken',
  handler(payload) {
    const token = jwt.sign(payload)
    
    return {
      token
    }
  }
}
