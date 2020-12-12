import {
  AdditionalProperties,
  CollectionOf,
  Default,
  Email,
  Enum,
  Groups,
  Integer,
  Name,
  Property,
  Required,
  Uri
} from "@tsed/schema";
import {snakeCase} from "change-case";
import {ClientMetadata} from "oidc-provider";
import {OIDCApplicationTypes} from "./OidcApplicationTypes";
import {OidcGrantTypes} from "./OidcGrantTypes";
import {OidcResponseTypes} from "./OidcResponseTypes";
import {OidcSubjectTypes} from "./OidcSubjectTypes";

function Snake(target: Object, propertyKey: string) {
  return Name(snakeCase(propertyKey))(target, propertyKey);
}

@AdditionalProperties(true)
export class OidcClient implements Partial<ClientMetadata> {
  @Required()
  @Snake
  @Groups("!creation")
  clientId: string;

  @Required()
  @Snake
  @Groups("!creation")
  clientSecret: string;

  @Uri()
  @Snake
  redirectUris: string[] = [];

  @Enum(OidcResponseTypes)
  @Snake
  responseTypes: OidcResponseTypes[] = [];   // types: code / id_token token / code id_token token / token / none

  @Enum(OidcGrantTypes)   // types: authorization_code, implicit, refresh_token, client_credentials
  @Snake
  grantTypes: OidcGrantTypes[] = [];

  @Enum(OIDCApplicationTypes)   // types: web, native, service
  @Snake
  @Default(OIDCApplicationTypes.WEB)
  applicationType: OIDCApplicationTypes;

  @Snake
  clientName: string;

  @Uri()
  @Snake
  clientUri: string;

  @Uri()
  @Snake
  logoUri: string;

  @Snake
  tokenEndpointAuthMethod: string;

  @Snake
  defaultMaxAge: number;

  @Snake
  @CollectionOf(String)
  defaultAcrValues: string[];

  @Uri()
  @CollectionOf(String)
  @Snake
  postLogoutRedirectUris: string[];

  @Property(String)
  scope: string;

  @Uri()
  @Snake
  policyUri: string;

  @Uri()
  @Snake
  initiateLoginUri: string;

  @Uri()
  @Snake
  jwksUri: string;

  @Uri()
  @Snake
  tosUri: string;

  @Email()
  @CollectionOf(String)
  contacts: string[];

  @Integer()
  @Snake
  clientIdIssuedAt: number;

  @Enum(OidcSubjectTypes)
  @Snake
  subjectType: OidcSubjectTypes;

  get _id() {
    return this.clientId;
  }

  set _id(id: string) {
    this.clientId = id;
  }
}