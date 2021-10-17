import css from "./CSS/game.module.css";
import cssColor from "../SnakeMenu/CSS/color.module.css";
import cssMenuButton from "../Menu/Components/MenuButton/CSS/menu_button.module.css";
import React, { ReactElement, CSSProperties, useEffect, useState, useRef, useMemo, useCallback } from "react";
import { ComponentUpdate } from "../../../../Component/Update/types";
import { Position, Size, SnakeBlock } from "./game_types";
import { Direction } from "./game_types";
import { createSnake, setSnakeDirection, moveSnake, isSnakeOnFood, increaseSnake, isSnakeEatItself, generateFoodPos, isValidDirection, getSnakeDirection, isWon } from "./game";
import { Snake, PauseState, DirectionState } from "./types";
import { Menu } from "../Menu";
import { MenuButton } from "../Menu/Components/MenuButton";
import { MenuText } from "../Menu/Components/MenuText";
import { SnakeMenu } from "../SnakeMenu";
import { controlInputs, isControlInputActive } from "./ControInput";

const timerTimeout: number = 100;
const mapSize: Size = {
    width: 10,
    height: 10
};

const initSnake = (): SnakeBlock[] => createSnake(1, {x: 0, y: 0}, Direction.Right, mapSize);

export const Game: React.FC = () => {
    const [isInit, setIsInit] = useState<boolean>(false);
    const [isWin, setIsWin] = useState<boolean>(false);
    const [updateTimeout, setUpdateTimeout] = useState<ComponentUpdate>({});
    const [pauseState, setPauseState] = useState<PauseState>({isOnPause: false});
    const [updateTimeoutId, setUpdateTimeoutId] = useState<number>(0);
    const [foodPos, setFoodPos] = useState<Position>({x: 0, y: 0});
    const [snakeDir, setSnakeDir] = useState<Direction>(Direction.Right);
    const [snakeNextDirState, setSnakeNextDirState] = useState<DirectionState>({dir: Direction.Right});
    const [snake, setSnake] = useState<Snake>(useMemo(initSnake, []));
    const [score, setScore] = useState<number>(0);

    const updateTimer = () => setUpdateTimeout({});

    useEffect(() => {
        if (isInit)
            return;

        setFoodPos(generateFoodPos(snake, mapSize));
        setIsInit(true);
        updateTimer();
    }, [isInit]);

    useEffect(() => {
        if (!isInit || pauseState.isOnPause)
            return;

        setUpdateTimeoutId(window.setTimeout(() => {
            const newSnakeDir = getSnakeDirection(snake);

            if (newSnakeDir != undefined)
                setSnakeDir(newSnakeDir);

            let snakeCopy: Snake = moveSnake(snake, mapSize);

            if (isWon(snakeCopy, mapSize)) {
                setUpdateTimeoutId(0);
                setIsWin(true);
                return;
            }

            if (isSnakeEatItself(snakeCopy)) {
                startNewGameHandler();
                return;
            }

            if (isSnakeOnFood(snakeCopy, foodPos)) {
                snakeCopy = increaseSnake(snakeCopy);
                setFoodPos(generateFoodPos(snakeCopy, mapSize));
                setScore(prevState => prevState + 1);
            }

            setSnake(snakeCopy);
            updateTimer();
        }, timerTimeout));
    }, [pauseState, updateTimeout]);

    useEffect(() => {
        if (!isValidDirection(snakeDir, snakeNextDirState.dir))
            return;

        setSnake(setSnakeDirection(snake, snakeNextDirState.dir));
    }, [snakeNextDirState]);

    useEffect(() => {
        document.addEventListener('keydown', documentKeydownHandler);
        return () => {
            document.removeEventListener('keydown', documentKeydownHandler);

            setUpdateTimeoutId(prevState => {
                clearTimeout(prevState);
                return prevState;
            });
        }
    }, []);

    const documentKeydownHandler = useCallback((event: KeyboardEvent): void => {
        let newDir: Direction | undefined = undefined;

        if (isControlInputActive(controlInputs.right, event.code)) {
            newDir = Direction.Right;
        }
        else if (isControlInputActive(controlInputs.left, event.code)) {
            newDir = Direction.Left;
        }
        else if (isControlInputActive(controlInputs.down, event.code)) {
            newDir = Direction.Down;
        }
        else if (isControlInputActive(controlInputs.up, event.code)) {
            newDir = Direction.Up;
        }

        if (newDir == undefined)
            return;

        setPauseState(prevState => {
            if (newDir != undefined && !prevState.isOnPause)
                setSnakeNextDirState({dir: newDir});
            
            return prevState;
        });
    }, []);

    const pauseHandler = () => {
        if (updateTimeoutId > 0) {
            clearTimeout(updateTimeoutId);
            setUpdateTimeoutId(0);
        }
        
        setPauseState(prevState => ({isOnPause: !prevState.isOnPause}));
    }

    const pauseButtonClickHandler = (event: React.MouseEvent) => {
        pauseHandler();

        const target = event.target as HTMLButtonElement;
        target.blur();
    }

    const startNewGameHandler = () => {
        const snakeCopy: Snake = initSnake();

        setSnake(snakeCopy);
        setFoodPos(generateFoodPos(snakeCopy, mapSize));
        setScore(0);
        setIsWin(false);
        setPauseState({isOnPause: false});
    }

    const renderGrid = (): ReactElement[] => {
        const calculateSnakeBlockClass = (x: number, y: number, oldBlockClass: string = ''): string => {
            for (let i = 0; i < snake.length; i++) {
                const {pos} = snake[i];
    
                if (pos.x === x && pos.y === y) {
                    if (i === 0)
                        return css.snake_head;
            
                    return css.snake_body;
                }
            }

            return oldBlockClass;
        }

        const row: ReactElement[] = [];
    
        for (let i = 0; i < mapSize.height; i++) {
            const column: ReactElement[] = [];
    
            for (let j = 0; j < mapSize.width; j++) {
                let newClass = '';
    
                if (foodPos.x === j && foodPos.y === i)
                    newClass = css.food;

                newClass = calculateSnakeBlockClass(j, i, newClass);
    
                column.push(<div key={'gridBlock' + j} className={`${css.grid_block} ${newClass}`} />);
            }
    
            row.push(<div key={'gridRow' + i} className={css.grid_row}>{column}</div>);
        }
    
        return row;
    }

    const grid: ReactElement[] = useMemo(renderGrid, [pauseState, updateTimeout]);

    const gridWrapperRef = useRef<HTMLDivElement>(null);
    let gridStyle: CSSProperties = {};

    if (gridWrapperRef.current) {
        const {clientWidth, clientHeight} = gridWrapperRef.current;

        gridStyle = {
            width: clientWidth > clientHeight ? clientHeight : clientWidth,
            height: clientHeight > clientWidth ? clientWidth : clientHeight
        };
    }

    const game: ReactElement = (
        <div className={`${css.game} ${cssColor.background_color}`}>
            <div className={css.control_panel}>
                <div className={css.score_block}>
                    <p>Счёт: {score}</p>
                </div>
                <div className={css.pause_block}>
                    <button className={cssMenuButton.item} onClick={pauseButtonClickHandler}>Пауза</button>
                </div>
            </div>
            <div className={css.grid_wrapper} ref={gridWrapperRef}>
                <div className={css.grid} style={gridStyle}>
                    {pauseState.isOnPause ? null : grid}
                </div>
            </div>
        </div>
    );

    const pauseMenu: ReactElement = useMemo(() => {
        if (!pauseState.isOnPause)
            return <></>;

        return (
            <SnakeMenu>
                <Menu text="Пауза">
                    <MenuText>Счёт: {score}</MenuText>
                    <MenuButton text="Продолжить" onClick={pauseHandler} />
                    <MenuButton text="Новая игра" onClick={startNewGameHandler} />
                </Menu>
            </SnakeMenu>
        );
    }, [pauseState]);

    const winMenu: ReactElement = useMemo(() => {
        if (!isWin)
            return <></>;

        return (
            <SnakeMenu>
                <Menu text="Победа!">
                    <MenuText>Счёт: {score}</MenuText>
                    <MenuButton text="Новая игра" onClick={startNewGameHandler} />
                </Menu>
            </SnakeMenu>
        );
    }, [isWin]);

    return isWin ? winMenu : pauseState.isOnPause ? pauseMenu : game;
}