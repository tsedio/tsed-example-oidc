import {Env, setValue} from "@tsed/core";
import {Constant, Inject, Injectable} from "@tsed/di";
import Provider from "oidc-provider";
import RawOIDCProvider, {ClientMetadata, Configuration, interactionPolicy} from "oidc-provider";
import {OidcAdapterService} from "./OidcAdapterService";
import {OidcInteractions} from "./OidcInteractions";
import {OidcJwks} from "./OidcJwks";

@Injectable()
export class OidcProviderService {
  raw: RawOIDCProvider;

  @Constant("env")
  protected env: Env;

  @Constant("httpPort")
  protected httpPort: number | string;

  @Constant("httpsPort")
  protected httpsPort: number | string;

  @Constant("oidc.issuer", "")
  protected issuer: string;

  @Constant("oidc.clients", "")
  protected staticClients: ClientMetadata[];

  @Constant("oidc.secureKey")
  protected secureKey: string[];

  @Constant("oidc.proxy", false)
  protected proxy: boolean;

  @Constant("oidc.options", {})
  protected options: Configuration;

  @Inject()
  protected oidcJwks: OidcJwks;

  @Inject()
  protected oidcAdapters: OidcAdapterService;

  @Inject()
  protected oidcInteractions: OidcInteractions;

  async getConfiguration(): Promise<Configuration> {
    const [jwks, adapter] = await Promise.all([
      this.oidcJwks.getJwks(),
      this.oidcAdapters.createAdapterClass()
    ]);

    const configuration = {
      ...this.options,
      adapter,
      jwks,
      clients: this.staticClients
    };

    if (this.env === Env.PROD) {
      setValue(configuration, "cookies.short.secure", true);
      setValue(configuration, "cookies.long.secure", true);
    }

    const policy = this.getPolicy();
    if (policy) {
      setValue(configuration, "interactions.policy", policy);
    }

    return configuration;
  }

  getIssuer() {
    if (this.issuer) {
      return this.issuer;
    }

    if (this.httpsPort) {
      return `https://localhost:${this.httpsPort}`;
    }

    return `http://localhost:${this.httpPort}`;
  }

  get(): Provider {
    return this.raw;
  }

  async create(): Promise<Provider> {
    const configuration = await this.getConfiguration();
    const oidcProvider = new RawOIDCProvider(this.getIssuer(), configuration);

    if (this.proxy || this.env === Env.PROD) {
      oidcProvider.proxy = true;
    }

    if (this.secureKey) {
      oidcProvider.keys = this.secureKey;
    }

    this.raw = oidcProvider;

    return this.raw;
  }

  private getPolicy() {
    const interactions = this.oidcInteractions.getInteractions();

    if (interactions.length) {
      const policy = interactionPolicy.base();

      interactions.forEach((provider) => {
        const {name, ...options} = provider.store.get("interactionOptions");

        if (!policy.get(name)) {
          policy.add(new interactionPolicy.Prompt({
            name,
            ...options
          }));
        }

        if (provider.instance.$onCreate) {
          provider.instance.$onCreate(policy.get(name));
        }
      });

      return policy;
    }
  }
}
