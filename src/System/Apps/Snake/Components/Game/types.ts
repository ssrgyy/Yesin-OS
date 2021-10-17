import { Direction, SnakeBlock } from "./game_types";

export interface PauseState {
    isOnPause: boolean;
}

export interface DirectionState {
    dir: Direction;
}

export type Snake = SnakeBlock[];