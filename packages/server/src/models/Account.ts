import {serialize} from "@tsed/json-mapper";
import {Email, Name, Property} from "@tsed/schema";
import {PasswordHash} from "./PasswordHash";

export class Account {
  @Name("sub")
  _id: string;

  @Email()
  email: string;

  @Property()
  hash: PasswordHash;

  @Name("email_verified")
  emailVerified: boolean;

  @Name("family_name")
  familyName: string;

  @Name("given_name")
  givenName: string;

  @Property()
  locale: string;

  @Property()
  name: string;

  [key: string]: unknown;

  get accountId() {
    return this._id;
  }

  claims() {
    return serialize(this, {useAlias: true});
  }
}