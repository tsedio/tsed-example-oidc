import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import Provider from "oidc-provider";

/**
 * @decorator
 */
export function OidcSession(expression?: string): ParameterDecorator {
  return useDecorators(
    Context(["session", expression].filter(Boolean).join("."))
  );
}

export type OidcSession = InstanceType<Provider["Session"]>;