import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";

export function Uid(): ParameterDecorator {
  return useDecorators(
    Context("uid")
  )
}

export type Uid = string