import {Context, Middleware} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import url from "url"

@Middleware()
export class OidcSecureMiddleware {
  use(@Context() ctx: Context) {
    const req = ctx.request;

    // TODO expose secure on PlatformRequest
    if (req.getRequest().secure) {
      if (req.method === "GET" || req.method === "HEAD") {
        ctx.response.redirect(302, url.format({
          protocol: "https",
          host: req.get("host"),
          pathname: req.url
        }));
      } else {
        throw new BadRequest('InvalidRequest', {
          error: "invalid_request",
          error_description: "do yourself a favor and only use https"
        })
      }
    }
  }
}