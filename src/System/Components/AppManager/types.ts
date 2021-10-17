import { ComponentUpdate, UpdateableComponent } from "../../Component/Update/types";
import { AppList } from "../../Store/Reducers/appRegistryReducer/types";
import { FreeAppIdList, StartedAppDataList, StartRegistryAppId } from "../../Store/Reducers/appManagerReducer/types";

export interface AppRegistrySelectorResult extends UpdateableComponent {
    appList: AppList;
}

export interface AppManagerAppResult extends UpdateableComponent {
    startRegistryAppId: StartRegistryAppId;
}

export interface AppManagerIdResult {
    freeAppIdListUpdate: ComponentUpdate;
    freeAppIdList: FreeAppIdList;
    startedAppDataList: StartedAppDataList;
}

export interface AppManagerSelectorResult {
    appRegistrySelectorResult: AppRegistrySelectorResult;
    appManagerAppResult: AppManagerAppResult;
    appManagerIdResult: AppManagerIdResult;
}