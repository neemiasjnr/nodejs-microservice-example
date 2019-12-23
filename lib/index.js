'use strict'

const createToken = require('./use-cases/create-token')
const verifyToken = require('./use-cases/verify-token')

// Handlers initialization
const handlers = new Map()
handlers.set(createToken.type, createToken.handler)
handlers.set(verifyToken.type, verifyToken.handler)


module.exports = async ({ type, payload, reply }) => {
  const handler = handlers.get(type)
  if (!handler) {
    throw new Error(`Handler does not exist: ${type}`)
  }

  try {
    reply.send(await handler(payload))
  } catch (err) {
    const { statusCode, code, message } = err

    if (statusCode !== 200 && code && message) {
      reply.code(statusCode).send({ code, message })
    }

    console.debug(err)
    throw new Error('Internal error')
  }
}
