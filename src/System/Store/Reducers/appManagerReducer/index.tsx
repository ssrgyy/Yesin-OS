import { updateComponent } from "../../../Component/Update";
import { AppId } from "../../../Components/App/types";
import { AddStartedAppIdPayload, AppData, AppManagerAction, AppManagerActionTypes, AppManagerState, StartRegistryAppPayload, TerminateAppPayload } from "./types";

export const initialAppManagerState: AppManagerState = {
    startRegistryAppId: {
        updateComponent: {}
    },
    startedAppDataList: {
        updateComponent: {},
        value: []
    },
    freeAppIdList: {
        updateComponent: {},
        value: []
    }
};

export const isAppStarted = (startedAppDataList: AppData[], appId: AppId): boolean => {
    for (let value of startedAppDataList) {
        if (value == undefined)
            continue;

        if (value.appId === appId)
            return true;
    }

    return false;
}

export const isRegistryAppStarted = (startedAppDataList: AppData[], appRegistryId: AppId): boolean => {
    for (let value of startedAppDataList) {
        if (value == undefined)
            continue;

        if (value.appRegistryId === appRegistryId)
            return true;
    }

    return false;
}

const startRegistryApp = (state: AppManagerState, registryAppId: StartRegistryAppPayload): AppManagerState => {
    const newState: AppManagerState = {...state};
    const {startRegistryAppId, startedAppDataList, freeAppIdList} = newState;
    
    startRegistryAppId.value = registryAppId;
    updateComponent(startRegistryAppId);

    if (freeAppIdList.value.length > 0)
        return newState;
    
    freeAppIdList.value.push(startedAppDataList.value.length);
    updateComponent(freeAppIdList);

    return newState;
}

const addStartedAppId = (state: AppManagerState, appData: AddStartedAppIdPayload): AppManagerState => {
    const newState: AppManagerState = {...state};
    const {freeAppIdList, startedAppDataList} = newState;

    freeAppIdList.value.pop();
    updateComponent(freeAppIdList);
    
    if (startedAppDataList.value[appData.appId] != undefined)
        return newState;

    startedAppDataList.value[appData.appId] = appData;
    updateComponent(startedAppDataList);

    return newState;
}

const clearStartAppId = (state: AppManagerState): AppManagerState => {
    const newState: AppManagerState = {...state};
    newState.startRegistryAppId.value = undefined;
    return newState;
}

const terminateApp = (state: AppManagerState, appId: TerminateAppPayload): AppManagerState => {
    const newState: AppManagerState = {...state};
    const {startedAppDataList, freeAppIdList} = newState;

    startedAppDataList.value.forEach((startedAppData, index) => {
        if (!startedAppData)
            return;

        if (startedAppData.appId !== appId)
            return;
        
        delete startedAppDataList.value[index];
        updateComponent(startedAppDataList);
        freeAppIdList.value.push(index);
        updateComponent(freeAppIdList);
    });

    return newState;
}

export const appManagerReducer = (state: AppManagerState = initialAppManagerState, action: AppManagerAction): AppManagerState => {
    switch (action.type) {
        case AppManagerActionTypes.START_REGISTRY_APP:
            return startRegistryApp(state, action.payload);

        case AppManagerActionTypes.ADD_STARTED_APP_ID:
            return addStartedAppId(state, action.payload);

        case AppManagerActionTypes.CLEAR_START_REGISTRY_APP_ID:
            return clearStartAppId(state);

        case AppManagerActionTypes.TERMINATE_APP:
            return terminateApp(state, action.payload);

        default:
            return state;
    }
}