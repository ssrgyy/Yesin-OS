export enum Direction { Up, Right, Down, Left };

export interface Size {
    width: number;
    height: number;
}

export interface Position {
    x: number;
    y: number;
}

export interface SnakeBlock {
    pos: Position;
    dir: Direction;
    prevDir: Direction;
}