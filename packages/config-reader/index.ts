import { type BaseSchema, type BaseSchemaAsync, type Output } from "valibot";
import { DEV } from "esm-env";
import { parse } from "jsonc-parser";

export async function readConfig<T extends BaseSchema | BaseSchemaAsync>(schema: T)
{
    const now = Date.now();
    let configPromise = fetch(`./config.jsonc?t=${now}`).then(res => res.text());
    if (DEV)
    {
        const res = await fetch(`./config.dev.jsonc?t=${now}`);
        if (res.ok)
            configPromise = res.text();
    }
    return await configPromise
        .then(parse)
        .then(text => schema.parse(text)) as Output<T>;
}
