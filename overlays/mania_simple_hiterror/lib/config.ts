import { object, number, boolean, minValue, integer } from "valibot";
import { parse } from "jsonc-parser";
import { DEV } from "esm-env";

const validator = object({
    tickDuration: number(
        "Tick duration must be a number", [
            minValue(0, "Tick duration must be non-negative")
        ]
    ),
    avgWindow: number(
        "Averaging window must be a number", [
            integer("Averaging window must be an integer"),
            minValue(1, "Averaging window must be positive")
        ]
    ),
    colorful: boolean("Colorful switch must be true or false")
});

export const config = await fetch(`./config${DEV ? ".dev" : ""}.jsonc?t=${Date.now()}`) // cache busting
    .then(res => res.text())
    .then(parse)
    .then(obj => validator.parse(obj));
