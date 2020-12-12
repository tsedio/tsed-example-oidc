import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {OidcInteractionContext} from "../services/OidcInteractionContext";

export function OidcCtx(): ParameterDecorator {
  return useDecorators(
    Context(["interactionContext"].filter(Boolean).join("."))
  );
}

export type OidcCtx = OidcInteractionContext;