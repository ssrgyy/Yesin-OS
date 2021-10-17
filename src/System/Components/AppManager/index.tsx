import React, { Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "../../Store/Reducers";
import { AppId } from "../App/types";
import { AppManagerAction, AppManagerActionTypes } from "../../Store/Reducers/appManagerReducer/types";
import { WindowManagerAction, WindowManagerActionTypes } from "../../Store/Reducers/windowManagerReducer/types";
import { AppManagerAppResult, AppManagerIdResult, AppManagerSelectorResult, AppRegistrySelectorResult } from "./types";

export const AppManager: React.FC = () => {
    const {
        appRegistrySelectorResult,
        appManagerAppResult,
        appManagerIdResult
    }: AppManagerSelectorResult = useSelector(createSelector(
        createSelector(
            (rootState: RootState) => rootState.appRegistry.appList.updateComponent,
            (rootState: RootState) => rootState.appRegistry.appList,
            (updateComponent, appList): AppRegistrySelectorResult => ({updateComponent, appList})
        ),
        createSelector(
            (rootState: RootState) => rootState.appManager.startRegistryAppId.updateComponent,
            (rootState: RootState) => rootState.appManager.startRegistryAppId,
            (updateComponent, startRegistryAppId): AppManagerAppResult => ({updateComponent, startRegistryAppId})
        ),
        createSelector(
            (rootState: RootState) => rootState.appManager.freeAppIdList.updateComponent,
            (rootState: RootState) => rootState.appManager.freeAppIdList,
            (rootState: RootState) => rootState.appManager.startedAppDataList,
            (freeAppIdListUpdate, freeAppIdList, startedAppDataList): AppManagerIdResult => ({
                freeAppIdListUpdate,
                freeAppIdList,
                startedAppDataList
            })
        ),
        (appRegistrySelectorResult, appManagerAppResult,
            appManagerIdResult): AppManagerSelectorResult => ({
                appRegistrySelectorResult,
                appManagerAppResult,
                appManagerIdResult
            })
    ));

    const {value: appList} = appRegistrySelectorResult.appList;
    const {value: startRegistryAppId} = appManagerAppResult.startRegistryAppId;
    const {value: freeAppIdList} = appManagerIdResult.freeAppIdList;
    const {value: startedAppDataList} = appManagerIdResult.startedAppDataList;

    const dispatch = useDispatch<Dispatch<AppManagerAction>>();
    const windowManagerDispatch = useDispatch<Dispatch<WindowManagerAction>>();
    
    useEffect(() => {
        if (startRegistryAppId == undefined)
            return;

        const app = appList[startRegistryAppId];

        if (!app)
            return;

        dispatch({type: AppManagerActionTypes.CLEAR_START_REGISTRY_APP_ID});
        
        if (app.windowComponentList.length === 0 || freeAppIdList.length === 0)
            return;

        const newAppId: AppId = freeAppIdList[freeAppIdList.length - 1];

        if (startedAppDataList[newAppId] != undefined)
            return;

        dispatch({
            type: AppManagerActionTypes.ADD_STARTED_APP_ID,
            payload: {
                appId: newAppId,
                appRegistryId: startRegistryAppId
            }
        });

        windowManagerDispatch({
            type: WindowManagerActionTypes.CREATE_WINDOWS_FROM_COMPONENT_LIST,
            payload: {
                windowComponentList: app.windowComponentList,
                appId: newAppId
            }
        });


    }, [startRegistryAppId]);

    return <></>;
}