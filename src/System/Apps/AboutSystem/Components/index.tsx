import css from "./CSS/about_system.module.css";
import React from "react";

export const AboutSystem: React.FC = () => (
    <div className={css.about_system}>
        <div className={css.main_block}>
            <div className={css.margin_info}>
                <div className={css.system_info}>
                    <p>Yes-OS (Yesin-OS)</p>
                    <p className={css.version_info}>Версия: 0.0.1 (Alpha)</p>
                </div>
                <div className={css.info}>
                    <p>О Разработчике:</p>
                    <p>Есин Сергей</p>
                    <p>GitHub: https://github.com/ssrgyy</p>
                </div>
            </div>
            <div>
                <div className={css.logo}>
                    <p>Y</p>
                    <p>OS</p>
                </div>
            </div>
        </div>
        <div className={`${css.margin_info} ${css.info}`}>
            <p>В Планах:</p>
            <ul>
                <li>Улучшить систему приложений</li>
                <li>API для взаимодействия приложений с ОС</li>
                <li>Переписать алгоритмы без использования CSS Z-Index</li>
            </ul>
        </div>
    </div>
);