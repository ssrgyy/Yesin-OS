import css from "./CSS/snake_menu.module.css";
import cssColor from "./CSS/color.module.css";
import React from "react";

export const SnakeMenu: React.FC = ({children}) => (
    <div className={`${css.snake_menu_block} ${cssColor.background_color}`}>
        <div className={css.snake_menu}>
            {children}
        </div>
    </div>
);