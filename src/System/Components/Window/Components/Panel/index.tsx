import css from './CSS/panel.module.css';
import React, { CSSProperties } from 'react';
import { PanelProps } from './types';

export const Panel: React.FC<PanelProps> = (props) => {
    const style: CSSProperties = {
        height: props.height
    };

    const colorboxStyle: CSSProperties = {
        backgroundColor: props.backgroundColor
    };

    if (!props.isActive) {
        style.backgroundColor = 'white';
        colorboxStyle.opacity = '0.6';
    }

    return (
        <div className={css.panel} style={style}>
            <div className={css.colorbox} style={colorboxStyle}>
                <div id={css.control_panel} className={css.control_panel}>
                    <div className={css.hide_button} title="Скрыть"
                        onClick={props.hideButtonClickHandler} />
                    <div className={css.full_button} title="На весь экран"
                        onClick={props.fullButtonClickHandler} />
                    <div className={css.close_button} title="Закрыть"
                        onClick={props.closeButtonClickHandler} />
                </div>
                <div id={css.additional_control_panel}
                    className={css.additional_control_panel}
                >
                    <div className={css.reset_button} title="Сбросить"
                        onClick={props.resetButtonClickHandler} />
                </div>
                <div className={css.text_panel}
                    onMouseDown={props.activeboxMouseDownHandler}
                    onDoubleClick={props.fullButtonClickHandler}
                >
                    <p>{props.name}</p>
                </div>
            </div>
        </div>
    );
}