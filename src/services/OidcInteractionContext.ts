import {Constant, PlatformContext, Provider, ProviderScope, Scope} from "@tsed/common";
import {Env} from "@tsed/core";
import {Inject, Injectable} from "@tsed/di";
import {Account, AnyObject, InteractionResults, PromptDetail, Provider as OidcProvider} from "oidc-provider";
import {debug} from "../utils/debug";
import {OidcProviderService} from "./OidcProviderService";

export type OidcInteraction = InstanceType<OidcProvider["Interaction"]>;

@Injectable()
@Scope(ProviderScope.REQUEST)
export class OidcInteractionContext {
  @Constant("env")
  env: Env;

  @Inject()
  protected oidcProviderService: OidcProviderService;

  @Inject()
  protected context: PlatformContext;

  protected raw: OidcInteraction;

  get session(): InstanceType<OidcProvider["Session"]> | undefined {
    return this.raw.session as any;
  }

  get prompt(): PromptDetail {
    return this.raw.prompt;
  }

  get params(): AnyObject {
    return this.raw.params;
  }

  get uid(): string {
    return this.raw.uid;
  }

  $onInit() {
    this.context.set("interactionContext", this);
  }

  async interactionDetails(): Promise<OidcInteraction> {
    const interactionDetails = await this.oidcProviderService.raw.interactionDetails(this.context.getReq(), this.context.getRes());
    const {uid, prompt, params, session} = interactionDetails;

    this.context.set("interactionDetails", interactionDetails);
    this.context.set("uid", uid);
    this.context.set("prompt", prompt);
    this.context.set("params", params);
    this.context.set("session", session);

    return interactionDetails;
  }

  interactionFinished(result: InteractionResults, options: {mergeWithLastSubmission?: boolean} = {mergeWithLastSubmission: false}) {
    return this.oidcProviderService.raw.interactionFinished(this.context.getReq(), this.context.getRes(), result, options);
  }

  interactionResult(result: InteractionResults, options: {mergeWithLastSubmission?: boolean} = {mergeWithLastSubmission: false}) {
    return this.oidcProviderService.raw.interactionResult(this.context.getReq(), this.context.getRes(), result, options);
  }

  setProviderSession(options: {
    account: string;
    ts?: number;
    remember?: boolean;
    clients?: string[];
    meta?: AnyObject;
  }): InstanceType<Provider["Session"]> {
    return this.oidcProviderService.raw.setProviderSession(this.context.getReq(), this.context.getRes(), options);
  }

  render(view: string, result: any) {
    return this.context.response.render(view, result);
  }

  save(ttl?: number) {
    return this.raw.save(ttl);
  }

  findClient(clientId?: string): InstanceType<Provider["Client"]> {
    if (clientId) {
      return this.oidcProviderService.raw.Client.find(clientId);
    }

    return this.oidcProviderService.raw.Client.find(this.params.clientId);
  }

  /**
   *
   * @param sub
   * @param token
   */
  async findAccount(sub?: string, token?: any): Promise<Account | undefined> {
    if (!sub && this.session) {
      sub = this.session.accountId() as any;
    }

    if (!sub) {
      return;
    }

    return this.oidcProviderService.raw.Account.findAccount(undefined as any, sub!, token);
  }

  debug(obj?: any): any {
    if (this.env === Env.PROD) {
      return;
    }

    if (obj) {
      return debug(obj);
    }

    return {
      session: this.session ? this.debug(this.session) : undefined,
      dbg: {
        params: this.debug(this.params),
        prompt: this.debug(this.prompt)
      }
    };
  }
}