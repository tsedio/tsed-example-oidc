import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {PromptDetail as P} from "oidc-provider";

export function Prompt(): ParameterDecorator {
  return useDecorators(
    Context("prompt")
  );
}

export type Prompt = P;
