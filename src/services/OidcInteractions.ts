import {Constant, HandlerMetadata, HandlerType, PlatformHandler, Provider} from "@tsed/common";
import {Env} from "@tsed/core";
import {Inject, Injectable, InjectorService} from "@tsed/di";
import {OidcSettings} from "../interfaces/OidcSettings";

@Injectable()
export class OidcInteractions {
  @Inject()
  injector: InjectorService;

  @Constant("env")
  env: Env;

  @Constant("oidc")
  oidcSettings: OidcSettings;

  protected interactions: Map<string, Provider> = new Map();

  $onInit(): void {
    const platformHandler = this.injector.get<PlatformHandler>(PlatformHandler)!;

    this.getInteractions().forEach((provider: Provider) => {
      const {name} = provider.store.get("interactionOptions");
      this.interactions.set(name, provider);

      if (provider.instance.$prompt) {
        provider.store.set("$prompt", platformHandler.createCustomHandler(provider, "$prompt"));
      }
    });
  }

  getInteractions() {
    return [...this.injector.getProviders("controller")].filter((provider) => {
      return provider.subType === "interaction";
    });
  }

  getInteractionProvider(name: string): Provider | undefined {
    return this.interactions.get(name);
  }

  getInteractionHandler(name: string) {
    const interaction = this.getInteractionProvider(name);

    if (interaction) {
      return interaction.store.get("$prompt");
    }
  }
}