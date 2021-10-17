import { MathChars } from "../InputFilter/types";

export interface MathNumbers {
    readonly number0: string;
    readonly number1: string;
    readonly number2: string;
    readonly number3: string;
    readonly number4: string;
    readonly number5: string;
    readonly number6: string;
    readonly number7: string;
    readonly number8: string;
    readonly number9: string;
}

export interface MathSigns {
    readonly plus: string
    readonly minus: string;
    readonly times: string;
    readonly dividedBy: string;
    readonly decimalPoint: string;
    readonly exponentiation: string;
    readonly leftParenthesis: string;
    readonly rightParenthesis: string;
}