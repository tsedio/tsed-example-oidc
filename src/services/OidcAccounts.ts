import {Injectable} from "@tsed/di";
import {OidcAccount} from "../models/OidcAccount";

@Injectable()
export class OidcAccounts {
  findAccount() {

  }

  async findByLogin(login: string): Promise<OidcAccount> {
    return {} as any;
  }
}