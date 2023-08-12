import ReconnectingWebSocket, { type Options as WSOptions } from "reconnecting-websocket";
import { mergeAndConcat } from "merge-anything";
import type { DeepPartial } from "ts-essentials";
import type { Readable } from "svelte/store";
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
    changes: Pick<SCObject, T> | null
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
    type StrictStore = SCStore<T[number]>;
    type Subscriber = Parameters<StrictStore["subscribe"]>[0];
    type Values = Parameters<Subscriber>[0]["values"];

    const mergedParams = mergeAndConcat(options, defaultParams);
    const subscribers = new Set<Subscriber>();

    function callSubscribers() {
        for (const sub of subscribers)
            sub({ values, changes });
    }

    let values = {} as Values;
    let changes: Values | null = null;

    const url = new URL(`ws://${host}/tokens`);
    if (options.bulkUpdates?.length)
    {
        url.searchParams.set("bulkupdates", [...new Set(options.bulkUpdates)].join(","));
    }
    const ws = new ReconnectingWebSocket(url.toString(), [], {
        ...mergedParams.socket,
        startClosed: true
    });

    ws.onopen = () => {
        ws.send(JSON.stringify(tokens));
    };
    ws.onmessage = (e) => {
        changes = JSON.parse(e.data);
        values = { ...values, ...changes };
        callSubscribers();
    };
    ws.onclose = () => {
        values = {} as Values;
    };

    return {
        subscribe: (cb) => {
            subscribers.add(cb);
            if (ws.readyState === ws.CLOSED)
                ws.reconnect();
            cb({ values, changes: null });

            return () => {
                subscribers.delete(cb);
                if (subscribers.size === 0)
                    ws.close();
            };
        }
    } as StrictStore;
}

export * from "./enums.js";
export type { SCObject, SCStore, Tokens };
