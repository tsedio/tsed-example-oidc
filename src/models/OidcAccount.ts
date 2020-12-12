import {Email, Name, Property} from "@tsed/schema";

export class OidcAccount {
  @Name('sub')
  accountId: string;

  @Email()
  email: string;

  @Name('email_verified')
  emailVerified: boolean;

  @Name('family_name')
  familyName: string;

  @Name('given_name')
  givenName: string;

  @Property()
  locale: string;

  @Property()
  name: string;
}