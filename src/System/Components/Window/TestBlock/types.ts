export interface TestBlockInputs {
    [key: string]: React.RefObject<HTMLInputElement>;
}

export interface TestBlockCreateWindowInputsData {
    nameInputRef: React.RefObject<HTMLInputElement>;
    leftInputRef: React.RefObject<HTMLInputElement>;
    topInputRef: React.RefObject<HTMLInputElement>;
    widthInputRef: React.RefObject<HTMLInputElement>;
    heightInputRef: React.RefObject<HTMLInputElement>;
}

export interface TestBlockCreateWindowNameInput
    extends TestBlockInputs, TestBlockCreateWindowInputsData {}

export enum TestBlockStatus {
    Ok = 'OK',
    InvalidData = 'Invalid data'
};

export enum TestBlockColor {
    Red = '#DC143C',
    Green = '#2E8B57',
    Blue = '#4169E1',
    Standard = 'Standard'
};