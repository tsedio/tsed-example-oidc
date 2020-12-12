import {registerProvider} from "@tsed/di";
import Provider from "oidc-provider";
import {OidcProviderService} from "./OidcProviderService";

registerProvider({
  provide: Provider,
  deps: [OidcProviderService],
  useFactory(oidcProviderService: OidcProviderService) {
    const get = () => {
      return oidcProviderService.raw;
    };
    const itsOwnProp = (target: any, p: PropertyKey) => Reflect.has(target, p) || typeof p === "symbol";

    const target = {
      async $onInit() {
        await oidcProviderService.create();
      }
    };

    return new Proxy<any>(target, {
      getOwnPropertyDescriptor(target: any, p: PropertyKey): PropertyDescriptor | undefined {
        const service = get();
        return Reflect.getOwnPropertyDescriptor(target, p) || Reflect.getOwnPropertyDescriptor(service, p);
      },

      has(target: any, p: PropertyKey): boolean {
        const service = get();

        if (itsOwnProp(target, p) || itsOwnProp(service, p)) {
          return Reflect.has(target, p) || Reflect.has(service, p);
        }

        return false;
      },

      get(target: any, p: PropertyKey, receiver: any): any {
        const service = get();

        if (itsOwnProp(target, p) || itsOwnProp(service, p)) {
          return Reflect.get(target, p, receiver) || Reflect.get(service, p, receiver);
        }

        return undefined;
      },

      set(target: any, p: PropertyKey, value: any, receiver: any): boolean {
        const service = get();

        if (itsOwnProp(service, p)) {
          return Reflect.set(service, p, value, receiver);
        }

        return false;
      },

      deleteProperty(target: any, p: PropertyKey): boolean {
        const service = get();

        if (itsOwnProp(service, p)) {
          return Reflect.deleteProperty(service, p);
        }

        return false;
      },

      defineProperty(target: any, p: PropertyKey, attributes: PropertyDescriptor): boolean {
        const service = get();

        return Reflect.defineProperty(service, p, attributes);
      },

      ownKeys(): PropertyKey[] {
        const service = get();

        return Reflect.ownKeys(service);
      }
    });
  }
});