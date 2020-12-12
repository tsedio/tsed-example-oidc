import {Configuration, Controller, UseBefore} from "@tsed/common";
import {Type, useDecorators} from "@tsed/core";
import {OidcInteractionMiddleware} from "../middlewares/OidcInteractionMiddleware";
import {NoCache} from "./noCache";

export interface InteractionsOptions {
  path?: string;
  children: Type<any>[];
}

export function Interactions(options: InteractionsOptions): ClassDecorator {
  const path = options.path || "/interaction";
  return useDecorators(
    Controller(path, ...options.children),
    NoCache(),
    UseBefore(OidcInteractionMiddleware),
    Configuration({
      oidc: {
        options: {
          interactions: {
            url(ctx: any, interaction: any) { // eslint-disable-line no-unused-vars
              return `${path}/${ctx.oidc.uid}`;
            }
          }
        }
      }
    })
  );
}