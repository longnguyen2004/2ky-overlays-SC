import ReconnectingWebSocket, { type Options as WSOptions } from "reconnecting-websocket";
import { mergeAndConcat } from "merge-anything";
import type { DeepPartial } from "ts-essentials";
import type { SCObject } from "./types.js";

type BulkTokenUpdateType = "MainPipeline" | "LiveTokens";

type Tokens = keyof SCObject;

type Options = {
    debug: boolean;
    bulkUpdates: BulkTokenUpdateType[];
    socket: WSOptions,
};

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
    type SCObjectPicked = Pick<SCObject, T[number]>;
    type Callback = (obj: { values: SCObjectPicked, changes: SCObjectPicked | null; }) => void;

    const mergedParams = mergeAndConcat(options, defaultParams);
    const subscribers = new Set<Callback>();

    function callSubscribers() {
        for (const sub of subscribers)
            sub({ values, changes });
    }

    let values = {} as SCObjectPicked;
    let changes: SCObjectPicked | null = null;

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
        values = {} as SCObjectPicked;
    };

    return {
        subscribe: (cb: Callback) => {
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
    };
}

export * from "./enums.js";
export type { SCObject, Tokens };
