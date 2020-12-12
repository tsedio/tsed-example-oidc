import {Context, UseBeforeEach} from "@tsed/common";

export class NoCacheMiddleware {
  use(@Context() ctx: Context) {
    ctx.response.setHeader('Pragma', 'no-cache');
    ctx.response.setHeader('Cache-Control', 'no-cache, no-store');
  }
}

export function NoCache(): ClassDecorator {
  return UseBeforeEach(NoCacheMiddleware) as ClassDecorator;
}