import { UpdateableComponent } from "../../Component/Update/types";
import { AppId } from "../App/types";
import { AppList } from "../../Store/Reducers/appRegistryReducer/types";
import { StartedAppDataList } from "../../Store/Reducers/appManagerReducer/types";
import { ThemeColorSettings } from "../../Store/Reducers/systemSettingsReducer/types";
import { WindowModeType } from "../Window/types";

export interface WindowResultData {
    appId: AppId;
    isActive: boolean;
    windowModeType: WindowModeType;
}

export interface AppRegistrySelectorResult extends UpdateableComponent {
    appList: AppList;
}

export interface AppManagerSelectorResult extends UpdateableComponent {
    startedAppDataList: StartedAppDataList;
}

export interface WindowManagerSelectorResult extends UpdateableComponent {
    windowResultDataList: WindowResultData[];
}

export interface ThemeSettingsSelectorResult extends UpdateableComponent {
    themeColorSettings: ThemeColorSettings;
}

export interface AppbarSelectorResult {
    appRegistrySelectorResult: AppRegistrySelectorResult;
    appManagerSelectorResult: AppManagerSelectorResult;
    windowManagerSelectorResult: WindowManagerSelectorResult;
    themeSettingsSelectorResult: ThemeSettingsSelectorResult;
}