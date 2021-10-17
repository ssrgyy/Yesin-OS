import css from './CSS/sizebox.module.scss';
import { SizeboxProps, SizeboxSide } from './types';

export const Sizebox: React.FC<SizeboxProps> = ({sizeboxSizeHandler}) => (
    <>
        <div
            className={css.sizebox_top_left}
            onMouseDown={event => sizeboxSizeHandler(event, SizeboxSide.TopLeft)}
        />
        <div
            className={css.sizebox_top}
            onMouseDown={event => sizeboxSizeHandler(event, SizeboxSide.Top)}
        />
        <div
            className={css.sizebox_top_right}
            onMouseDown={event => sizeboxSizeHandler(event, SizeboxSide.TopRight)}
        />
        <div
            className={css.sizebox_right}
            onMouseDown={event => sizeboxSizeHandler(event, SizeboxSide.Right)}
        />
        <div
            className={css.sizebox_bottom_right}
            onMouseDown={event => sizeboxSizeHandler(event, SizeboxSide.BottomRight)} 
        />
        <div
            className={css.sizebox_bottom}
            onMouseDown={event => sizeboxSizeHandler(event, SizeboxSide.Bottom)}
        />
        <div
            className={css.sizebox_bottom_left}
            onMouseDown={event => sizeboxSizeHandler(event, SizeboxSide.BottomLeft)}
        />
        <div
            className={css.sizebox_left}
            onMouseDown={event => sizeboxSizeHandler(event, SizeboxSide.Left)}
        />
    </>
);