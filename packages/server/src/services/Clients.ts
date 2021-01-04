import {Adapter, InjectAdapter} from "@tsed/adapters";
import {Constant, Injectable} from "@tsed/di";
import {ClientMetadata} from "oidc-provider";
import {Client} from "../models/Client";

@Injectable()
export class Clients {
  @InjectAdapter("Clients", Client)
  protected adapter: Adapter<Client>;

  @Constant("oidc.clients", [])
  protected staticsClients: ClientMetadata;
}