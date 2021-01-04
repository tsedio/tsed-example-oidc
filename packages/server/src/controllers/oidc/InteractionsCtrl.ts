import {Get} from "@tsed/common";
import {Interactions, OidcCtx} from "@tsed/oidc-provider";
import {ConsentInteraction} from "../../interactions/ConsentInteraction";
import {LoginInteraction} from "../../interactions/LoginInteraction";

@Interactions({
  path: "/interaction/:uid",
  children: [
    LoginInteraction,
    ConsentInteraction
    // SelectAccountInteraction,
    // AbortInteraction
  ]
})
export class InteractionsCtrl {
  @Get("/")
  async promptInteraction(@OidcCtx() oidcCtx: OidcCtx) {
    return oidcCtx.runInteraction();
  }
}