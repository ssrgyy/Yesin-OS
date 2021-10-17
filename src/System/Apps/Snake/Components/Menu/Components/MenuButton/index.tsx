import css from "./CSS/menu_button.module.css";
import React from "react";
import { MenuButtonProps } from "./types";

export const MenuButton: React.FC<MenuButtonProps> = ({text, onClick}) => (
    <button className={css.item} onClick={onClick}>{text}</button>
);