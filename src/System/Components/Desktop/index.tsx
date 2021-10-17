import css from "./CSS/desktop.module.css"
import React, { Dispatch, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { SystemSettingsAction, SystemSettingsActionTypes } from "../../Store/Reducers/systemSettingsReducer/types";
import { Appbar } from "../Appbar";

export const Desktop: React.FC = () => {
    const systemSettingsDispatch = useDispatch<Dispatch<SystemSettingsAction>>();
    const contentRef = useRef<HTMLDivElement>(null);

    const setWindowSettings = useCallback(() => {
        if (!contentRef.current)
            return;

        const {clientWidth, clientHeight} = contentRef.current;

        systemSettingsDispatch({
            type: SystemSettingsActionTypes.SET_WINDOW_MAX_SIZE,
            payload: {
                width: clientWidth,
                height: clientHeight
            }
        });
    }, []);

    useEffect(() => {
        setWindowSettings();
        window.addEventListener('resize', setWindowSettings);

        return () => window.removeEventListener('resize', setWindowSettings);
    }, []);
    
    return (
        <div className={`${css.dekstop} ${css.wallpaper}`}>
            <div className={css.content} ref={contentRef}></div>
            <div className={css.system_panels}>
                <Appbar />
            </div>
        </div>
    );
}