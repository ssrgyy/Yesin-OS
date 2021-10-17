import { RGBObject } from "./types";

export const hasUndefinedeProperty = (object: any): boolean => {
    for (let key in object) {
        if (object[key] === undefined)
            return true;
    }

    return false;
}

export const hexToRgb = (hex :string): RGBObject | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}