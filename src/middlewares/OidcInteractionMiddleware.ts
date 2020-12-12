import {Context, Inject, InjectorService, Middleware} from "@tsed/common";
import {OidcInteractionContext} from "../services/OidcInteractionContext";
import {OidcInteractions} from "../services/OidcInteractions";

@Middleware()
export class OidcInteractionMiddleware {
  @Inject()
  protected oidcInteractions: OidcInteractions;

  @Inject()
  protected injector: InjectorService;

  async use(@Context() context: Context) {
    const oidcInteraction = this.injector.invoke<OidcInteractionContext>(OidcInteractionContext, context.container);
    const interactionDetails = await oidcInteraction.interactionDetails();
    const {uid, prompt, params, session} = interactionDetails;

    context.set("oidcInteraction", oidcInteraction);
    context.set("interactionDetails", interactionDetails);
    context.set("uid", uid);
    context.set("prompt", prompt);
    context.set("params", params);
    context.set("session", session);
  }
}