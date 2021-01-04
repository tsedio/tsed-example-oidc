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
import Provider from "oidc-provider";
import {ApplicationTypes} from "./ApplicationTypes";
import {GrantTypes} from "./GrantTypes";
import {ResponseTypes} from "./ResponseTypes";
import {SubjectTypes} from "./SubjectTypes";

function Snake(target: Object, propertyKey: string) {
  return Name(snakeCase(propertyKey))(target, propertyKey);
}

export class Client {
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

  @Enum(ResponseTypes)
  @Snake
  responseTypes: ResponseTypes[];

  @Enum(GrantTypes)   // types: authorization_code, implicit, refresh_token, client_credentials
  @Snake
  grantTypes: GrantTypes[] = [];

  @Enum(ApplicationTypes)   // types: web, native, service
  @Snake
  @Default(ApplicationTypes.WEB)
  applicationType: ApplicationTypes;

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

  @Enum(SubjectTypes)
  @Snake
  subjectType: SubjectTypes;

  get _id() {
    return this.clientId;
  }

  set _id(id: string) {
    this.clientId = id;
  }
}