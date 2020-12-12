import {Inject, InjectorService, PlatformApplication} from "@tsed/common";
import {Module} from "@tsed/di";
import {OidcSecureMiddleware} from "./middlewares/OidcSecureMiddleware";
import {OidcClients} from "./services/OidcClients";
import {OidcProviderService} from "./services/OidcProviderService";

@Module({
  imports: [OidcClients]
})
export class OidcModule {
  @Inject()
  app: PlatformApplication;

  @Inject()
  oidcProvider: OidcProviderService;

  @Inject()
  injector: InjectorService;

  async $onInit() {

  }

  $beforeRoutesInit() {
    this.app.use(OidcSecureMiddleware);
  }

  async $afterRoutesInit() {
    const provider = this.oidcProvider.get();

    this.app.use(provider.callback);
  }

  $onReady() {
    const {injector} = this;
    const {httpsPort, httpPort} = injector.settings;

    const displayLog = (host: any) => {
      const url = typeof host.port === "number" ? `${host.protocol}://${host.address}:${host.port}` : "";

      injector.logger.info(`[OIDC] WellKnown is available on ${url}/.well-known/openid-configuration`);
    };

    if (httpsPort) {
      const host = injector.settings.getHttpsPort();
      displayLog({protocol: "https", ...host});
    } else if (httpPort) {
      const host = injector.settings.getHttpPort();
      displayLog({protocol: "http", ...host});
    }
  }
}