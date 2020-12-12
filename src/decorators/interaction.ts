import {Controller} from "@tsed/common";
import {StoreMerge, useDecorators} from "@tsed/core";

export interface InteractionOptions {
  name: string,
  requestable?: boolean,
  priority?: number;
}

/**
 * @Oidc
 */
export function Interaction(options?: InteractionOptions): ClassDecorator {
  return useDecorators(Controller({
      path: "/",
      subType: "interaction"
    }),
    StoreMerge("interactionOptions", options)
  );
}
