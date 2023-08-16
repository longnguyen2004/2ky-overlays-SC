import { type BaseSchema, type BaseSchemaAsync, type Output } from "valibot";
export declare function readConfig<T extends BaseSchema | BaseSchemaAsync>(schema: T): Promise<Output<T>>;
