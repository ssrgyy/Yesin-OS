import css from "./CSS/system_view.module.css";
import React, { ReactNode, Dispatch, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { SystemSettingsAction, SystemSettingsActionTypes } from "../../Store/Reducers/systemSettingsReducer/types";
import { Position, Size } from "../../types";
import { AppManager } from "../AppManager";
import { Desktop } from "../Desktop";
import { WindowManager } from "../WindowManager";

export const SystemView: React.FC = () => {
    const [isInit, setIsInit] = useState(false);
    const systemSettingsDispatch = useDispatch<Dispatch<SystemSettingsAction>>();
    const systemElementRef = useRef<HTMLDivElement>(null);
    
    const prevScreenPos: Position = {left: 0, top: 0};

    const setSystemSettings = useCallback(() => {
        if (!systemElementRef.current)
            return;        

        const {offsetLeft, offsetTop, offsetWidth, offsetHeight} = systemElementRef.current;

        const newScreenSize: Size = {
            width: offsetWidth,
            height: offsetHeight
        };

        systemSettingsDispatch({
            type: SystemSettingsActionTypes.SET_SCREEN_SIZE,
            payload: newScreenSize
        });

        systemSettingsDispatch({
            type: SystemSettingsActionTypes.SET_WINDOW_MAX_SIZE,
            payload: newScreenSize
        });

        if (prevScreenPos.left === offsetLeft && prevScreenPos.top === offsetTop)
            return;

        prevScreenPos.left = offsetLeft;
        prevScreenPos.top = offsetTop;

        systemSettingsDispatch({
            type: SystemSettingsActionTypes.SET_SCREEN_POS,
            payload: prevScreenPos
        });
    }, []);

    useEffect(() => {
        setSystemSettings();
        window.addEventListener('resize', setSystemSettings);
        setIsInit(true);

        return () => window.removeEventListener('resize', setSystemSettings);
    }, []);

    const systemView: ReactNode = useMemo(() => {
        if (!isInit)
            return null;

        return (
            <>
                <AppManager />
                <Desktop />
                <WindowManager />
            </>
        );
    }, [isInit]);
    
    return (
        <div className={css.System} ref={systemElementRef}>
            {isInit ? systemView : null}
        </div>
    );
}