'use strict'

const jwt = require('../modules/jwt')

module.exports = {
  type: 'VerifyUserToken',
  handler(payload) {
    const token = jwt.extractToken(payload)
    jwt.verify(token)

    return {
      token // Returning the original token
    }
  }
}
