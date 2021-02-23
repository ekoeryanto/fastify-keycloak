import { readFileSync } from 'fs';
import { join } from 'path'

export default class Config {
  realm?: string;
  clientId?: string;
  secret?: string;
  public?: string;
  authServerUrl?: string;
  realmUrl?: string;
  realmAdminUrl?: string;
  minTimeBetweenJwksRequests?: string | number;
  bearerOnly?: string;
  publicKey?: string;
  verifyTokenAudience?: string;

  constructor(configuration?: string | Record<string, any>) {
    if (!configuration) {
      configuration = join(process.cwd(), 'keycloak.json')
    }

    if (typeof configuration === 'string') {
      this.loadConfiguration(configuration);
    } else {
      this.configure(configuration);
    }
  }

  loadConfiguration (configPath: string) {
    const json = readFileSync(configPath);
    const config = JSON.parse(json.toString());
    this.configure(config);
  };

  configure(config: Record<string, string>) {
    this.realm = this.resolveValue(config.realm as string);

    this.clientId = this.resolveValue((config.resource || config['client-id'] || config.clientId) as string);

    this.secret = this.resolveValue((config.credentials as unknown as Record<string, string> || {}).secret || config.secret);

    this.public = this.resolveValue(config['public-client'] || config.public);

    this.authServerUrl = (this.resolveValue(config['auth-server-url'] || config['server-url'] || config.serverUrl || config.authServerUrl) || '').replace(/\/*$/gi, '');

    this.realmUrl = this.authServerUrl + '/realms/' + this.realm;

    this.realmAdminUrl = this.authServerUrl + '/admin/realms/' + this.realm;

    this.minTimeBetweenJwksRequests = config['min-time-between-jwks-requests'] || config.minTimeBetweenJwksRequests || 10;

    this.bearerOnly = this.resolveValue(config['bearer-only'] || config.bearerOnly);

    const plainKey = this.resolveValue(config['realm-public-key'] || config.realmPublicKey);

    if (plainKey) {
      this.publicKey = '-----BEGIN PUBLIC KEY-----\n';
      for (let i = 0; i < plainKey.length; i = i + 64) {
        this.publicKey += plainKey.substring(i, i + 64);
        this.publicKey += '\n';
      }
      this.publicKey += '-----END PUBLIC KEY-----';
    }

    this.verifyTokenAudience = this.resolveValue(config['verify-token-audience'] || config.verifyTokenAudience);
  }

  private resolveValue(value: string) {
    const regex = /\$\{env\.([^:]*):?(.*)?\}/;

    // is this an environment variable reference with potential fallback?
    if (!regex.test(value)) {
      return value;
    }

    const [envVar, fallbackVal] = value
      .replace(regex, '$1--split--$2')
      .split('--split--');

    return process.env[envVar] || fallbackVal;
  }
}
