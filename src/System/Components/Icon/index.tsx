import css from "./CSS/icon.module.css";
import React, { CSSProperties } from "react";
import { IconProps } from "./types";

export const Icon: React.FC<IconProps> = ({url}) => {
    const style: CSSProperties = {};
    
    if (url) {
        style.backgroundImage = 'url(./System/Resources/Icons/' + url;
    }

    return <div className={css.icon} style={style} />;
}