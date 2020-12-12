import {Context, Get, Inject} from "@tsed/common";
import {Interactions} from "../../decorators/interactions";
import {OidcInteractions} from "../../services/OidcInteractions";
import {AbortInteraction} from "../../interactions/AbortInteraction";
import {ConsentInteraction} from "../../interactions/ConsentInteraction";
import {LoginInteraction} from "../../interactions/LoginInteraction";
import {SelectAccountInteraction} from "../../interactions/SelectAccountInteraction";

@Interactions({
  path: "/interaction/:uid",
  children: [
    SelectAccountInteraction,
    LoginInteraction,
    ConsentInteraction,
    AbortInteraction
  ]
})
export class InteractionsCtrl {
  @Inject()
  oidcInteractions: OidcInteractions;

  @Get("/")
  async promptInteraction(@Context() context: Context) {
    const handler = this.oidcInteractions.getInteractionHandler(prompt.name);

    if (handler) {
      return handler(context);
    }
  }
}