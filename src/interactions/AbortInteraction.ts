import {Post} from "@tsed/common";
import {Interaction, OidcCtx} from "../decorators";

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