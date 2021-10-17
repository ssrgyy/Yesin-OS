export type InputCode = string;
export type ControlInput = InputCode[];

export interface ControlInputs {
    right: InputCode[];
    left: InputCode[];
    down: InputCode[];
    up: InputCode[];
}