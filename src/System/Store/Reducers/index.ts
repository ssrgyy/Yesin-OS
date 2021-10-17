import { combineReducers } from "redux";
import { appManagerReducer } from "./appManagerReducer";
import { appRegistryReducer } from "./appRegistryReducer";
import { systemSettingsReducer } from "./systemSettingsReducer";
import { windowManagerReducer } from './windowManagerReducer';


export const rootReducer = combineReducers({
    systemSettings: systemSettingsReducer,
    appRegistry: appRegistryReducer,
    appManager: appManagerReducer,
    windowManager: windowManagerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;