import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {AnyObject} from "oidc-provider";

export function Params(expression?: string): ParameterDecorator {
  return useDecorators(
    Context(["params", expression].filter(Boolean).join('.'))
  );
}

export type Params = AnyObject;