import React from "react";
import { updateComponent } from "../../../Component/Update";
import { WindowData, CreateWindowPayload, SetWindowCoordsPayload, SetWindowModePayload, SetWindowNamePayload, SetWindowPosPayload, SetWindowSizePayload, WindowId, WindowList, WindowManagerAction, WindowManagerActionTypes, WindowManagerState, SetSystemWindowMinSizePayload, SetSystemWindowMaxSizePayload, SetWindowMinSizePayload, SetWindowMaxSizePayload, SetScreenPosPayload, SetScreenSizePayload, CreateWindowsFromComponentListPayload, SetSystemWindowBorderLengthsPayload, UpdateWindowPayload, ActiveWindowPayload, CloseWindowPayload, WindowDataCreateProperties, WindowStateCreationProperties, WindowPropsData, SetWindowBackgroundTransparentPayload, SetWindowFrameColorPayload, SetAllAppWindowsModePayload, WindowZindexSortData, ResetWindowPayload, ResetAllAppWindowsPayload } from "./types";
import { WindowModeType, WindowProps, WindowState } from "../../../Components/Window/types";
import { Position, instanceOfPosition, instanceOfPositionLeft, instanceOfPositionTop, Size, instanceOfSize, instanceOfSizeWidth, instanceOfSizeHeight, instanceOfCoordinates, instanceOfCoordinatesPos, instanceOfCoordinatesSize, ExplicitCoordinates } from "../../../types";
import { initialWindowState } from "../../../Components/Window";
import { initialSystemSettingsState } from "../systemSettingsReducer";
import { AppId } from "../../../Components/App/types";

export const initialWindowManagerState: WindowManagerState = {
    updateComponent: {},
    windowList: [],
    freeWindowIdList: [],
    systemWindowBorderLengths: {...initialSystemSettingsState.window.settings.borderLengths.value},
    systemWindowMinSize: {...initialSystemSettingsState.window.settings.minSize.value},
    systemWindowMaxSize: {...initialSystemSettingsState.window.settings.maxSize.value},
    screenSize: {...initialSystemSettingsState.screen.settings.size.value},
    screenPos: {...initialSystemSettingsState.screen.settings.pos.value}
};

export const isWindowExist = (windowList: WindowList, windowId: WindowId): boolean => (
    windowList[windowId] != undefined
);

export const calculateTopWindow = (windowList: WindowList): WindowId | undefined => {
    let maxZindex: number | undefined = undefined;
    let newWindowId: WindowId | undefined = undefined;

    windowList.forEach((window, index) => {
        if (!window)
            return;

        const {zIndex} = window.state;

        if (maxZindex == undefined ||
            maxZindex != undefined && maxZindex < zIndex) {
            maxZindex = zIndex;
            newWindowId = index;
        }
    });

    return newWindowId;
}

export const calculateTopAppWindow = (windowList: WindowList, appId: AppId): WindowId | undefined => {
    let maxZindex: number | undefined = undefined;
    let newWindowId: WindowId | undefined = undefined;

    windowList.forEach((window, index) => {
        if (!window)
            return;

        if (window.state.appId !== appId)
            return;

        const {zIndex} = window.state;

        if (maxZindex == undefined ||
            maxZindex != undefined && maxZindex < zIndex) {
            maxZindex = zIndex;
            newWindowId = index;
        }
    });

    return newWindowId;
}

export const calculatePrevTopWindow = (windowList: WindowList): WindowId | undefined => {
    const zIndexSortData: WindowZindexSortData[] = [];

    windowList.forEach(window => {
        if (!window)
            return;

        zIndexSortData.push({
            windowId: window.state.id,
            zIndex: window.state.zIndex
        })
    });

    if (zIndexSortData.length < 2)
        return undefined;
    
    return zIndexSortData.sort((a, b) => b.zIndex - a.zIndex)[1].windowId;
}

export const calculateMinSizeValue = (sizeValue: number, minSizeValue: number, minBorderSizeValue: number): number => {
    if (minSizeValue > 0 && sizeValue < minSizeValue) {
        if (minSizeValue < minBorderSizeValue)
            sizeValue = minBorderSizeValue;
        else
            sizeValue = minSizeValue;
    }
    else if (sizeValue < minBorderSizeValue) {
        sizeValue = minBorderSizeValue;
    }

    return sizeValue;
}

export const calculateMinSize = (size: Size, minSize: Size, minBorderSize: Size): Size => ({
    width: calculateMinSizeValue(size.width, minSize.width, minBorderSize.width),
    height: calculateMinSizeValue(size.height, minSize.height, minBorderSize.height)
});

export const calculateMaxSizeValue = (sizeValue: number, posValue: number, screenPosValue: number,
    maxSizeValue: number, maxBorderSizeValue: number): number => {
        if (posValue + sizeValue > screenPosValue + maxBorderSizeValue) {
            sizeValue = screenPosValue + maxBorderSizeValue - posValue;
        }
        else if (maxSizeValue > 0 && sizeValue > maxSizeValue) {
            sizeValue = maxSizeValue;
        }

        if (sizeValue > maxBorderSizeValue)
            sizeValue = maxBorderSizeValue;

        return sizeValue;
    }

export const calculateMaxSize = (size: Size, pos: Position, screenPos: Position, maxSize: Size, maxBorderSize: Size): Size => ({
    width: calculateMaxSizeValue(size.width, pos.left, screenPos.left, maxSize.width, maxBorderSize.width),
    height: calculateMaxSizeValue(size.height, pos.top, screenPos.top, maxSize.height, maxBorderSize.height)
});

export const calculateMinPosValue = (windowPosValue: number, screenPosValue: number): number => (
    windowPosValue < screenPosValue ? screenPosValue : windowPosValue
);

export const calculateMinPos = (windowPos: Position, screenPos: Position): Position => ({
    left: calculateMinPosValue(windowPos.left, screenPos.left),
    top: calculateMinPosValue(windowPos.top, screenPos.top)
});

export const calculateMaxPosValue = (windowPosValue: number, windowValue: number,
    screenPosLength: number, screenLength: number): number => (
        windowPosValue + windowValue >= screenPosLength + screenLength ? screenPosLength + screenLength - windowValue : windowPosValue
    );

export const calculateMaxPos = (windowPos: Position, windowSize: Size, screenPos: Position, screenSize: Size): Position => ({
    left: calculateMaxPosValue(windowPos.left, windowSize.width, screenPos.left, screenSize.width),
    top: calculateMaxPosValue(windowPos.top, windowSize.height, screenPos.top, screenSize.height)
});

const createWindowState = (state: WindowManagerState, creationProperties: WindowStateCreationProperties): WindowState => {
    const {
        systemWindowBorderLengths,
        systemWindowMinSize,
        screenPos,
        screenSize
    } = state;

    const {
        id,
        appId,
        zIndex,
        name,
        pos,
        size,
        minSize,
        maxSize,
        isActive,
        mode,
        isBackgroundTransparent,
        frameColor
    } = creationProperties;

    const newMinSize = minSize != undefined ? minSize : {...initialWindowState.minSize};
    const newMaxSize = maxSize != undefined ? maxSize : {...initialWindowState.maxSize};
    let newSize = size != undefined ? size : {...initialWindowState.size};
    let newPos = pos != undefined ? pos : {...initialWindowState.pos};
    
    newSize = calculateMinSize(
        newSize,
        newMinSize,
        systemWindowMinSize
    );

    newSize = calculateMaxSize(
        newSize,
        newPos,
        screenPos,
        newMaxSize,
        screenSize
    );

    newPos = calculateMinPos(newPos, screenPos);
    newPos = calculateMaxPos(newPos, newSize, screenPos, screenSize);

    return {
        ...initialWindowState,
        id,
        appId: appId != undefined ? appId : initialWindowState.appId,
        zIndex: zIndex != undefined ? zIndex : initialWindowState.zIndex,
        name: name != undefined ? name : initialWindowState.name,
        pos: newPos,
        size: newSize,
        contentSize: {
            width: newSize.width - (systemWindowBorderLengths.left + systemWindowBorderLengths.right),
            height: newSize.height - (systemWindowBorderLengths.top + systemWindowBorderLengths.bottom)
        },
        minSize: newMinSize,
        maxSize: newMaxSize,
        isActive: isActive != undefined ? isActive : initialWindowState.isActive,
        mode: mode != undefined ? mode : {...initialWindowState.mode},
        isBackgroundTransparent: isBackgroundTransparent != undefined
            ? isBackgroundTransparent
            : initialWindowState.isBackgroundTransparent,
        frameColor
    };
}

const createWindowData = (state: WindowManagerState, creationProperties: WindowDataCreateProperties): WindowData => {
    const {updateComponent, windowComponent, windowStateCreationProperties} = creationProperties;

    return {
        updateComponent: updateComponent != undefined ? updateComponent : {},
        component: React.cloneElement(
            windowComponent, {
                key: 'Window' + windowStateCreationProperties.id,
                id: windowStateCreationProperties.id,
                appId: windowStateCreationProperties.appId
            }
        ),
        state: createWindowState(state, windowStateCreationProperties)
    };
}

const getWindowPropsData = (state: WindowManagerState, props: WindowProps): WindowPropsData => {
    const {systemWindowBorderLengths} = state;

    const windowBorderWidth: number = systemWindowBorderLengths.left + systemWindowBorderLengths.right;
    const windowBorderHeight: number = systemWindowBorderLengths.top + systemWindowBorderLengths.bottom;
    
    const calculateValidValue = (value: number, returnValue: number = value): number => value < 0 ? 0 : returnValue;

    let newPos: Position = { ...initialWindowState.pos };

    if (props.left != undefined)
        newPos.left = calculateValidValue(props.left);

    if (props.top != undefined)
        newPos.top = calculateValidValue(props.top);

    let newSize: Size = {...initialWindowState.size};

    if (props.width != undefined)
        newSize.width = calculateValidValue(props.width);
    else if (props.contentWidth != undefined)
        newSize.width = calculateValidValue(props.contentWidth, props.contentWidth + windowBorderWidth);

    if (props.height != undefined)
        newSize.height = calculateValidValue(props.height);
    else if (props.contentHeight != undefined)
        newSize.height = calculateValidValue(props.contentHeight, props.contentHeight + windowBorderHeight);

    const newMinSize: Size = {...initialWindowState.minSize};

    if (props.minWidth != undefined)
        newMinSize.width = calculateValidValue(props.minWidth);
    else if (props.minContentWidth != undefined)
        newMinSize.width = calculateValidValue(props.minContentWidth, props.minContentWidth + windowBorderWidth);

    if (props.minHeight != undefined)
        newMinSize.height = calculateValidValue(props.minHeight);
    else if (props.minContentHeight != undefined)
        newMinSize.height = calculateValidValue(props.minContentHeight, props.minContentHeight + windowBorderHeight);

    const newMaxSize: Size = {...initialWindowState.maxSize};

    if (props.maxWidth != undefined)
        newMaxSize.width = calculateValidValue(props.maxWidth);
    else if (props.maxContentWidth != undefined)
        newMaxSize.width = calculateValidValue(props.maxContentWidth, props.maxContentWidth + windowBorderWidth);

    if (props.maxHeight != undefined)
        newMaxSize.height = calculateValidValue(props.maxHeight);
    else if (props.maxContentHeight != undefined)
        newMaxSize.height = calculateValidValue(props.maxContentHeight, props.maxContentHeight + windowBorderHeight);
    
    return {
        pos: newPos,
        size: newSize,
        minSize: newMinSize,
        maxSize: newMaxSize,
        name: props.name != undefined ? props.name : initialWindowState.name,
        isBackgroundTransparent: props.isBackgroundTransparent != undefined
            ? props.isBackgroundTransparent
            : initialWindowState.isBackgroundTransparent
    };
}



const clearAppIdOfLastClosedWindow = (state: WindowManagerState, isUpdate: boolean = true): WindowManagerState => {
    const newState: WindowManagerState = {...state};
    newState.appIdOfLastClosedWindow = undefined;
    return isUpdate ? update(newState) : newState;
}

const setSystemWindowBorderLengths = (state: WindowManagerState, newBorderLengths: SetSystemWindowBorderLengthsPayload, isUpdate: boolean = true): WindowManagerState => {
    const newState: WindowManagerState = { ...state };
    const { systemWindowBorderLengths } = newState;

    systemWindowBorderLengths.left = newBorderLengths.left;
    systemWindowBorderLengths.top = newBorderLengths.top;
    systemWindowBorderLengths.right = newBorderLengths.right;
    systemWindowBorderLengths.bottom = newBorderLengths.bottom;

    return isUpdate ? update(newState) : newState;
}

const setSystemWindowMinSize = (state: WindowManagerState, newMinSize: SetSystemWindowMinSizePayload, isUpdate: boolean = true): WindowManagerState => {
    const newState: WindowManagerState = { ...state };
    const { systemWindowMinSize } = newState;

    systemWindowMinSize.width = newMinSize.width;
    systemWindowMinSize.height = newMinSize.height;

    return isUpdate ? update(newState) : newState;
}

const setSystemWindowMaxSize = (state: WindowManagerState, newMaxSize: SetSystemWindowMaxSizePayload, isUpdate: boolean = true): WindowManagerState => {
    const newState: WindowManagerState = { ...state };
    const { systemWindowMaxSize } = newState;

    systemWindowMaxSize.width = newMaxSize.width;
    systemWindowMaxSize.height = newMaxSize.height;

    return isUpdate ? update(newState) : newState;
}

const setScreenPos = (state: WindowManagerState, newScreenPos: SetScreenPosPayload, isUpdate: boolean = true): WindowManagerState => {
    const newState: WindowManagerState = { ...state };
    const { screenPos } = newState;

    screenPos.left = newScreenPos.left;
    screenPos.top = newScreenPos.top;

    return isUpdate ? update(newState) : newState;
}

const setScreenSize = (state: WindowManagerState, newScreenSize: SetScreenSizePayload, isUpdate: boolean = true): WindowManagerState => {
    const newState: WindowManagerState = { ...state };
    const { screenSize } = newState;

    screenSize.width = newScreenSize.width;
    screenSize.height = newScreenSize.height;

    return isUpdate ? update(newState) : newState;
}

const update = (state: WindowManagerState): WindowManagerState => {
    return { ...state, updateComponent: {} };
}

const updateWindow = (state: WindowManagerState, windowId: UpdateWindowPayload): WindowManagerState => {
    if (!isWindowExist(state.windowList, windowId))
        return state;

    const newState: WindowManagerState = { ...state };
    updateComponent(newState.windowList[windowId]!);

    return newState;
}

const createWindowsFromComponentList = (state: WindowManagerState, payload: CreateWindowsFromComponentListPayload): WindowManagerState => {
    let newState: WindowManagerState = {...state};
    const {windowList, freeWindowIdList} = newState;
    const {windowComponentList, appId} = payload;
    let lastWindowId: WindowId | undefined = undefined;

    windowComponentList.forEach((windowComponent, index) => {
        const {
            name,
            pos,
            size,
            minSize,
            maxSize,
            isBackgroundTransparent
        } = getWindowPropsData(newState, windowComponent.props);

        const createNewWindow = (newWindowId: WindowId): WindowData => (
            createWindowData(newState, {
                windowComponent,
                windowStateCreationProperties: {
                    appId,
                    id: newWindowId,
                    zIndex: newWindowId,
                    name,
                    pos,
                    size,
                    minSize,
                    maxSize,
                    isBackgroundTransparent,
                    frameColor: windowComponent.props.frameColor
                }
            })
        );

        let newWindowId: number | undefined = undefined;

        if (freeWindowIdList.length > 0) {
            newWindowId = freeWindowIdList.pop()!;
            newState.windowList[newWindowId] = createNewWindow(newWindowId);
        }
        else {
            newWindowId = windowList.length + index;
            windowList.push(createNewWindow(newWindowId));
        }

        lastWindowId = newWindowId;
    });

    if (lastWindowId != undefined)
        newState = activeWindow(newState, lastWindowId);

    return update(newState);
}

const createWindow = (state: WindowManagerState, payload: CreateWindowPayload): WindowManagerState => {
    if (!isWindowExist(state.windowList, payload.windowId))
        return state;

    const newState: WindowManagerState = {...state};

    const {
        windowList,
        freeWindowIdList
    } = newState;

    const {windowId, appId, name, pos, size} = payload;

    const createNewWindow = (newWindowId: WindowId): WindowData => (
        createWindowData(newState, {
            windowComponent: newState.windowList[windowId]!.component,
            windowStateCreationProperties: {
                id: newWindowId,
                appId,
                name,
                pos,
                size
            }
        })
    );

    let newWindowId: number | undefined = undefined;

    if (freeWindowIdList.length > 0) {
        newWindowId = freeWindowIdList.pop()!;
        newState.windowList[newWindowId] = createNewWindow(newWindowId);
    }
    else {
        newWindowId = windowList.length;
        newState.windowList.push(createNewWindow(newWindowId));
    }

    return activeWindow(update(newState), newWindowId);
}

const setWindowPos = (state: WindowManagerState, payload: SetWindowPosPayload, isUpdate: boolean = true): WindowManagerState => {
    if (!isWindowExist(state.windowList, payload.windowId))
        return state;

    const newState: WindowManagerState = {...state};
    const {windowId, pos} = payload;
    const {state: windowState} = newState.windowList[windowId]!;

    const setNewWindowPos = (newPos: Position) => {
        const posResult = calculateMinPos(newPos, newState.screenPos);

        windowState.pos = calculateMaxPos(
            posResult,
            windowState.size,
            newState.screenPos,
            newState.screenSize
        );
    };

    if (instanceOfPosition(pos)) {
        setNewWindowPos(pos);
    }
    else if (instanceOfPositionLeft(pos)) {
        setNewWindowPos({
            left: pos.left,
            top: windowState.pos.top
        } as Position);
    }
    else if (instanceOfPositionTop(pos)) {
        setNewWindowPos({
            left: windowState.pos.left,
            top: pos.top
        } as Position);
    }

    return isUpdate ? updateWindow(newState, windowId) : newState;
}

const setWindowSize = (state: WindowManagerState, payload: SetWindowSizePayload, isUpdate: boolean = true): WindowManagerState => {
    if (!isWindowExist(state.windowList, payload.windowId))
        return state;

    const newState = {...state};
    const {systemWindowBorderLengths, systemWindowMinSize} = newState;
    const {windowId, size} = payload;

    const {state: windowState} = newState.windowList[windowId]!;

    const setNewWindowSize = (newSize: Size) => {
        const newMinSize: Size = windowState.mode.type === WindowModeType.Hidden
            ? {width: 0, height: 0}
            : windowState.minSize;

        let sizeResult: Size = calculateMinSize(
            newSize,
            newMinSize,
            systemWindowMinSize
        );

        sizeResult = calculateMaxSize(
            sizeResult,
            windowState.pos,
            newState.screenPos,
            windowState.maxSize,
            newState.screenSize
        );

        windowState.size.width = sizeResult.width;
        windowState.size.height = sizeResult.height;

        windowState.contentSize.width = sizeResult.width - (systemWindowBorderLengths.left + systemWindowBorderLengths.right);
        windowState.contentSize.height = sizeResult.height - (systemWindowBorderLengths.top + systemWindowBorderLengths.bottom);
    };

    if (instanceOfSize(size)) {
        setNewWindowSize(size);
    }
    else if (instanceOfSizeWidth(size)) {
        setNewWindowSize({
            width: size.width,
            height: windowState.size.height
        } as Size);
    }
    else if (instanceOfSizeHeight(size)) {
        setNewWindowSize({
            width: windowState.size.width,
            height: size.height
        } as Size);
    }

    return isUpdate ? updateWindow(newState, windowId) : newState;
}

const setWindowCoords = (state: WindowManagerState, payload: SetWindowCoordsPayload, isUpdate: boolean = true): WindowManagerState => {
    if (!isWindowExist(state.windowList, payload.windowId))
        return state;

    let newState: WindowManagerState = {...state};
    const {windowId, coords} = payload;

    if (instanceOfCoordinates(coords)) {
        newState = setWindowPos(newState, {windowId, pos: coords.pos}, false);
        newState = setWindowSize( newState, {windowId, size: coords.size}, false);
        newState = setWindowPos(newState, {windowId, pos: coords.pos}, false);
    }
    else if (instanceOfCoordinatesSize(coords)) {
        newState = setWindowSize(newState, {windowId, size: coords.size}, false);
    }
    else if (instanceOfCoordinatesPos(coords)) {
        newState = setWindowPos(newState, {windowId, pos: coords.pos}, false);
    }

    return isUpdate ? updateWindow(newState, windowId) : newState;
}

const setWindowMinSize = (state: WindowManagerState, payload: SetWindowMinSizePayload, isUpdate: boolean = true): WindowManagerState => {
    if (!isWindowExist(state.windowList, payload.windowId))
        return state;

    const newState: WindowManagerState = { ...state };
    const {windowId, minSize} = payload;

    const { state: windowState } = newState.windowList[windowId]!;

    windowState.minSize.width = minSize.width;
    windowState.minSize.height = minSize.height;

    return setWindowSize(newState, {windowId, size: windowState.size}, isUpdate);
}

const setWindowMaxSize = (state: WindowManagerState, payload: SetWindowMaxSizePayload, isUpdate: boolean = true): WindowManagerState => {
    if (!isWindowExist(state.windowList, payload.windowId))
        return state;

    const newState: WindowManagerState = { ...state };
    const {windowId, maxSize} = payload;
    const {state: windowState } = newState.windowList[windowId]!;

    windowState.maxSize.width = maxSize.width;
    windowState.maxSize.height = maxSize.height;

    return setWindowSize(newState, {windowId, size: windowState.size}, isUpdate);
}

const setWindowName = (state: WindowManagerState, payload: SetWindowNamePayload, isUpdate: boolean = true): WindowManagerState => {
    if (!isWindowExist(state.windowList, payload.windowId))
        return state;

    const newState: WindowManagerState = {...state};
    newState.windowList[payload.windowId]!.state.name = payload.name;

    return isUpdate ? updateWindow(newState, payload.windowId) : newState;
}

const setWindowBackgroundTransparent = (state: WindowManagerState, payload: SetWindowBackgroundTransparentPayload,
    isUpdate: boolean = true): WindowManagerState => {
        if (!isWindowExist(state.windowList, payload.windowId))
            return state;

        const newState: WindowManagerState = {...state};
        newState.windowList[payload.windowId]!.state.isBackgroundTransparent = payload.isBackgroundTransparent;

        return isUpdate ? updateWindow(newState, payload.windowId) : newState;
    }

const setWindowFrameColor = (state: WindowManagerState, payload: SetWindowFrameColorPayload, isUpdate: boolean = true): WindowManagerState => {
    if (!isWindowExist(state.windowList, payload.windowId))
        return state;

    const newState: WindowManagerState = {...state};
    newState.windowList[payload.windowId]!.state.frameColor = payload.frameColor;

    return isUpdate ? updateWindow(newState, payload.windowId) : newState;
}

const activeWindow = (state: WindowManagerState, windowId: ActiveWindowPayload, isUpdate: boolean = true): WindowManagerState => {
    if (!isWindowExist(state.windowList, windowId))
        return state;

    if (state.windowList[windowId]!.state.isActive)
        return state;    

    let newState: WindowManagerState = {...state};
    const {state: windowState} = newState.windowList[windowId]!;
    const {zIndex: activeZindex} = windowState;

    let existWindowCount: number = -1;

    newState.windowList.forEach((window, index) => {
        if (!window)
            return;

        existWindowCount++;
        window.state.isActive = false;

        const {zIndex} = window.state;

        if (zIndex > activeZindex)
            window.state.zIndex = zIndex - 1;

        if (isUpdate)
            newState = updateWindow(newState, index);
    });

    windowState.zIndex = existWindowCount;
    windowState.isActive = true;

    return isUpdate ? update(updateWindow(newState, windowId)) : newState;
}

const closeWindow = (state: WindowManagerState, windowId: CloseWindowPayload): WindowManagerState => {
    if (!isWindowExist(state.windowList, windowId))
        return state;

    let newState: WindowManagerState = {...state};

    const appId = newState.windowList[windowId]!.component.props.appId;

    if (appId != undefined)
        newState.appIdOfLastClosedWindow = appId;

    delete newState.windowList[windowId];
    newState.freeWindowIdList.push(windowId);

    const newWindowId = calculateTopWindow(newState.windowList);

    if (newWindowId != undefined)
        newState = activeWindow(newState, newWindowId);

    return update(newState);
}

const setWindowMode = (state: WindowManagerState, payload: SetWindowModePayload, isUpdate: boolean = true): WindowManagerState => {
    if (!isWindowExist(state.windowList, payload.windowId))
        return state;

    let newState: WindowManagerState = {...state};
    const {windowId} = payload;
    const {state: windowState} = newState.windowList[windowId]!;

    if (payload.windowModeType === windowState.mode.type)
        return state;

    const {systemWindowMinSize, systemWindowMaxSize, screenPos, screenSize} = newState;

    let coords: ExplicitCoordinates | undefined = undefined;

    if (payload.windowModeType === WindowModeType.Standard) {
        coords = {
            pos: windowState.mode.prevMode.state.pos,
            size: windowState.mode.prevMode.state.size
        };
    }
    else {
        if (windowState.mode.type === WindowModeType.Standard) {
            windowState.mode.prevMode = {
                ...windowState.mode.prevMode,
                state: {
                    pos: {...windowState.pos},
                    size: {...windowState.size}
                }
            };
        }

        if (payload.windowModeType === WindowModeType.Full) {
            coords = {
                pos: screenPos,
                size: systemWindowMaxSize
            };
        }
        else if (payload.windowModeType === WindowModeType.Hidden) {
            coords = {
                pos: {
                    left: screenPos.left,
                    top:
                        screenPos.top +
                        screenSize.height -
                        systemWindowMinSize.height
                },
                size: systemWindowMinSize
            };
        }
    }

    windowState.mode = {
        type: payload.windowModeType,
        prevMode: {
            state: windowState.mode.prevMode.state,
            type: windowState.mode.type
        }
    };

    if (!coords)
        return state;

    if (windowState.mode.type === WindowModeType.Hidden) {
        const prevTopWindowId = calculatePrevTopWindow(newState.windowList);

        if (prevTopWindowId != undefined)
            newState = activeWindow(newState, prevTopWindowId);
    }

    newState = setWindowCoords(newState, {windowId, coords}, isUpdate);
    return isUpdate ? update(newState) : newState;
}

const resetWindow = (state: WindowManagerState, windowId: ResetWindowPayload, isUpdate: boolean = true): WindowManagerState => {
    if (!isWindowExist(state.windowList, windowId))
        return state;

    let newState: WindowManagerState = {...state};

    newState = setWindowMode(newState, {
        windowId,
        windowModeType: WindowModeType.Standard
    }, isUpdate);

    return setWindowCoords(newState, {
        windowId,
        coords: {
            pos: newState.screenPos,
            size: {width: 200, height: 100}
        }
    }, isUpdate);
}

const resetAllWindows = (state: WindowManagerState, isUpdate: boolean = true): WindowManagerState => {
    let newState: WindowManagerState = {...state};

    for (let window of newState.windowList) {
        if (!window)
            continue;

        newState = resetWindow(newState, window.state.id, isUpdate);
    }

    return newState;
}

const activeTopAppWindows = (state: WindowManagerState, appId: ActiveWindowPayload, isUpdate: boolean = true): WindowManagerState => {
    let newState: WindowManagerState = {...state};
    const topWindowId = calculateTopAppWindow(newState.windowList, appId);

    if (topWindowId == undefined)
        return state;

    newState = activeWindow(newState, topWindowId);
    return isUpdate ? update(newState) : newState;
}

const setAllAppWindowsMode = (state: WindowManagerState, payload: SetAllAppWindowsModePayload, isUpdate: boolean = true): WindowManagerState => {
    let newState: WindowManagerState = {...state};

    for (let window of newState.windowList) {
        if (!window)
            continue;

        if (window.state.appId === payload.appId) {
            newState = setWindowMode(newState, {
                windowId: window.state.id,
                windowModeType: payload.windowModeType
            }, isUpdate);
        }
    }

    return newState;
}

const resetAllAppWindows = (state: WindowManagerState, appId: ResetAllAppWindowsPayload, isUpdate: boolean = true): WindowManagerState => {
    let newState: WindowManagerState = {...state};

    for (let window of newState.windowList) {
        if (!window)
            continue;

        if (window.state.appId === appId)
            newState = resetWindow(newState, window.state.id, isUpdate);
    }

    return newState;
}

export const windowManagerReducer = (state = initialWindowManagerState, action: WindowManagerAction): WindowManagerState => {
    switch (action.type) {
        case WindowManagerActionTypes.CLEAR_APP_ID_OF_LAST_CLOSED_WINDOW:
            return clearAppIdOfLastClosedWindow(state);

        case WindowManagerActionTypes.SET_SYSTEM_WINDOW_BORDER_LENGTHS:
            return setSystemWindowBorderLengths(state, action.payload);

        case WindowManagerActionTypes.SET_SYSTEM_WINDOW_MIN_SIZE:
            return setSystemWindowMinSize(state, action.payload);

        case WindowManagerActionTypes.SET_SYSTEM_WINDOW_MAX_SIZE:
            return setSystemWindowMaxSize(state, action.payload);

        case WindowManagerActionTypes.UPDATE:
            return update(state);

        case WindowManagerActionTypes.UPDATE_WINDOW:
            return updateWindow(state, action.payload);

        case WindowManagerActionTypes.SET_SCREEN_SIZE:
            return setScreenSize(state, action.payload);

        case WindowManagerActionTypes.SET_SCREEN_POS:
            return setScreenPos(state, action.payload);

        case WindowManagerActionTypes.CREATE_WINDOWS_FROM_COMPONENT_LIST:
            return createWindowsFromComponentList(state, action.payload);

        case WindowManagerActionTypes.CREATE_WINDOW:
            return createWindow(state, action.payload);

        case WindowManagerActionTypes.SET_WINDOW_POS:
            return setWindowPos(state, action.payload);

        case WindowManagerActionTypes.SET_WINDOW_SIZE:
            return setWindowSize(state, action.payload);

        case WindowManagerActionTypes.SET_WINDOW_COORDS:
            return setWindowCoords(state, action.payload);

        case WindowManagerActionTypes.SET_WINDOW_MIN_SIZE:
            return setWindowMinSize(state, action.payload);

        case WindowManagerActionTypes.SET_WINDOW_MAX_SIZE:
            return setWindowMaxSize(state, action.payload);

        case WindowManagerActionTypes.SET_WINDOW_NAME:
            return setWindowName(state, action.payload);

        case WindowManagerActionTypes.SET_WINDOW_BACKGROUND_TRANSPARENT:
            return setWindowBackgroundTransparent(state, action.payload);

        case WindowManagerActionTypes.SET_WINDOW_FRAME_COLOR:
            return setWindowFrameColor(state, action.payload);

        case WindowManagerActionTypes.ACTIVE_WINDOW:
            return activeWindow(state, action.payload);

        case WindowManagerActionTypes.CLOSE_WINDOW:
            return closeWindow(state, action.payload);

        case WindowManagerActionTypes.SET_WINDOW_MODE:
            return setWindowMode(state, action.payload);

        case WindowManagerActionTypes.RESET_WINDOW:
            return resetWindow(state, action.payload);

        case WindowManagerActionTypes.RESET_ALL_WINDOWS:
            return resetAllWindows(state);

        case WindowManagerActionTypes.ACTIVE_TOP_APP_WINDOWS:
            return activeTopAppWindows(state, action.payload);

        case WindowManagerActionTypes.SET_ALL_APP_WINDOWS_MODE:
            return setAllAppWindowsMode(state, action.payload);

        case WindowManagerActionTypes.RESET_ALL_APP_WINDOWS:
            return resetAllAppWindows(state, action.payload);

        default: return state;
    }
}