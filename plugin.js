const fp = require('fastify-plugin')
const Keycloak = require('keycloak-connect')

module.exports = fp((fastify, opts, next) => {
  const {
    options,
    config,
    middleware
  } = opts

  const keycloak = new Keycloak(options, config)

  fastify.decorate('keycloak', keycloak)

  const middlewares = keycloak.middleware(middleware)

  for (let x = 0; x < middlewares.length; x++) {
    fastify.addHook('onRequest', middlewares[x])
  }

  next()
})