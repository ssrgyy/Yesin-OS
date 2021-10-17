import { MathChars } from "./types";

export const createMathCharsTemplate = (mathChars: MathChars): string => {
    let resultStr: string = '';

    for (let key in mathChars)
        resultStr += mathChars[key];
    
    return resultStr;
}

export const mathFilterInputValue = (value: string, mathCharsTemplate: string): string => {
    let resultValue: string = '';
        
    for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < mathCharsTemplate.length; j++) {
            if (value[i] === mathCharsTemplate[j]) {
                resultValue += value[i];
                break;
            }
        }
    }

    return resultValue;
}

export const hasMathChar = (value: string, mathCharsTemplate: string): boolean => {
    for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < mathCharsTemplate.length; j++) {
            if (value[i] === mathCharsTemplate[j])
                return true;
        }
    }

    return false;
}