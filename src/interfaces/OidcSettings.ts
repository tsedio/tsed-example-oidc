import {Type} from "@tsed/core";
import {ClientMetadata, Configuration} from "oidc-provider";

export interface OidcSettings {
  /**
   * Issuer URI. By default Ts.ED create issuer with http://localhost:${httpPort}
   */
  issuer?: string;
  /**
   * Secure keys
   */
  secureKey?: string[];
  /**
   *
   */
  proxy?: boolean;
  /**
   *
   */
  clients?: ClientMetadata[];
  /**
   *
   */
  options?: Configuration;
  /**
   *
   */
  interactions?: Type<any>[]
}

declare global {
  namespace TsED {
    interface Configuration {
      oidc: OidcSettings;
    }
  }
}
