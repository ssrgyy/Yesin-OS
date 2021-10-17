import { WindowId } from "../../Store/Reducers/windowManagerReducer/types";
import { Position, Size } from "../../types";
import { EventHandler } from "../../Events/types";
import { UpdateableComponent, ComponentUpdate } from "../../Component/Update/types";
import { ScreenPosSettings, ScreenSizeSettings, ThemeColorSettings, WindowBorderLengthSettings, WindowBorderRadiusSettings, WindowMinSizeSettings } from "../../Store/Reducers/systemSettingsReducer/types";
import { AppId } from "../App/types";

export interface WindowProps {
    id?: WindowId;
    appId?: AppId;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    contentWidth?: number;
    contentHeight?: number;
    minWidth?: number;
    minHeight?: number;
    minContentWidth?: number;
    minContentHeight?: number;
    maxContentWidth?: number;
    maxContentHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    name?: WindowName;
    isBackgroundTransparent?: boolean;
    frameColor?: string;
    isTest?: boolean;
}

export interface WindowStateSelectorResult extends UpdateableComponent {
    state: WindowState;
}

export interface WindowSettingsSelectorResult {
    windowBorderLengthsSettingsUpdate: ComponentUpdate;
    windowBorderLengthsSettings: WindowBorderLengthSettings;
    windowBorderRadiusSettingsUpdate: ComponentUpdate;
    windowBorderRadiusSettings: WindowBorderRadiusSettings;
    windowMinSizeSettingsUpdate: ComponentUpdate;
    windowMinSizeSettings: WindowMinSizeSettings;
}

export interface ThemeSettingsSelectorResult {
    themeColorSettingsUpdate: ComponentUpdate;
    themeColorSettings: ThemeColorSettings;
}

export interface ScreenSettingsSelectorResult {
    screenSizeSettingsUpdate: ComponentUpdate;
    screenSizeSettings: ScreenSizeSettings;
    screenPosSettingsUpdate: ComponentUpdate;
    screenPosSettings: ScreenPosSettings;
}

export interface WindowSelectorResult {
    stateSelectorResult: WindowStateSelectorResult;
    windowSettingsSelectorResult: WindowSettingsSelectorResult;
    themeSettingsSelectorResult: ThemeSettingsSelectorResult;
    screenSettingsSelectorResult: ScreenSettingsSelectorResult
}

export interface WindowDisposeHandlers {
    sizeboxMousemoveHandler?: EventHandler;
    sizeboxMouseupHandler?: EventHandler;
    panelActiveboxMousemoveHandler?: EventHandler;
    panelActiveboxMouseupHandler?: EventHandler;
}

export type WindowName = string;

export interface WindowBorderLengths {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

interface WindowModeState {
    pos: Position;
    size: Size;
}

export enum WindowModeType {
    Standard, Hidden, Full
}

interface PrevWindowMode {
    state: WindowModeState;
    type: WindowModeType;
}

export interface WindowMode {
    type: WindowModeType;
    prevMode: PrevWindowMode;
}

export interface WindowState {
    id: WindowId;
    appId: AppId;
    zIndex: number;
    name: WindowName;
    pos: Position;
    size: Size;
    contentSize: Size;
    minSize: Size;
    maxSize: Size;
    isActive: boolean;
    mode: WindowMode;
    isBackgroundTransparent: boolean;
    frameColor?: string;
}