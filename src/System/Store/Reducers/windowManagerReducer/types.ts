import { ReactElement } from "react";
import { ComponentUpdate, UpdateableComponent } from "../../../Component/Update/types";
import { CoordinatesType, Position, Size, PositionType, SizeType } from "../../../types";
import { WindowBorderLengths, WindowMode, WindowModeType, WindowName, WindowProps, WindowState } from "../../../Components/Window/types";
import { AppId } from "../../../Components/App/types";

export interface WindowManagerState extends UpdateableComponent {
    windowList: WindowList;
    freeWindowIdList: WindowId[];
    appIdOfLastClosedWindow?: AppId;
    systemWindowBorderLengths: WindowBorderLengths;
    systemWindowMinSize: Size;
    systemWindowMaxSize: Size;
    screenSize: Size;
    screenPos: Position;
}

export type WindowId = number;
export type WindowList = (WindowData | undefined)[];
export type WindowComponent = ReactElement<WindowProps>;

export interface WindowData extends UpdateableComponent {
    component: WindowComponent;
    state: WindowState;
}

export interface WindowZindexSortData {
    windowId: WindowId;
    zIndex: number;
}

export interface WindowStateCreationProperties {
    id: WindowId;
    appId: AppId;
    zIndex?: number;
    name?: WindowName;
    pos?: Position;
    size?: Size;
    minSize?: Size;
    maxSize?: Size;
    isActive?: boolean;
    mode?: WindowMode;
    isBackgroundTransparent?: boolean;
    frameColor?: string;
}

export interface WindowDataCreateProperties {
    updateComponent?: ComponentUpdate;
    windowComponent: WindowComponent;
    windowStateCreationProperties: WindowStateCreationProperties;
}

export interface WindowPropsData {
    name: WindowName;
    pos: Position;
    size: Size;
    minSize: Size;
    maxSize: Size;
    isBackgroundTransparent: boolean;
}

export enum WindowManagerActionTypes {
    CLEAR_APP_ID_OF_LAST_CLOSED_WINDOW = 'CLEAR_APP_ID_OF_LAST_CLOSED_WINDOW',
    SET_SYSTEM_WINDOW_BORDER_LENGTHS = 'SET_SYSTEM_WINDOW_BORDER_LENGTHS',
    SET_SYSTEM_WINDOW_MIN_SIZE = 'SET_SYSTEM_WINDOW_MIN_SIZE',
    SET_SYSTEM_WINDOW_MAX_SIZE = 'SET_SYSTEM_WINDOW_MAX_SIZE',
    SET_SCREEN_POS = 'SET_SCREEN_POS',
    SET_SCREEN_SIZE = 'SET_SCREEN_SIZE',
    SET_WINDOW_MANAGER_VALUES = 'SET_WINDOW_MANAGER_VALUES',
    UPDATE = 'UPDATE',
    UPDATE_WINDOW = 'UPDATE_WINDOW',
    CREATE_WINDOWS_FROM_COMPONENT_LIST = "CREATE_WINDOWS_FROM_COMPONENT_LIST",
    CREATE_WINDOW = 'CREATE_WINDOW',
    SET_WINDOW_POS = 'SET_POS',
    SET_WINDOW_SIZE = 'SET_WINDOW_SIZE',
    SET_WINDOW_COORDS = 'SET_WINDOW_COORDS',
    SET_WINDOW_MIN_SIZE = 'SET_WINDOW_MIN_SIZE',
    SET_WINDOW_MAX_SIZE = 'SET_WINDOW_MAX_SIZE',
    SET_WINDOW_NAME = 'SET_WINDOW_NAME',
    SET_WINDOW_BACKGROUND_TRANSPARENT = 'SET_WINDOW_BACKGROUND_TRANSPARENT',
    SET_WINDOW_FRAME_COLOR = 'SET_WINDOW_FRAME_COLOR',
    ACTIVE_WINDOW = 'ACTIVE_WINDOW',
    CLOSE_WINDOW = 'CLOSE_WINDOW',
    SET_WINDOW_MODE = 'SET_WINDOW_MODE',
    RESET_WINDOW = 'RESET_WINDOW',
    RESET_ALL_WINDOWS = 'RESET_ALL_WINDOWS',
    ACTIVE_TOP_APP_WINDOWS = 'ACTIVE_TOP_APP_WINDOWS',
    SET_ALL_APP_WINDOWS_MODE = 'HIDE_ALL_APP_WINDOWS',
    RESET_ALL_APP_WINDOWS = 'RESET_ALL_APP_WINDOWS'
}

export interface WindowPayload {
    windowId: WindowId;
}

interface ClearAppIdOfLastClosedWindowAction {
    type: WindowManagerActionTypes.CLEAR_APP_ID_OF_LAST_CLOSED_WINDOW;
}

export type SetSystemWindowBorderLengthsPayload = WindowBorderLengths;

interface SetSystemWindowBorderLengthsAction {
    type: WindowManagerActionTypes.SET_SYSTEM_WINDOW_BORDER_LENGTHS,
    payload: SetSystemWindowBorderLengthsPayload;
}

export type SetSystemWindowMinSizePayload = Size;

interface SetSystemWindowMinSizeAction {
    type: WindowManagerActionTypes.SET_SYSTEM_WINDOW_MIN_SIZE;
    payload: SetSystemWindowMinSizePayload;
}

export type SetSystemWindowMaxSizePayload = Size;

interface SetSystemWindowMaxSizeAction {
    type: WindowManagerActionTypes.SET_SYSTEM_WINDOW_MAX_SIZE;
    payload: SetSystemWindowMaxSizePayload;
}


interface UpdateAction {
    type: WindowManagerActionTypes.UPDATE
}

export type UpdateWindowPayload = WindowId;

interface UpdateWindowAction {
    type: WindowManagerActionTypes.UPDATE_WINDOW,
    payload: UpdateWindowPayload;
}



export type SetScreenPosPayload = Position;

interface SetScreenPosAction {
    type: WindowManagerActionTypes.SET_SCREEN_POS;
    payload: SetScreenPosPayload;
}

export type SetScreenSizePayload = Size;

interface SetScreenSizeAction {
    type: WindowManagerActionTypes.SET_SCREEN_SIZE;
    payload: SetScreenSizePayload;
}

export interface CreateWindowsFromComponentListPayload {
    windowComponentList: WindowComponent[];
    appId: AppId;
}

interface CreateWindowsFromComponentListAction {
    type: WindowManagerActionTypes.CREATE_WINDOWS_FROM_COMPONENT_LIST;
    payload: CreateWindowsFromComponentListPayload;
}

export interface CreateWindowPayload extends WindowPayload {
    appId: AppId;
    name: WindowName;
    pos: Position;
    size: Size;
}

interface CreateWindowAction {
    type: WindowManagerActionTypes.CREATE_WINDOW,
    payload: CreateWindowPayload;
}

export interface SetWindowPosPayload extends WindowPayload {
    pos: PositionType;
}

interface SetWindowPosAction {
    type: WindowManagerActionTypes.SET_WINDOW_POS;
    payload: SetWindowPosPayload;
}

export interface SetWindowSizePayload extends WindowPayload {
    size: SizeType;
}

interface SetWindowSizeAction {
    type: WindowManagerActionTypes.SET_WINDOW_SIZE;
    payload: SetWindowSizePayload;
}

export interface SetWindowCoordsPayload extends WindowPayload {
    coords: CoordinatesType;
}

interface SetWindowCoordsAction {
    type: WindowManagerActionTypes.SET_WINDOW_COORDS;
    payload: SetWindowCoordsPayload;
}

export interface SetWindowMinSizePayload extends WindowPayload {
    minSize: Size;
}

interface SetWindowMinSizeAction {
    type: WindowManagerActionTypes.SET_WINDOW_MIN_SIZE;
    payload: SetWindowMinSizePayload;
}

export interface SetWindowNamePayload extends WindowPayload {
    name: string;
}

interface SetWindowNameAction {
    type: WindowManagerActionTypes.SET_WINDOW_NAME;
    payload: SetWindowNamePayload;
}

export interface SetWindowBackgroundTransparentPayload extends WindowPayload {
    isBackgroundTransparent: boolean;
}

interface SetWindowBackgroundTransparentAction {
    type: WindowManagerActionTypes.SET_WINDOW_BACKGROUND_TRANSPARENT;
    payload: SetWindowBackgroundTransparentPayload;
}

export interface SetWindowFrameColorPayload extends WindowPayload {
    frameColor?: string;
}

interface SetWindowFrameColorAction {
    type: WindowManagerActionTypes.SET_WINDOW_FRAME_COLOR;
    payload: SetWindowFrameColorPayload;
}

export interface SetWindowMaxSizePayload extends WindowPayload {
    maxSize: Size;
}

interface SetWindowMaxSizeAction {
    type: WindowManagerActionTypes.SET_WINDOW_MAX_SIZE;
    payload: SetWindowMaxSizePayload;
}

export type ActiveWindowPayload = WindowId;

interface ActiveWindowAction {
    type: WindowManagerActionTypes.ACTIVE_WINDOW;
    payload: ActiveWindowPayload;
}

export type CloseWindowPayload = WindowId;

interface CloseWindowAction {
    type: WindowManagerActionTypes.CLOSE_WINDOW;
    payload: CloseWindowPayload;
}

export interface SetWindowModePayload extends WindowPayload {
    windowModeType: WindowModeType;
}

interface SetWindowModeAction {
    type: WindowManagerActionTypes.SET_WINDOW_MODE;
    payload: SetWindowModePayload;
}

export type ResetWindowPayload = WindowId;

interface ResetWindowAction {
    type: WindowManagerActionTypes.RESET_WINDOW;
    payload: ResetWindowPayload;
}

interface ResetAllWindowsAction {
    type: WindowManagerActionTypes.RESET_ALL_WINDOWS;
}

export type ActiveTopAppWindowsPayload = AppId;

interface ActiveTopAppWindowsAction {
    type: WindowManagerActionTypes.ACTIVE_TOP_APP_WINDOWS;
    payload: ActiveTopAppWindowsPayload;
}

export interface SetAllAppWindowsModePayload {
    appId: AppId;
    windowModeType: WindowModeType;
}

interface SetAllAppWindowsModeAction {
    type: WindowManagerActionTypes.SET_ALL_APP_WINDOWS_MODE;
    payload: SetAllAppWindowsModePayload;
}

export type ResetAllAppWindowsPayload = AppId;

interface ResetAllAppWindowsAction {
    type: WindowManagerActionTypes.RESET_ALL_APP_WINDOWS;
    payload: ResetAllAppWindowsPayload;
}

export type WindowManagerAction =
    UpdateAction
    | UpdateWindowAction
    | SetSystemWindowBorderLengthsAction
    | SetSystemWindowMinSizeAction
    | SetSystemWindowMaxSizeAction
    | SetScreenSizeAction
    | SetScreenPosAction
    | CreateWindowsFromComponentListAction
    | CreateWindowAction
    | SetWindowPosAction
    | SetWindowSizeAction 
    | SetWindowCoordsAction
    | SetWindowMinSizeAction
    | SetWindowMaxSizeAction
    | SetWindowNameAction
    | SetWindowBackgroundTransparentAction
    | SetWindowFrameColorAction
    | ActiveWindowAction
    | CloseWindowAction
    | ClearAppIdOfLastClosedWindowAction
    | SetWindowModeAction
    | ResetWindowAction
    | ResetAllWindowsAction
    | ActiveTopAppWindowsAction
    | SetAllAppWindowsModeAction
    | ResetAllAppWindowsAction;