import { union, string, object, array, literal, number, minValue } from "valibot";
import { parse } from "jsonc-parser";

const validator = object({
    current: string(),
    servers: array(
        union([
            object({
                name: string(),
                type: literal("osu_v1"),
                endpoint: string(),
                api_key: string()
            }),
            object({
                name: string(),
                type: literal("osu_v2"),
                endpoint: string(),
                auth_endpoint: string(),
                client_id: string(),
                client_secret: string()
            }),
            object({
                name: string(),
                type: literal("akatsuki_v1"),
                endpoint: string()
            })
        ])
    ),
    card: object({
        count: number([minValue(6)]),
        width: number([minValue(263)]),
        height: number([minValue(88)]),
        gap: number([minValue(0)])
    })
});

export const config = await fetch(`./config.jsonc?t=${Date.now()}`) // cache busting
    .then(res => res.text())
    .then(text => parse(text))
    .then(obj => validator.parse(obj))
