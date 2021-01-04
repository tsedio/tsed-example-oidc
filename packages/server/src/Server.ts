import "@tsed/adapters";
import {FileSyncAdapter} from "@tsed/adapters";
import "@tsed/ajv";
import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";
import {join} from "path";
import {InteractionsCtrl} from "./controllers/oidc/InteractionsCtrl";
import {IndexCtrl} from "./controllers/pages/IndexCtrl";
import {Accounts} from "./services/Accounts";

export const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  mount: {
    "/rest": [
      `${rootDir}/controllers/rest/**/*.ts`
    ],
    "/": [InteractionsCtrl, IndexCtrl]
  },
  swagger: [
    {
      path: "/v2/docs",
      specVersion: "2.0"
    },
    {
      path: "/v3/docs",
      specVersion: "3.0.1"
    }
  ],
  views: {
    root: `${rootDir}/../views`,
    viewEngine: "ejs"
  },
  exclude: [
    "**/*.spec.ts"
  ],
  adapters: {
    Adapter: FileSyncAdapter,
    lowdbDir: `${rootDir}/../.db`
  },
  oidc: {
    Accounts: Accounts,
    jwksPath: join(__dirname, "..", "keys", "jwks.json"),
    clients: [
      {
        client_name: "Oidc Admin",
        client_id: "client_id",
        client_secret: "client_secret",
        redirect_uris: [
          "http://localhost:3000",
          "http://0.0.0.0:3000",
          "http://localhost:8083"
        ],
        response_types: ["id_token"],
        grant_types: ["implicit"],
        token_endpoint_auth_method: "none",
        post_logout_redirect_uris: [
          "http://localhost:3000",
          "http://0.0.0.0:3000"
        ]
      }
    ],
    // responseTypes: [
    //   "code",
    //   "id_token",
    //   "id_token token",
    //   "code id_token",
    //   "code token",
    //   "code id_token token",
    //   "none"
    // ],
    claims: {
      openid: ["sub"],
      email: ["email", "email_verified"]
    },
    formats: {
      AccessToken: "jwt"
    },
    features: {
      // disable the packaged interactions
      devInteractions: {enabled: false},
      encryption: {enabled: true},
      introspection: {enabled: true},
      revocation: {enabled: true}
    }
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
  }
}
