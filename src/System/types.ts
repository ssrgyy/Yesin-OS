export interface PositionLeft {
    left: number;
}

export interface PositionTop {
    top: number;
}

export interface Position extends PositionLeft, PositionTop {}

export type PositionType = Position | PositionLeft | PositionTop;

export interface SizeWidth {
    width: number;
}

export interface SizeHeight {
    height: number;
}
  
export interface Size extends SizeWidth, SizeHeight {}

export type SizeType = Size | SizeWidth | SizeHeight;

export interface CoordinatesPos {
    pos: PositionType;
}

export interface CoordinatesSize {
    size: SizeType;
}

export interface Coordinates extends CoordinatesPos, CoordinatesSize {}

export interface ExplicitCoordinates {
    pos: Position;
    size: Size;
}

export type CoordinatesType = ExplicitCoordinates | Coordinates | CoordinatesPos | CoordinatesSize;

export const instanceOfPosition = (object: any): object is Position => {
    return ('left' in object) && ('top' in object);
}

export const instanceOfPositionLeft = (object: any): object is PositionLeft => {
    return ('left' in object) && !('top' in object);
}

export const instanceOfPositionTop = (object: any): object is PositionTop => {
    return !('left' in object) && ('top' in object);
}

export const instanceOfSize = (object: any): object is Size => {
    return ('width' in object) && ('height' in object);
}

export const instanceOfSizeWidth = (object: any): object is SizeWidth => {
    return ('width' in object) && !('height' in object);
}

export const instanceOfSizeHeight = (object: any): object is SizeHeight => {
    return !('width' in object) && ('height' in object);
}

export const instanceOfCoordinates = (object: any): object is Coordinates => {
    return ('pos' in object) && ('size' in object);
}

export const instanceOfCoordinatesPos = (object: any): object is CoordinatesPos => {
    return ('pos' in object) && !('size' in object);
}

export const instanceOfCoordinatesSize = (object: any): object is CoordinatesSize => {
    return !('pos' in object) && ('size' in object);
}