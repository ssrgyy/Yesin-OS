import css from "./CSS/window_manager.module.css";
import React, { Dispatch, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "../../Store/Reducers";
import { hasUndefinedeProperty } from "../../Functions/Object";
import { WindowManagerSelectorResult, WindowComponentListSelectorResult, WindowSettingsSelectorResult, ScreenSettingsSelectorResult, WindowListSelectorResult } from "./types";
import { WindowManagerActionTypes, WindowManagerAction, WindowComponent } from "../../Store/Reducers/windowManagerReducer/types";
import { AppManagerAction, AppManagerActionTypes } from "../../Store/Reducers/appManagerReducer/types";

export const WindowManager: React.FC = () => {
    const {
        windowComponentListSelectorResult,
        windowListSelectorResult,
        windowSettingsSelectorResult,
        screenSettingsSelectorResult
    }: WindowManagerSelectorResult = useSelector(createSelector(
        createSelector(
            (rootState: RootState) => rootState.windowManager.updateComponent,
            (rootState: RootState) => rootState.windowManager.windowList,
            (updateComponent, windowList): WindowComponentListSelectorResult => ({
                updateComponent,
                windowComponentList: windowList.filter(window => window != undefined).map(window => window!.component)
            })
        ),
        createSelector(
            (rootState: RootState) => rootState.windowManager.updateComponent,
            (rootState: RootState) => rootState.windowManager.windowList,
            (rootState: RootState) => rootState.windowManager.appIdOfLastClosedWindow,
            (updateComponent,
                windowList,
                lastAppIdOfClosedWindow): WindowListSelectorResult => ({
                    updateComponent,
                    windowList,
                    appIdOfLastClosedWindow: lastAppIdOfClosedWindow
                })
        ),
        createSelector(
            (rootState: RootState) => rootState.systemSettings.window.settings.borderLengths.updateComponent,
            (rootState: RootState) => rootState.systemSettings.window.settings.borderLengths,
            (rootState: RootState) => rootState.systemSettings.window.settings.minSize.updateComponent,
            (rootState: RootState) => rootState.systemSettings.window.settings.minSize,
            (rootState: RootState) => rootState.systemSettings.window.settings.maxSize.updateComponent,
            (rootState: RootState) => rootState.systemSettings.window.settings.maxSize,
            (borderLengthsUpdate, borderLengths, minSizeUpdate, minSize,
                maxSizeUpdate, maxSize): WindowSettingsSelectorResult => ({
                    windowBorderLengthsSettingsUpdate: borderLengthsUpdate,
                    windowBorderLengthsSettings: borderLengths,
                    windowMinSizeSettingsUpdate: minSizeUpdate,
                    windowMinSizeSettings: minSize,
                    windowMaxSizeSettingsUpdate: maxSizeUpdate,
                    windowMaxSizeSettings: maxSize
                })
        ),
        createSelector(
            (rootState: RootState) => rootState.systemSettings.screen.settings.size.updateComponent,
            (rootState: RootState) => rootState.systemSettings.screen.settings.size,
            (rootState: RootState) => rootState.systemSettings.screen.settings.pos.updateComponent,
            (rootState: RootState) => rootState.systemSettings.screen.settings.pos,
            (sizeUpdate, size, posUpdate, pos): ScreenSettingsSelectorResult => ({
                screenSizeSettingsUpdate: sizeUpdate,
                screenSizeSettings: size,
                screenPosSettingsUpdate: posUpdate,
                screenPosSettings: pos
            })
        ),
        (windowComponentListSelectorResult,
            windowListSelectorResult,
            windowSettingsSelectorResult,
            screenSettingsSelectorResult): WindowManagerSelectorResult => ({
                windowComponentListSelectorResult,
                windowListSelectorResult,
                windowSettingsSelectorResult,
                screenSettingsSelectorResult
            })
    ));

    const {windowComponentList} = windowComponentListSelectorResult;
    const {windowList, appIdOfLastClosedWindow} = windowListSelectorResult;
    const {windowBorderLengthsSettings, windowMinSizeSettings, windowMaxSizeSettings} = windowSettingsSelectorResult;
    const {screenSizeSettings, screenPosSettings} = screenSettingsSelectorResult;

    const dispatch = useDispatch<Dispatch<WindowManagerAction>>();
    const appManagerDispatch = useDispatch<Dispatch<AppManagerAction>>();
    
    useEffect(() => {
        if (hasUndefinedeProperty(windowBorderLengthsSettings.value))
            return;

        dispatch({
            type: WindowManagerActionTypes.SET_SYSTEM_WINDOW_BORDER_LENGTHS,
            payload: windowBorderLengthsSettings.value
        });
    }, Object.values(windowBorderLengthsSettings.value));

    useEffect(() => {
        if (hasUndefinedeProperty(windowMinSizeSettings.value))
            return;

        dispatch({
            type: WindowManagerActionTypes.SET_SYSTEM_WINDOW_MIN_SIZE,
            payload: windowMinSizeSettings.value
        });
    }, Object.values(windowMinSizeSettings.value));

    useEffect(() => {
        if (hasUndefinedeProperty(windowMaxSizeSettings.value))
            return;

        dispatch({
            type: WindowManagerActionTypes.SET_SYSTEM_WINDOW_MAX_SIZE,
            payload: windowMaxSizeSettings.value
        });
    }, Object.values(windowMaxSizeSettings.value));

    useEffect(() => {
        if (hasUndefinedeProperty(screenSizeSettings.value))
            return;

        dispatch({
            type: WindowManagerActionTypes.SET_SCREEN_SIZE,
            payload: screenSizeSettings.value
        });
    }, Object.values(screenSizeSettings.value));

    useEffect(() => {
        if (hasUndefinedeProperty(screenPosSettings.value))
            return;

        dispatch({
            type: WindowManagerActionTypes.SET_SCREEN_POS,
            payload: screenPosSettings.value
        });
    }, Object.values(screenPosSettings.value));

    useEffect(() => {
        if (appIdOfLastClosedWindow == undefined)
            return;

        let isAppClose: boolean = true;

        for (let window of windowList) {
            if (!window)
                continue;

            if (window.state.appId === appIdOfLastClosedWindow) {
                isAppClose = false;
                break;
            }
        }

        if (!isAppClose)
            return;

        appManagerDispatch({
            type: AppManagerActionTypes.TERMINATE_APP,
            payload: appIdOfLastClosedWindow
        });

        dispatch({type: WindowManagerActionTypes.CLEAR_APP_ID_OF_LAST_CLOSED_WINDOW});
    }, [windowComponentList]);

    return useMemo(() => (        
        <div className={css.window_manager}>
            {windowComponentList}
        </div>
    ), [windowComponentList]);
}