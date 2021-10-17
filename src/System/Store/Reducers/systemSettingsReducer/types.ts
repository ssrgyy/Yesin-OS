import { UpdateableComponent } from "../../../Component/Update/types";
import { Position, Size } from "../../../types";
import { WindowBorderLengths } from "../../../Components/Window/types";

export interface WindowBorderLengthSettings extends UpdateableComponent {
    value: WindowBorderLengths;
}

export interface WindowBorderRadiusSettings extends UpdateableComponent {
    value: number;
}

export interface WindowMinSizeSettings extends UpdateableComponent {
    value: Size;
}

export interface WindowMaxSizeSettings extends UpdateableComponent {
    value: Size;
}

export interface WindowSettings {
    borderLengths: WindowBorderLengthSettings;
    borderRadius: WindowBorderRadiusSettings;
    minSize: WindowMinSizeSettings;
    maxSize: WindowMaxSizeSettings;
}

export interface WindowSettingsNode extends UpdateableComponent {
    settings: WindowSettings;
}

export interface ThemeColorSettings extends UpdateableComponent {
    value: string;
}

export interface ThemeSettings {
    color: ThemeColorSettings;
}

export interface ThemeSettingsNode extends UpdateableComponent {
    settings: ThemeSettings;
}

export interface ScreenPosSettings extends UpdateableComponent {
    value: Position;
}

export interface ScreenSizeSettings extends UpdateableComponent {
    value: Size;
}

export interface ScreenSettings {
    pos: ScreenPosSettings;
    size: ScreenSizeSettings;
}

export interface ScreenSettingsNode extends UpdateableComponent {
    settings: ScreenSettings;
}

export interface SystemSettingsState extends UpdateableComponent {
    window: WindowSettingsNode;
    theme: ThemeSettingsNode;
    screen: ScreenSettingsNode;
}

export enum SystemSettingsActionTypes {
    SET_WINDOW_BORDER_LENGTHS = 'SET_WINDOW_BORDER_LENGTHS',
    SET_WINDOW_BORDER_RADIUS = 'SET_WINDOW_BORDER_RADIUS',
    SET_WINDOW_MIN_SIZE = 'SET_WINDOW_MIN_SIZE',
    SET_WINDOW_MAX_SIZE = 'SET_WINDOW_MAX_SIZE',
    SET_THEME_COLOR = 'SET_THEME_COLOR',
    SET_SCREEN_POS = 'SET_SCREEN_POS',
    SET_SCREEN_SIZE = 'SET_SCREEN_SIZE'
}

export type SetWindowBorderLengthsPayload = WindowBorderLengths;

interface SetWindowBorderLengthsAction {
    type: SystemSettingsActionTypes.SET_WINDOW_BORDER_LENGTHS,
    payload: SetWindowBorderLengthsPayload;
}

export type SetWindowBorderRadiusPayload = number;

interface SetWindowBorderRadiusAction {
    type: SystemSettingsActionTypes.SET_WINDOW_BORDER_RADIUS,
    payload: SetWindowBorderRadiusPayload;
}

export type SetWindowMinSizePayload = Size;

interface SetWindowMinSizeAction {
    type: SystemSettingsActionTypes.SET_WINDOW_MIN_SIZE;
    payload: SetWindowMinSizePayload;
}

export type SetWindowMaxSizePayload = Size;

interface SetWindowMaxSizeAction {
    type: SystemSettingsActionTypes.SET_WINDOW_MAX_SIZE;
    payload: SetWindowMaxSizePayload;
}

export type SetThemeColorPayload = string;

interface SetThemeColorAction {
    type: SystemSettingsActionTypes.SET_THEME_COLOR
    payload: SetThemeColorPayload;
}

export type SetScreenPosPayload = Position;

interface SetScreenPosAction {
    type: SystemSettingsActionTypes.SET_SCREEN_POS;
    payload: SetScreenPosPayload;
}

export type SetScreenSizePayload = Size;

interface SetScreenSizeAction {
    type: SystemSettingsActionTypes.SET_SCREEN_SIZE;
    payload: SetScreenSizePayload;
}

export type SystemSettingsAction =
    SetWindowBorderLengthsAction
    | SetWindowBorderRadiusAction
    | SetWindowMinSizeAction
    | SetWindowMaxSizeAction
    | SetThemeColorAction
    | SetScreenPosAction
    | SetScreenSizeAction;