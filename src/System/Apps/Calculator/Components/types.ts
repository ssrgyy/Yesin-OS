import { ComponentUpdate } from "../../../Component/Update/types";
import { ThemeColorSettings } from "../../../Store/Reducers/systemSettingsReducer/types";

export interface ThemeSettingsSelectorResult {
    themeColorSettingsUpdate: ComponentUpdate;
    themeColorSettings: ThemeColorSettings;
}