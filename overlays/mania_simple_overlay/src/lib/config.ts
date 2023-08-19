import { union, object, literal, number, boolean, minValue, maxValue } from "valibot";
import { readConfig } from "config-reader";

const rgbValue = number("Color value isn't a number",
    [
        minValue(0, "Color value mustn't be less than 0"),
        maxValue(255, "Color value mustn't be greater than 255")
    ]
);

const validator = object({
    background: union([
        literal("black"),
        literal("white"),
        literal("gray")
    ], "Invalid color for background"),
    mapBackground: boolean(),
    l_r: rgbValue,
    l_g: rgbValue,
    l_b: rgbValue,
    left_box: union([
        literal("star"),
        literal("star_live"),
        literal("acc"),
        literal("combo")
    ], "Invalid choice for left_box"),
    r_r: rgbValue,
    r_g: rgbValue,
    r_b: rgbValue,
    right_box: union([
        literal("ur"),
        literal("pp")
    ], "Invalid choice for right_box"),
    simple: union([
        literal("off"),
        literal("on")
    ], 'simple must be "on" or "off"'),
    subtitle: union([
        literal("mapper"),
        literal("difficult"),
        literal("difficulty")
    ], "Invalid choice for subtitle")
});

export const config = await readConfig(validator);
