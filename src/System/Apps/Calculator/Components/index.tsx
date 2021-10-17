import css from "./CSS/calculator.module.css";
import React, { CSSProperties, useRef, useMemo, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "../../../Store/Reducers";
import { ThemeSettingsSelectorResult } from "./types";
import { createMathCharsTemplate, hasMathChar, mathFilterInputValue } from "./InputFilter";
import { mathNumbers, mathSigns } from "./MathSigns";

const scalc: (value: string) => string | undefined = require('scalc');
const calculateErrorResult: string = 'Ошибка';

export const Calculator: React.FC = () => {
    const {themeColorSettings}: ThemeSettingsSelectorResult = useSelector(createSelector(
        (rootState: RootState) => rootState.systemSettings.theme.settings.color.updateComponent,
        (rootState: RootState) => rootState.systemSettings.theme.settings.color,
        (colorUpdate, color): ThemeSettingsSelectorResult => ({
            themeColorSettingsUpdate: colorUpdate,
            themeColorSettings: color
        })
    ));

    const themeColorStyle:CSSProperties = {
        backgroundColor: themeColorSettings.value
    };

    const inputRef = useRef<HTMLInputElement>(null);
    const mathCharsFilterTemplate = useMemo<string>(() => createMathCharsTemplate({...mathSigns, ...mathNumbers}), []);
    const mathSignsFilterTemplate = useMemo<string>(() => createMathCharsTemplate({...mathSigns, decimalPoint: ''}), []);

    useEffect(() => {
        document.addEventListener('keydown', documentKeydownHandler);
        return () => document.removeEventListener('keydown', documentKeydownHandler);
    }, []);

    const documentKeydownHandler = useCallback((event: KeyboardEvent) => {
        if (event.code === 'NumpadEnter' || event.code === 'Equal')
            calculateHandler();
    }, []);

    const inputInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value = mathFilterInputValue(event.target.value, mathCharsFilterTemplate);
    }

    const clearButtonHandler = () => {
        if (!inputRef.current)
            return;

        inputRef.current.value = '';
        inputRef.current.focus();
    }

    const deleteButtonHandler = () => {
        if (!inputRef.current)
            return;

        const {current: input} = inputRef;

        if (input.value.length > 0)
            input.value = input.value.substr(0, input.value.length - 1);

        input.focus();
    }

    const activeButtonHandler = (sign: string) => {
        if (!inputRef.current)
            return;

        const {current: input} = inputRef;
        
        input.value = mathFilterInputValue(input.value + sign, mathCharsFilterTemplate);
        input.focus();
    }

    const calculateHandler = () => {
        if (!inputRef.current)
            return;

        let inputValue: string = inputRef.current.value;
        let resultValue: string | undefined = undefined;

        if (hasMathChar(inputValue, mathSignsFilterTemplate)) {
            try {
                resultValue = scalc(inputValue);
            }
            catch (e) {}
        }

        if (resultValue == undefined)
            resultValue = calculateErrorResult;

        inputRef.current.value = resultValue;
    }
    
    return (
        <div className={css.calculator}>
            <div className={css.calculate_block}>
                <div className={css.input_block}>
                    <input type="text"
                        className={css.calculate_input}
                        placeholder={mathNumbers.number0}
                        onInput={inputInputHandler}
                        ref={inputRef} />
                </div>
            </div>
            <div className={css.buttons_block}>
                <div className={css.clear_buttons}>
                    <button onClick={clearButtonHandler}>C</button>
                    <button onClick={deleteButtonHandler}>Del</button>
                </div>
                <div className={css.mathbuttons}>
                    <div className={css.main_mathbuttons}>
                        <div
                            style={themeColorStyle}
                            className={css.mathsign_block}
                        >
                            <button onClick={activeButtonHandler.bind(null, mathSigns.leftParenthesis)}>(</button>
                            <button onClick={activeButtonHandler.bind(null, mathSigns.rightParenthesis)}>)</button>
                            <button onClick={activeButtonHandler.bind(null, mathSigns.exponentiation)}>^</button>
                        </div>
                        <div>
                            <button onClick={activeButtonHandler.bind(null, mathNumbers.number7)}>7</button>
                            <button onClick={activeButtonHandler.bind(null, mathNumbers.number8)}>8</button>
                            <button onClick={activeButtonHandler.bind(null, mathNumbers.number9)}>9</button>
                        </div>
                        <div>
                            <button onClick={activeButtonHandler.bind(null, mathNumbers.number4)}>4</button>
                            <button onClick={activeButtonHandler.bind(null, mathNumbers.number5)}>5</button>
                            <button onClick={activeButtonHandler.bind(null, mathNumbers.number6)}>6</button>
                        </div>
                        <div>
                            <button onClick={activeButtonHandler.bind(null, mathNumbers.number1)}>1</button>
                            <button onClick={activeButtonHandler.bind(null, mathNumbers.number2)}>2</button>
                            <button onClick={activeButtonHandler.bind(null, mathNumbers.number3)}>3</button>
                        </div>
                        <div>
                            <button id={css.zero_button} onClick={activeButtonHandler.bind(null, mathNumbers.number0)}>0</button>
                            <button onClick={activeButtonHandler.bind(null, mathSigns.decimalPoint)}>.</button>
                        </div>
                    </div>
                    <div
                        style={themeColorStyle}
                        className={css.additional_mathbuttons}
                    >
                        <button onClick={activeButtonHandler.bind(null, mathSigns.dividedBy)}>/</button>
                        <button onClick={activeButtonHandler.bind(null, mathSigns.times)}>x</button>
                        <button onClick={activeButtonHandler.bind(null, mathSigns.minus)}>-</button>
                        <button onClick={activeButtonHandler.bind(null, mathSigns.plus)}>+</button>
                        <button onClick={calculateHandler} id={css.equals_button}>=</button>
                    </div>
                </div>
            </div>
        </div>
    );
}