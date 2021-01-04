import {Post} from "@tsed/common";
import {Interaction, OidcCtx} from "@tsed/oidc-provider";

@Interaction({
  name: "abort"
})
export class AbortInteraction {
  @Post("/abort")
  abort(@OidcCtx() oidcCtx: OidcCtx) {
    return oidcCtx.interactionFinished({
      error: "access_denied",
      error_description: "End-User aborted interaction"
    });
  }
}