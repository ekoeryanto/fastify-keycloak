const fp = require('fastify-plugin')
const Keycloak = require('./Keycloak')

module.exports = fp((fastify, opts, next) => {
  const {
    options,
    config,
    middleware = {
      admin: '/',
      logout: '/logout'
    },
    ...prototypes
  } = opts

  if (!prototypes.accessDenied) {
    prototypes.accessDenied = (request) => {
      request.log.error(`Access to ${request.url} denied.`)
      const err = new Error('Access Denied')
      err.status = 403
      throw err
    }
  }

  for (let p = 0; p < Object.keys(prototypes).length; p++) {
    Keycloak.prototype[p] = prototypes[p]
  }

  const keycloak = new Keycloak(options, config)

  fastify.decorate('keycloak', keycloak)

  const middlewares = keycloak.middleware(middleware)

  for (let x = 0; x < middlewares.length; x++) {
    fastify.addHook('onRequest', middlewares[x])
  }

  next()
})
