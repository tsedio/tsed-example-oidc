import {Constant, Controller, Get, HeaderParams, View} from "@tsed/common";
import {OidcSettings} from "@tsed/oidc-provider";
import {Returns} from "@tsed/schema";
import {Hidden, SwaggerSettings} from "@tsed/swagger";
import qs from "querystring";

@Hidden()
@Controller("/")
export class IndexCtrl {
  @Constant("swagger")
  swagger: SwaggerSettings[];

  @Constant("oidc")
  oidc: OidcSettings;

  @Get("/")
  @View("index.ejs")
  @(Returns(200, String).ContentType("text/html"))
  get(@HeaderParams("x-forwarded-proto") protocol: string, @HeaderParams("host") host: string) {
    const hostUrl = `${protocol || "http"}://${host}`;

    return {
      BASE_URL: hostUrl,
      clients: this.oidc.clients!.map((client) => {
        const params = qs.stringify({
          client_id: client.client_id,
          response_type: client.response_types![0],
          scope: "openid email",
          nonce: "foobar",
          prompt: "login",
          redirect_uri: client.redirect_uris[0]
        });

        return {
          ...client,
          cta_url: `${hostUrl}/auth?${params}`
        };
      }),
      docs: this.swagger.map((conf) => {
        return {
          url: hostUrl + conf.path,
          ...conf
        };
      })
    };
  }
}
