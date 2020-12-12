import {BodyParams, Constant, Injectable, Post, View} from "@tsed/common";
import {Env} from "@tsed/core";
import {OidcCtx, OidcSession, Params, Prompt, Uid} from "../decorators";
import {Interaction} from "../decorators/interaction";
import {OidcAccounts} from "../services/OidcAccounts";

@Interaction({
  name: "login"
})
export class LoginInteraction {
  @Injectable()
  oidcAccounts: OidcAccounts;

  @Constant("env")
  env: Env;

  @View("login")
  async $prompt(@OidcCtx() oidcCtx: OidcCtx,
                @Prompt() prompt: Prompt,
                @OidcSession() session: OidcSession,
                @Params() params: Params,
                @Uid() uid: Uid): Promise<any> {
    const client = await oidcCtx.findClient();

    return {
      client,
      uid,
      details: prompt.details,
      params,
      title: "Sign-in",
      ...oidcCtx.debug()
    };
  }

  @Post("/login")
  async submit(@BodyParams("login") login: string) {
    const account = await this.oidcAccounts.findByLogin(login);

    return {
      select_account: {}, // make sure its skipped by the interaction policy since we just logged in
      login: {
        account: account.accountId
      }
    };
  }
}