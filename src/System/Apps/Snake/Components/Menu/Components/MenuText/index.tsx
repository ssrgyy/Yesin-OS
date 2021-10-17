import css from "./CSS/menu_text.module.css";
import React from "react";

export const MenuText: React.FC = ({children}) => <p className={css.text}>{children}</p>;