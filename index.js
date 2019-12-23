'use strict'

const fastify = require('fastify')()
const fs = require('fs')
const pkg = require('./package.json')
const doc = require('./version')
const handler = require('./lib')

fastify.addSchema({
  $id: 'apiKeyHeaders',
  type: 'object',
  required: ['x-api-key'],
  properties: {
    'x-api-key': { type: 'string' }
  }
})

fastify.addSchema({
  $id: 'apiError',
  type: 'object',
  required: ['statusCode', 'error', 'message'],
  properties: {
    code: { type: 'string' },
    message: { type: 'string' }
  }
})

fastify.route({
  method: 'GET',
  url: '/version',
  schema: {
    response: {
      200: {
        $id: 'versionResponse',
        type: 'object',
        properties: {
          commit: { type: 'string' },
          serviceName: { type: 'string' },
          version: { type: 'string' }
        }
      }
    }
  },
  handler: (_, res) => {
    res.send({
      commit: doc.version,
      serviceName: pkg.name,
      version: pkg.version
    })
  }
})

fastify.route({
  method: 'POST',
  url: '/create-token',
  schema: {
    headers: 'apiKeyHeaders#',
    body: {
      type: 'object',
      required: ['userId', 'countryCode', 'ipAddress', 'userAgent', 'deviceId'],
      properties: {
        userId: { type: 'string' },
        countryCode: { type: 'string' },
        platform: { type: 'string' },
        ipAddress: { type: 'string' },
        userAgent: { type: 'string' },
        deviceId: { type: 'string' },
        clientDeviceId: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          token: { type: 'string' }
        }
      }
    }
  },
  handler: async (req, reply) => {
    await handler({
      reply,
      type: 'CreateUserToken',
      payload: {
        userId: req.body.userId,
        countryCode: req.body.countryCode,
        deviceId: req.body.deviceId
      }
    })
  }
})

fastify.route({
  method: 'GET',
  url: '/verify-token',
  schema: {
    headers: {
      type: 'object',
      required: ['x-api-key', 'authorization'],
      properties: {
        'x-api-key': { type: 'string' },
        authorization: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          token: { type: 'string' }
        }
      },
      403: 'apiError#'
    }
  },
  handler: async (req, reply) => {
    await handler({
      reply,
      type: 'VerifyUserToken',
      payload: {
        token: req.headers.authorization
      }
    })
  }
})

const setCredentials = () => {
  const JWT_PUBLIC_KEY = fs.readFileSync('./credentials/public.pem', 'utf8')
  const JWT_PRIVATE_KEY = fs.readFileSync('./credentials/private.pem', 'utf8')
  process.env['JWT_PUBLIC_KEY'] = JWT_PUBLIC_KEY
  process.env['JWT_PRIVATE_KEY'] = JWT_PRIVATE_KEY
}

const validate = () => {
  const requiredEnvs = ['JWT_PRIVATE_KEY', 'JWT_PUBLIC_KEY']

  requiredEnvs.forEach(env => {
    if (!process.env[env]) throw new Error(`Missing the env variable ${env}`)
  })
}

fastify.listen(8000, function(err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  setCredentials()
  validate()
  fastify.log.info(`server listening on ${address}`)
})
