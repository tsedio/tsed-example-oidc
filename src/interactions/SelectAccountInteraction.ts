import {BodyParams, Post, View} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {OidcSession, Params, Prompt, Uid} from "../decorators";
import {Interaction} from "../decorators/interaction";
import {OidcCtx} from "../decorators/oidcCtx";

@Interaction({
  name: "select_account",
  requestable: true,
  priority: 0
})
export class SelectAccountInteraction {
  @View("select_account")
  async $prompt(
    @OidcCtx() oidcCtx: OidcCtx,
    @Prompt() prompt: Prompt,
    @Params() params: Params,
    @Uid() uid: Uid,
    @OidcSession() session: OidcSession) {
    const client = await oidcCtx.findClient();

    if (!session) {
      return oidcCtx.interactionFinished({
        select_account: {}
      });
    }

    const account = await oidcCtx.findAccount();

    if (!account) {
      throw new NotFound("Invalid account");
    }

    const {email} = await account.claims("prompt", "email", {email: null}, []);

    return {
      client,
      uid,
      email,
      details: prompt.details,
      params,
      title: "Sign-in",
      session
    };
  }

  @Post("/continue")
  async continue(
    @BodyParams("switch") switchOp: string,
    @OidcCtx() oidcCtx: OidcCtx,
    @Params() params: Params,
    @Uid() uid: Uid,
    @OidcSession() session: OidcSession
  ) {
    if (switchOp) {
      if (params.prompt) {
        const prompts = new Set(params.prompt.split(" "));
        prompts.add("login");

        params.prompt = [...prompts].join(" ");
      } else {
        params.prompt = "login";
      }
      await oidcCtx.save();
    }

    return oidcCtx.interactionFinished({select_account: {}});
  }
}