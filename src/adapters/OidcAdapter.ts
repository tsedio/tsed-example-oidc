import {nameOf, Type} from "@tsed/core";
import {Opts, UseOpts} from "@tsed/di";

export abstract class OidcAdapter<T> {
  protected model: Type<T>;
  protected collectionName: string;

  constructor(@Opts options: any) {
    this.model = options.model;
    this.collectionName = options.collectionName || nameOf(options.model);
  }

  abstract create(value: Partial<T>, expiresAt?: Date): Promise<T>;

  abstract update(id: string, value: T, expiresAt?: Date): Promise<T | undefined>;

  abstract updateOne(predicate: Partial<T>, value: T, expiresAt?: Date): Promise<T | undefined>;

  abstract upsert(id: string, value: T, expiresAt?: Date): Promise<T>;

  abstract findOne(predicate: Partial<T>): Promise<T | undefined> ;

  abstract findById(id: string): Promise<T | undefined> ;

  abstract findAll(predicate?: Partial<T>): Promise<T[]>;

  abstract deleteOne(predicate: Partial<T>): Promise<T | undefined>;

  abstract deleteMany(predicate: Partial<T>): Promise<T[]>;

  abstract deleteById(id: string): Promise<T | undefined>;

  getModel() {
    return (this.model as unknown) === Object ? this.model : undefined;
  }
}
