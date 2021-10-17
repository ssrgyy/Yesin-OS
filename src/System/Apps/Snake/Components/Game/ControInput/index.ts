import { ControlInput, ControlInputs, InputCode } from "./types";

export const controlInputs: ControlInputs = {
    right: ['KeyD', 'ArrowRight'],
    left: ['KeyA', 'ArrowLeft'],
    down: ['KeyS', 'ArrowDown'],
    up: ['KeyW', 'ArrowUp']
};

export const isControlInputActive = (controlInput: ControlInput, inputCode: InputCode): boolean => (
    controlInput.some(value => value === inputCode)
);