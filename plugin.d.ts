import { FastifyPluginCallback } from 'fastify';
import { Keycloak, KeycloakConfig, KeycloakOptions } from 'keycloak-connect';

declare module 'fastify' {
  interface FastifyInstance {
    keycloak: Keycloak
  }
}

export interface FastifyKeycloakOptions {
  options: KeycloakOptions;
  config?: KeycloakConfig;
  middleware: {
    admin?: string;
    logout?: string;
  }
}

declare const fastifyKeycloak: FastifyPluginCallback<NonNullable<FastifyKeycloakOptions>>;

export default fastifyKeycloak;
export { fastifyKeycloak }