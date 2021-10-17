import React from "react";

export interface SizeboxProps {
    sizeboxSizeHandler: (event: React.MouseEvent, sizeboxSide: SizeboxSide) => void;
}

export enum SizeboxSide {
    TopLeft,
    Top,
    TopRight,
    Right,
    BottomRight,
    Bottom,
    BottomLeft,
    Left
}

export enum CursorType {
    TopLeft = 'nw-resize',
    Top = 'n-resize',
    TopRight = 'ne-resize',
    Right = 'w-resize',
    BottomRight = 'se-resize',
    Bottom = 's-resize',
    BottomLeft = 'sw-resize',
    Left = 'e-resize'
}