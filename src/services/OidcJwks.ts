import {Constant, Injectable} from "@tsed/di";
import {ensureDirSync, existsSync, readFileSync, writeFileSync} from "fs-extra";
import {join, dirname} from "path";

const jose = require("jose");

@Injectable()
export class OidcJwks {
  @Constant("oidc.jwksPath", join(process.cwd(), "keys", "jwks.json"))
  jwksPath: string;

  keys: string;

  async $onInit() {
    return this.getJwks();
  }

  exists() {
    return existsSync(this.jwksPath);
  }

  async generate() {
    const keystore = new jose.JWKS.KeyStore();

    await Promise.all([
      keystore.generate("RSA", 2048, {use: "sig"}),
      keystore.generate("RSA", 2048, {use: "enc"}),
      keystore.generate("EC", "P-256", {use: "sig"}),
      keystore.generate("EC", "P-256", {use: "enc"}),
      keystore.generate("OKP", "Ed25519", {use: "sig"})
    ]);

    ensureDirSync(dirname(this.jwksPath));
    writeFileSync(this.jwksPath, JSON.stringify(keystore.toJWKS(true), null, 2));
  }

  async getJwks() {
    if (!this.exists()) {
      await this.generate();
    }

    return JSON.parse(readFileSync(this.jwksPath, {encoding: "utf-8"}));
  }
}
