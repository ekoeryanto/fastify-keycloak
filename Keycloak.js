const KeycloakConnect = require('keycloak-connect')
const BearerStore = require('keycloak-connect/stores/bearer-store');
const SessionStore = require('keycloak-connect/stores/session-store');
const CookieStore = require('./store/cookie')

class Keycloak extends KeycloakConnect {
  constructor(options, config) {
    super(options, config)

    this.stores = [BearerStore];

    if (options.store) {
      this.stores.push(new SessionStore(options.store));
    }

    if (options.cookies) {
      this.stores.push(CookieStore);
    }
  }

  accessDenied(request) {
    request.log.error(`Access to ${request.url} denied.`)
    const err = new Error('Access Denied')
    err.status = 403
    throw err
  }
}

module.exports = Keycloak
