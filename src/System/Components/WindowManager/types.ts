import { UpdateableComponent, ComponentUpdate } from "../../Component/Update/types";
import { WindowComponent, WindowList } from "../../Store/Reducers/windowManagerReducer/types";
import { ScreenPosSettings, ScreenSizeSettings, WindowBorderLengthSettings, WindowMaxSizeSettings, WindowMinSizeSettings } from "../../Store/Reducers/systemSettingsReducer/types";
import { AppId } from "../App/types";

export interface WindowComponentListSelectorResult extends UpdateableComponent {
    windowComponentList: WindowComponent[];
}

export interface WindowListSelectorResult extends UpdateableComponent {
    windowList: WindowList;
    appIdOfLastClosedWindow?: AppId;
}

export interface WindowSettingsSelectorResult {
    windowBorderLengthsSettingsUpdate: ComponentUpdate;
    windowBorderLengthsSettings: WindowBorderLengthSettings;
    windowMinSizeSettingsUpdate: ComponentUpdate;
    windowMinSizeSettings: WindowMinSizeSettings;
    windowMaxSizeSettingsUpdate: ComponentUpdate;
    windowMaxSizeSettings: WindowMaxSizeSettings;
}

export interface ScreenSettingsSelectorResult {
    screenSizeSettingsUpdate: ComponentUpdate;
    screenSizeSettings: ScreenSizeSettings;
    screenPosSettingsUpdate: ComponentUpdate;
    screenPosSettings: ScreenPosSettings;
}

export interface WindowManagerSelectorResult {
    windowComponentListSelectorResult: WindowComponentListSelectorResult;
    windowListSelectorResult: WindowListSelectorResult;
    windowSettingsSelectorResult: WindowSettingsSelectorResult;
    screenSettingsSelectorResult: ScreenSettingsSelectorResult;
}