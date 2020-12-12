import {Provider} from "oidc-provider";

const testProvider = new Provider("https://op.example.com");

type Client = InstanceType<Provider["Client"]>;
type Interaction = InstanceType<Provider["Interaction"]>;

testProvider.Client.find = async () => {
  return <Client>{};
};

const find = (): Interaction => {
  return <Interaction>{};
}

find()