import css from "./CSS/menu.module.css";
import React from "react";
import { MenuProps } from "./types";

export const Menu: React.FC<MenuProps> = ({children, text}) => {
    return (
        <div className={css.menu}>
            <p className={css.text}>{text}</p>
            {children}
            <div/>
        </div>
    );
}