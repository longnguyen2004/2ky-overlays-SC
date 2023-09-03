import ReconnectingWebSocket, { type Options as WSOptions } from "reconnecting-websocket";
import { mergeAndConcat } from "merge-anything";
import { readable, type Readable } from "svelte/store";
import type { DeepPartial } from "ts-essentials";
import type { SCObject } from "./types.js";

type BulkTokenUpdateType = "MainPipeline" | "LiveTokens";

type Tokens = keyof SCObject;

type Options<T extends Tokens = Tokens> = {
    debug: boolean;
    bulkUpdates: BulkTokenUpdateType[];
    hooks: ((a: SCStoreValues<T>) => Pick<SCObject, T> | undefined)[];
    socket: WSOptions,
};

type SCStoreValues<T extends Tokens = Tokens> = {
    values: Pick<SCObject, T>;
    changes?: Pick<SCObject, T>;
};

type SCStore<T extends Tokens = Tokens> = Readable<SCStoreValues<T>>;

const defaultParams: Partial<Options> = {
    debug: false,
    socket: {
        maxReconnectionDelay: 1000,
        minReconnectionDelay: 1000
    },
};

export default function companion<T extends readonly Tokens[]>(
    host: string,
    tokens: T,
    options: Partial<Options<T[number]>> = {}
) {
    const mergedParams = mergeAndConcat(defaultParams, options);
    return readable({ values: {} }, (set, update) => {
        const url = new URL(`ws://${host}/tokens`);
        if (options.bulkUpdates?.length) {
            url.searchParams.set("bulkupdates", [...new Set(options.bulkUpdates)].join(","));
        }
        const ws = new ReconnectingWebSocket(url.toString(), [], mergedParams.socket);

        ws.onopen = () => {
            ws.send(JSON.stringify(tokens));
        };
        ws.onmessage = (e) => {
            let changes = JSON.parse(e.data);
            update(({ values }) => {
                for (const hook of options.hooks || [])
                {
                    changes = { ...changes, ...hook({ values: values as Pick<SCObject, T[number]>, changes }) };
                    values = {...values, ...changes};
                }
                return { values: { ...values, ...changes }, changes };
            });
        };

        return () => {
            set({ values: {} });
            ws.close();
        };
    }) as SCStore<T[number]>;
}

export * from "./enums.js";
export * from "./utils.js";
export type { SCObject, SCStore, Tokens };
