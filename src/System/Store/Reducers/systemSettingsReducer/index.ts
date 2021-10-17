import { updateComponent } from "../../../Component/Update";
import { SystemSettingsState, SystemSettingsActionTypes, SystemSettingsAction, SetWindowBorderLengthsPayload, SetWindowBorderRadiusPayload, SetThemeColorPayload, SetWindowMinSizePayload, SetWindowMaxSizePayload, SetScreenSizePayload, SetScreenPosPayload } from "./types";

export const defaultThemeColor = '#6495ed';

export const initialSystemSettingsState: SystemSettingsState = {
    updateComponent: {},
    window: {
        updateComponent: {},
        settings: {
            borderLengths: {
                updateComponent: {},
                value: {
                    left: 0,
                    top: 25,
                    right: 0,
                    bottom: 0
                }
            },
            borderRadius: {
                updateComponent: {},
                value: 12
            },
            minSize: {
                updateComponent: {},
                value: {
                    width: 170,
                    height: 25
                }
            },
            maxSize: {
                updateComponent: {},
                value: {
                    width: 1920,
                    height: 1080
                }
            }
        }
    },
    theme: {
        updateComponent: {},
        settings: {
            color: {
                updateComponent: {},
                value: defaultThemeColor
            }
        }
    },
    screen: {
        updateComponent: {},
        settings: {
            pos: {
                updateComponent: {},
                value: {
                    left: 0,
                    top: 0
                }
            },
            size: {
                updateComponent: {},
                value: {
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight
                }
            }
        }
    }
};

const update = (state: SystemSettingsState): SystemSettingsState => {
    return {...state, updateComponent: {}};
}

const setWindowBorderLengths = (state: SystemSettingsState, windowBorderLengths: SetWindowBorderLengthsPayload): SystemSettingsState => {
    const newState: SystemSettingsState = {...state};

    const {borderLengths} = newState.window.settings;
    const {value} = borderLengths;

    value.left = windowBorderLengths.left;
    value.top = windowBorderLengths.top;
    value.right = windowBorderLengths.right;
    value.bottom = windowBorderLengths.bottom;

    updateComponent(borderLengths);

    return newState;
}

const setWindowBorderRadius = (state: SystemSettingsState, windowBorderRadius: SetWindowBorderRadiusPayload): SystemSettingsState => {
    const newState: SystemSettingsState = {...state};
    const {borderRadius} = newState.window.settings;

    borderRadius.value = windowBorderRadius;

    updateComponent(borderRadius);

    return newState;
}

const setWindowMinSize = (state: SystemSettingsState, windowMinSize: SetWindowMinSizePayload): SystemSettingsState => {
    const newState: SystemSettingsState = {...state};

    const {minSize} = newState.window.settings;
    const {value} = minSize;

    value.width = windowMinSize.width;
    value.height = windowMinSize.height;

    updateComponent(minSize);

    return newState;
}

const setWindowMaxSize = (state: SystemSettingsState, windowMaxSize: SetWindowMaxSizePayload): SystemSettingsState => {
    const newState: SystemSettingsState = {...state};

    const {maxSize} = newState.window.settings;
    const {value} = maxSize;

    value.width = windowMaxSize.width;
    value.height = windowMaxSize.height;

    updateComponent(maxSize);

    return newState;
}

const setThemeColor = (state: SystemSettingsState, themeColor: SetThemeColorPayload): SystemSettingsState => {
    const newState: SystemSettingsState = {...state};
    const {color} = newState.theme.settings;

    color.value = themeColor;
    updateComponent(color);

    return newState;
}

const setScreenPos = (state: SystemSettingsState, screenPos: SetScreenPosPayload): SystemSettingsState => {
    const newState: SystemSettingsState = {...state};

    const {pos} = newState.screen.settings;
    const {value} = pos;

    value.left = screenPos.left;
    value.top = screenPos.top;

    updateComponent(pos);

    return newState;
}

const setScreenSize = (state: SystemSettingsState, screenSize: SetScreenSizePayload): SystemSettingsState => {
    const newState: SystemSettingsState = {...state};

    const {size} = newState.screen.settings;
    const {value} = size;

    value.width = screenSize.width;
    value.height = screenSize.height;

    updateComponent(size);

    return newState;
}

export const systemSettingsReducer = (state = initialSystemSettingsState, action: SystemSettingsAction): SystemSettingsState => {
    switch (action.type) {
        case SystemSettingsActionTypes.SET_WINDOW_BORDER_LENGTHS:
            return setWindowBorderLengths(state, action.payload);

        case SystemSettingsActionTypes.SET_WINDOW_BORDER_RADIUS:
            return setWindowBorderRadius(state, action.payload);

        case SystemSettingsActionTypes.SET_WINDOW_MIN_SIZE:
            return setWindowMinSize(state, action.payload);

        case SystemSettingsActionTypes.SET_WINDOW_MAX_SIZE:
            return setWindowMaxSize(state, action.payload);
        
        case SystemSettingsActionTypes.SET_THEME_COLOR:
            return setThemeColor(state, action.payload);

        case SystemSettingsActionTypes.SET_SCREEN_POS:
            return setScreenPos(state, action.payload);

        case SystemSettingsActionTypes.SET_SCREEN_SIZE:
            return setScreenSize(state, action.payload);

        default:
            return state;
    }
}