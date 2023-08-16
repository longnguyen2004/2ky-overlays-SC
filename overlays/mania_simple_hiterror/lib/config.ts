import { object, number, boolean, minValue, integer } from "valibot";
import { readConfig } from "config-reader";

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

export const config = await readConfig(validator);
