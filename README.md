# Fastify Keycloak Connect

Fastify plugin for keycloak (Identity and Access Management Solution)

## Usage

### With fastify secure session

```js
const fastifyKeycloak = require("fastify-keycloak");

const store = fastify.createSecureSession({});

fastify.register(fastifyKeycloak, {
  options: { store },
  middleware: { logout: "/leave" },
});
```

### With fastify session

```js
const fastifyKeycloak = require("fastify-keycloak");
const fastifySession = require("fastify-session");
const Store = require("fastify-session/lib/store");

const store = new Store();

fastify.register(fastifySession, { store });
fastify.register(fastifyKeycloak, {
  options: { store },
});
```

### With fastify cookie only

```js
const fastifyKeycloak = require("fastify-keycloak");
const Cookie = require("fastify-cookie");

// we need to patch cookie method
fastify.register(Cookie)
  .after(() => {
    fastify.decorateResponse('cookie', fastify.setCookie)
  });

fastify.register(fastifyKeycloak, {
  options: { cookies: true },
});
```
