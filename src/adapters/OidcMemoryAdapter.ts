import {deepClone, nameOf, Type} from "@tsed/core";
import {Injectable, Opts, ProviderScope, Scope, UseOpts} from "@tsed/di";
import {deserialize, serialize} from "@tsed/json-mapper";
import {v4 as uuid} from "uuid";
import {OidcAdapter} from "./OidcAdapter";

export interface OidcAdapterMemoryModel {
  _id: string;
  expiresAt?: Date;
}

function match(obj: any, predicate: any, model?: Type<any>) {
  predicate = deserialize(predicate, {type: model, useAlias: true});

  for (const [k, v] of Object.entries(predicate)) {
    if (v !== undefined && obj[k] !== v) {
      return false;
    }
  }

  return true;
}

function createInstance(obj: any = {}, model?: Type<any>) {
  return deserialize(deepClone(obj), {
    type: model,
    useAlias: true
  });
}

function updateInstance(src: any, payload: any, model?: Type<any>) {
  return Object.assign({
    ...serialize(src, {type: model, useAlias: true}),
    ...payload
  });
}

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class OidcMemoryAdapter<T extends OidcAdapterMemoryModel> extends OidcAdapter<T> {
  protected collection: T[] = [];
  protected model: Type<T>;

  public async create(payload: Partial<T>, expiresAt?: Date): Promise<T> {
    const {collection} = this;

    if (expiresAt) {
      payload.expiresAt = expiresAt;
    }

    payload._id = uuid();

    const instance = createInstance(payload, this.getModel());

    collection.push(instance);

    return instance;
  }

  public async upsert(id: string, payload: T, expiresAt?: Date): Promise<T> {
    let item = await this.findById(id);

    if (!item) {
      return this.create({...payload, _id: id, expiresAt});
    }

    return (await this.update(id, payload, expiresAt)) as T;
  }

  public async update(id: string, payload: T, expiresAt?: Date): Promise<T | undefined> {
    return this.updateOne({_id: id}, payload, expiresAt)
  }

  public async updateOne(predicate: Partial<T & any>, payload: T, expiresAt?: Date): Promise<T | undefined> {
    const index = this.collection.findIndex((obj) => match(obj, predicate, this.getModel()));

    if (index === -1) {
      return;
    }

    this.collection[index] = updateInstance(this.collection[index], payload, this.getModel());

    return createInstance(this.collection[index], this.getModel());
  }

  public async findOne(predicate: Partial<T & any>): Promise<T | undefined> {
    const item = this.collection.find((obj) => match(obj, predicate, this.getModel()));

    return item ? createInstance(item, this.getModel()) : null;
  }


  public findById(_id: string): Promise<T | undefined> {
    return this.findOne({_id});
  }

  public async findAll(predicate: Partial<T & any> = {}): Promise<T[]> {
    return this.collection
      .filter((obj) => match(obj, predicate, this.getModel()))
      .map((obj) => createInstance(obj, this.getModel()));
  }

  public async deleteOne(predicate: Partial<T & any>): Promise<T | undefined> {
    let removedItem: T | undefined = undefined;

    this.collection = this.collection.filter((obj) => {
      if (match(obj, predicate) && !removedItem) {
        removedItem = obj;
        return false;
      }

      return true;
    });

    return removedItem;
  }

  public async deleteById(_id: string): Promise<T | undefined> {
    return this.deleteOne({_id} as any);
  }

  public async deleteMany(predicate: Partial<T>): Promise<T[]> {
    let removedItems: T[] = [];

    this.collection = this.collection.filter((obj) => {
      if (match(obj, predicate)) {
        removedItems.push(createInstance(obj, this.getModel()));
        return false;
      }

      return true;
    });

    return removedItems;
  }
}
