import {Type} from "@tsed/core";
import {Constant, DI_PARAM_OPTIONS, Inject, Injectable, InjectorService} from "@tsed/di";
import {OidcAdapter} from "../adapters/OidcAdapter";
import {OidcMemoryAdapter} from "../adapters/OidcMemoryAdapter";

@Injectable()
export class OidcAdapterService {
  @Inject()
  injector: InjectorService;

  @Constant("oidc.adapter", OidcMemoryAdapter)
  protected adapter: Type<OidcAdapter<any>>;

  invokeAdapter<T>(collectionName: string, model: Type<any>) {
    const locals = new Map();
    locals.set(DI_PARAM_OPTIONS, {model, collectionName});

    return this.injector.invoke<OidcAdapter<T>>(this.adapter, locals);
  }

  createAdapterClass() {
    const self = this;
    return class Adapter {
      adapter: OidcAdapter<any>;

      constructor(protected name: string) {
        this.adapter = self.invokeAdapter<any>(name, Object);
      }

      async upsert(id: string, payload: any, expiresIn: number) {
        let expiresAt;

        if (expiresIn) {
          expiresAt = new Date(Date.now() + (expiresIn * 1000));
        }

        await this.adapter.upsert(id, payload, expiresAt);
      }

      async find(id: string) {
        return this.adapter.findById(id);
      }

      async findByUserCode(userCode: string) {
        return this.adapter.findOne({
          userCode
        });
      }

      async findByUid(uid: string) {
        return this.adapter.findOne({
          uid
        });
      }

      async destroy(id: string) {
        await this.adapter.deleteById(id);
      }

      async revokeByGrantId(grantId: string) {
        await this.adapter.deleteMany({grantId});
      }

      async consume(grantId: string) {
        await this.adapter.update(grantId, {consumed: Math.floor(Date.now() / 1000)});
      }
    };
  }
}