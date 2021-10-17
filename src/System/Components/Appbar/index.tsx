import css from "./CSS/appbar.module.css";
import React, { CSSProperties, Dispatch, ReactElement, useMemo } from "react";
import { Icon } from "../Icon";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "../../Store/Reducers";
import { AppbarSelectorResult, AppManagerSelectorResult, AppRegistrySelectorResult, ThemeSettingsSelectorResult, WindowManagerSelectorResult, WindowResultData } from "./types";
import { AppId } from "../App/types";
import { WindowModeType } from "../Window/types";
import { AppManagerAction, AppManagerActionTypes } from "../../Store/Reducers/appManagerReducer/types";
import { WindowManagerAction, WindowManagerActionTypes } from "../../Store/Reducers/windowManagerReducer/types";
import { hexToRgb } from "../../Functions/Object";

export const appbarZindex :number = 10000;

export const Appbar: React.FC = () => {
    const {
        appRegistrySelectorResult,
        appManagerSelectorResult,
        windowManagerSelectorResult,
        themeSettingsSelectorResult
    }: AppbarSelectorResult = useSelector(createSelector(
        createSelector(
            (rootState: RootState) => rootState.appRegistry.appList.updateComponent,
            (rootState: RootState) => rootState.appRegistry.appList,
            (updateComponent, appList): AppRegistrySelectorResult => ({updateComponent, appList})
        ),
        createSelector(
            (rootState: RootState) => rootState.appManager.startedAppDataList.updateComponent,
            (rootState: RootState) => rootState.appManager.startedAppDataList,
            (updateComponent, startedAppDataList): AppManagerSelectorResult => ({updateComponent, startedAppDataList})
        ),
        createSelector(
            (rootState: RootState) => rootState.windowManager.updateComponent,
            (rootState: RootState) => rootState.windowManager.windowList,
            (updateComponent, windowList): WindowManagerSelectorResult => {
                const windowModeDataList: WindowResultData[] = [];

                for (let window of windowList) {
                    if (window == null)
                        continue;

                    windowModeDataList.push({
                        appId: window.state.appId,
                        isActive: window.state.isActive,
                        windowModeType: window.state.mode.type,
                    });
                }

                return {
                    updateComponent,
                    windowResultDataList: windowModeDataList
                };
            }
        ),
        createSelector(
            (rootState: RootState) => rootState.systemSettings.theme.settings.color.updateComponent,
            (rootState: RootState) => rootState.systemSettings.theme.settings.color,
            (updateComponent, color): ThemeSettingsSelectorResult => ({
                updateComponent,
                themeColorSettings: color
            })
        ),
        (appRegistrySelectorResult, appManagerSelectorResult,
            windowManagerSelectorResult, themeSettingsSelectorResult): AppbarSelectorResult => ({
                appRegistrySelectorResult,
                appManagerSelectorResult,
                windowManagerSelectorResult,
                themeSettingsSelectorResult
            })
    ));

    const {value: registryAppList} = appRegistrySelectorResult.appList;
    const {value: startedAppDataList} = appManagerSelectorResult.startedAppDataList;
    const {windowResultDataList} = windowManagerSelectorResult;
    const {themeColorSettings} = themeSettingsSelectorResult;

    const appManagerDispatch = useDispatch<Dispatch<AppManagerAction>>();
    const windowManagerDispatch = useDispatch<Dispatch<WindowManagerAction>>();

    const themeRGB = useMemo(() => hexToRgb(themeColorSettings.value), [themeColorSettings.value]);
    let themeColor: string = 'rgba(128, 128, 128, 0.6)';

    if (themeRGB)
        themeColor = `rgba(${themeRGB.r}, ${themeRGB.g}, ${themeRGB.b}, 0.6)`;

    const style: CSSProperties = {
        zIndex: appbarZindex,
        backgroundColor: themeColor
    };

    const appbarItemClickHandler = (registryAppId: AppId) => {
        for (let startedAppData of startedAppDataList) {
            if (!startedAppData)
                continue;

            if (startedAppData.appRegistryId === registryAppId) {
                let isHide: boolean = false;

                for (let data of windowResultDataList) {
                    if (data.appId !== startedAppData.appId)
                        continue;

                    if (data.isActive && data.windowModeType !== WindowModeType.Hidden) {
                        isHide = true;
                        break;
                    }
                }

                let windowModeType: WindowModeType = WindowModeType.Standard;

                if (isHide) {
                    windowModeType = WindowModeType.Hidden;
                }
                else {
                    windowManagerDispatch({
                        type: WindowManagerActionTypes.ACTIVE_TOP_APP_WINDOWS,
                        payload: startedAppData.appId
                    });
                }

                windowManagerDispatch({
                    type: WindowManagerActionTypes.SET_ALL_APP_WINDOWS_MODE,
                    payload: {
                        appId: startedAppData.appId,
                        windowModeType
                    }
                });

                return;
            }
        }

        appManagerDispatch({
            type: AppManagerActionTypes.START_REGISTRY_APP,
            payload: registryAppId
        });
    }

    const resetAllWindowsHandler = () => windowManagerDispatch({type: WindowManagerActionTypes.RESET_ALL_WINDOWS});

    const startedAppIdList: AppId[] = [];

    for (let startedAppData of startedAppDataList) {
        if (!startedAppData)
            continue;

        startedAppIdList[startedAppData.appRegistryId] = startedAppData.appId;
    }

    const items: ReactElement[] = registryAppList.map((app, index) => {
        const itemStyle: CSSProperties = {};
        let activeItemClass: string = '';

        if (startedAppIdList[index] != undefined) {
            itemStyle.backgroundColor = themeColor;
            activeItemClass = css.active;
        }

        return (
            <div key={'appbarItem' + index}
                style={itemStyle}
                className={`${css.item} ${activeItemClass}`}
                title={app.name}
                onClick={appbarItemClickHandler.bind(null, index)}
            >
                {app.icon}
            </div>
        );
    });

    const resetAllWindowsItem: ReactElement = (
        <div key="resetAllWindowsItem"
            className={css.item}
            title="Сбросить все окна"
            onClick={resetAllWindowsHandler}
        >
            <Icon url="Appbar/hide_all_windows.svg" />
        </div>
    );

    return (
        <div className={css.appbar} style={style}>
            {items}
            {resetAllWindowsItem}
        </div>
    );
}