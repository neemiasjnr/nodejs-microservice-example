'use strict'

const jwt = require('jsonwebtoken')

const TOKEN_EXPIRED_ERROR = 'TokenExpiredError'
const TOKEN_MISSING_ERROR = 'TokenMissingError'
const TOKEN_INVALID_ERROR = 'TokenInvalidError'

const config = {
  algorithm: 'RS512',
  expiresIn: '2d',
  noTimestamp: true
}

const extractToken = payload => {
  if (!payload.token) {
    throw new Error(TOKEN_MISSING_ERROR)
  }
  const [tokenType, token] = payload.token.split(' ')
  if (tokenType !== 'Bearer' || !token) {
    throw new Error(TOKEN_INVALID_ERROR)
  }
  return token
}

const sign = payload => jwt.sign(payload, process.env.JWT_PRIVATE_KEY, config)

const verify = payload => {
  try {
    jwt.verify(payload, process.env.JWT_PUBLIC_KEY, config)
  } catch (err) {
    if (err.name === TOKEN_EXPIRED_ERROR) {
      throw {
        statusCode: 403,
        code: TOKEN_EXPIRED_ERROR,
        message: 'Access denied'
      }
    }
    throw new Error(err)
  }
}

const refresh = payload => {
  try {
    verify(payload)
    return payload
  } catch (err) {
    if (err.code === TOKEN_EXPIRED_ERROR) {
      return sign(payload)
    }
    throw new Error(err)
  }
}

module.exports = {
  extractToken,
  sign,
  verify,
  refresh
}
