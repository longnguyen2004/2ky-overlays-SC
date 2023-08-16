import ReconnectingWebSocket, { type Options as WSOptions } from "reconnecting-websocket";
import { mergeAndConcat } from "merge-anything";
import { readable, type Readable } from "svelte/store";
import type { DeepPartial } from "ts-essentials";
import type { SCObject } from "./types.js";

type BulkTokenUpdateType = "MainPipeline" | "LiveTokens";

type Tokens = keyof SCObject;

type Options = {
    debug: boolean;
    bulkUpdates: BulkTokenUpdateType[];
    socket: WSOptions,
};

type SCStore<T extends Tokens = Tokens> = Readable<{
    values: Pick<SCObject, T>;
    changes?: Pick<SCObject, T>
}>;

const defaultParams: Options = {
    debug: false,
    bulkUpdates: [],
    socket: {
        maxReconnectionDelay: 1000,
        minReconnectionDelay: 1000
    },
};

export default function companion<T extends readonly Tokens[]>(
    host: string,
    tokens: T,
    options: DeepPartial<Options> = {}
) {
    const mergedParams = mergeAndConcat(defaultParams, options);
    return readable({ values: {} }, (set, update) => {
        const url = new URL(`ws://${host}/tokens`);
        if (options.bulkUpdates?.length)
        {
            url.searchParams.set("bulkupdates", [...new Set(options.bulkUpdates)].join(","));
        }
        const ws = new ReconnectingWebSocket(url.toString(), [], mergedParams.socket);

        ws.onopen = () => {
            ws.send(JSON.stringify(tokens));
        };
        ws.onmessage = (e) => {
            const changes = JSON.parse(e.data);
            update(({values}) => ({
                values: { ...values, ...changes },
                changes
            }));
        };
        
        return () => {
            set({ values: {} });
            ws.close();
        }
    }) as SCStore<T[number]>;
}

export * from "./enums.js";
export type { SCObject, SCStore, Tokens };
