import {Inject, Injectable, InjectorService, Value} from "@tsed/di";
import crypto from "crypto";
import {OidcAdapter} from "../adapters/OidcAdapter";
import {OidcClient} from "../models/OidcClient";
import {OidcAdapterService} from "./OidcAdapterService";

@Injectable()
export class OidcClients {
  @Inject()
  protected adapterService: OidcAdapterService;

  @Inject()
  protected injector: InjectorService;

  // @Value("oidc.clients", [])
  // protected clients: any[];

  protected driver: OidcAdapter<OidcClient>;

  async $onInit() {
    this.driver = this.adapterService.invokeAdapter<OidcClient>("clients", OidcClient);
  }

  async getClient(clientId: string): Promise<OidcClient | undefined> {
    return this.driver.findById(clientId);
  }

  async createClient(payload: Partial<OidcClient>): Promise<OidcClient> {
    payload.clientSecret = crypto.randomBytes(10).toString("hex");

    return this.driver.create(payload);
  }

  async updateClient(payload: OidcClient): Promise<OidcClient | undefined> {
    const client = await this.driver.findOne({clientId: payload.clientId});

    if (!client) {
      return;
    }

    payload.clientSecret = client.clientSecret;

    return this.driver.updateOne({clientId: client.clientId}, payload);
  }

  async removeClient(clientId: string): Promise<OidcClient | undefined> {
    const client = await this.driver.findOne({clientId});

    if (!client) {
      return;
    }

    return this.driver.deleteOne({clientId: client.clientId});
  }

  async getClients(predicate?: Partial<OidcClient>): Promise<OidcClient[]> {
    return this.driver.findAll(predicate);
  }
}