const CookieStore = require('keycloak-connect/stores/cookie-store')

let store = (grant) => {
  return (request, reply) => {
    reply.setCookie(CookieStore.TOKEN_KEY, grant.__raw);
  };
};

let unstore = (request, reply) => {
  reply.clearCookie(CookieStore.TOKEN_KEY);
};

module.exports = {
  ...CookieStore,
  wrap(grant) {
    grant.store = store(grant)
    grant.unstore = unstore;
  }
};

