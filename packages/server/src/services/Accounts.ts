import {Adapter, InjectAdapter} from "@tsed/adapters";
import {PlatformContext} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {AccessToken, AuthorizationCode, DeviceCode, OidcAccountsMethods} from "@tsed/oidc-provider";
import crypto from "crypto";
import {Account} from "../models/Account";
import {PasswordHash} from "../models/PasswordHash";

@Injectable()
export class Accounts implements OidcAccountsMethods {
  @InjectAdapter("Accounts", Account)
  protected adapter: Adapter<Account>;

  async $onInit() {
    const accounts = await this.adapter.findAll();

    if (accounts.length === 0) {
      await this.adapter.create({
        email: "admin@admin.com",
        hash: this.generateHash("admin@admin.com", this.generateSalt(12))
      });
    }
  }

  async findAccount(id: string, token: AuthorizationCode | AccessToken | DeviceCode | undefined, ctx: PlatformContext) {
      return this.adapter.findById(id);
  }

  async authenticate(payload: any): Promise<Account | undefined> {
    const {email, password} = payload;

    const account = await this.adapter.findOne({
      email
    });

    if (!account) {
      return undefined;
    }

    if (!this.comparePassword(password, account.hash)) {
      return undefined;
    }

    return account;
  }

  generateSalt(rounds: number) {
    return crypto.randomBytes(Math.ceil(rounds / 2)).toString("hex").slice(0, rounds);
  }

  generateHash(password: string, salt: string): PasswordHash {
    const hash = crypto.createHmac("sha512", salt);
    hash.update(password);

    return {
      salt,
      hashed: hash.digest("hex")
    };
  }

  comparePassword(password: string, hash: PasswordHash) {
    const passwordData = this.generateHash(password, hash.salt);
    return passwordData.hashed === hash.hashed;
  }
}