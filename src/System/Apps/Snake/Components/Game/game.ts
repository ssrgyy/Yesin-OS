import { Size } from "./game_types";
import { Direction, Position, SnakeBlock } from "./game_types";

const getValidMinPosValue = (posValue: number, mapSizeValue: number): number => posValue < 0 ? mapSizeValue - 1 : posValue;
const getValidMaxPosValue = (posValue: number, mapSizeValue: number): number => posValue > mapSizeValue - 1 ? 0 : posValue;

const getValidMinPos = (pos: Position, mapSize: Size): Position => ({
    x: getValidMinPosValue(pos.x, mapSize.width),
    y: getValidMinPosValue(pos.y, mapSize.height)
});

const getValidMaxPos = (pos: Position, mapSize: Size): Position => ({
    x: getValidMaxPosValue(pos.x, mapSize.width),
    y: getValidMaxPosValue(pos.y, mapSize.height)
});

const calculatePosOfNewSnakeBlock = (snakeLastBlock: SnakeBlock): Position => {
    let newPos: Position = {...snakeLastBlock.pos};

    if (snakeLastBlock.dir === Direction.Right) {
        newPos.x--;
    }
    else if (snakeLastBlock.dir === Direction.Left) {
        newPos.x++;
    }
    else if (snakeLastBlock.dir === Direction.Down) {
        newPos.y--;
    }
    else if (snakeLastBlock.dir === Direction.Up) {
        newPos.y++;
    }

    return newPos;
}



export const createSnake = (length: number, pos: Position, dir: Direction, mapSize: Size): SnakeBlock[] => {
    const mapSizeCopy: Size = {...mapSize};

    if (mapSizeCopy.width < 1)
        mapSizeCopy.width = 1;
    
    if (mapSizeCopy.height < 1)
        mapSizeCopy.height = 1;

    
    if (length < 1)
        length = 1;
    else if (dir === Direction.Right && length > mapSize.width)
        length = mapSize.width;
    else if (dir === Direction.Down && length > mapSize.height)
        length = mapSize.height;



    let newPos: Position = {...pos};

    if (newPos.x < 0 || newPos.x >= mapSize.width)
        newPos.x = 0;

    if (newPos.y < 0 || newPos.y >= mapSize.height)
        newPos.y = 0;

    

    const blockList: SnakeBlock[] = [];

    for (let i = 0; i < length; i++) {
        if (i > 0) {
            newPos = calculatePosOfNewSnakeBlock(blockList[i - 1]);

            newPos = getValidMinPos(newPos, mapSize);
            newPos = getValidMaxPos(newPos, mapSize);
        }

        blockList.push({
            pos: newPos,
            dir,
            prevDir: dir
        });
    }

    return blockList;
}

export const setSnakeDirection = (snakeBlockList: SnakeBlock[], dir: Direction): SnakeBlock[] => {
    if (!isSnakeInit(snakeBlockList))
        return snakeBlockList;

    const {dir: snakeDir} = snakeBlockList[0];

    if (!isValidDirection(snakeDir, dir))
        return snakeBlockList;


    const blockList: SnakeBlock[] = [...snakeBlockList];
    blockList[0].dir = dir;

    return blockList;
}

export const getSnakeDirection = (snakeBLockList: SnakeBlock[]): Direction | undefined => (
    isSnakeInit(snakeBLockList) ? snakeBLockList[0].dir : undefined
);



export const moveSnake = (snakeBlockList: SnakeBlock[], mapSize: Size): SnakeBlock[] => {
    if (!isSnakeInit(snakeBlockList))
        return snakeBlockList;

    const blockList: SnakeBlock[] = [...snakeBlockList];

    for (let i = 0; i < blockList.length; i++) {
        const block: SnakeBlock = blockList[i];
        const {pos} = block;

        if (i > 0) {
            block.prevDir = block.dir;
            block.dir = blockList[i - 1].prevDir;
        }

        if (block.dir === Direction.Right) {
            pos.x = getValidMaxPosValue(pos.x + 1, mapSize.width);
        }
        else if (block.dir === Direction.Left) {
            pos.x = getValidMinPosValue(pos.x - 1, mapSize.width);
        }
        else if (block.dir === Direction.Up) {
            pos.y = getValidMinPosValue(pos.y - 1, mapSize.height);
        }
        else if (block.dir === Direction.Down) {
            pos.y = getValidMaxPosValue(pos.y + 1, mapSize.height);
        }

        if (i === blockList.length - 1)
            blockList[0].prevDir = blockList[0].dir;
    }

    return blockList;
}

export const increaseSnake = (snakeBlockList: SnakeBlock[]): SnakeBlock[] => {
    if (!isSnakeInit(snakeBlockList))
        return snakeBlockList;

    const blockList: SnakeBlock[] = [...snakeBlockList];
    const lastBlock = blockList[blockList.length - 1];

    const newPos = calculatePosOfNewSnakeBlock(lastBlock);

    blockList.push({
        pos: newPos,
        dir: lastBlock.dir,
        prevDir: lastBlock.dir
    });

    return blockList;
}

export const generateFoodPos = (snakeBlockList: SnakeBlock[], mapSize: Size): Position => {
    const generateNewPos = (): Position => ({
        x: Math.floor(Math.random() * mapSize.width),
        y: Math.floor(Math.random() * mapSize.height)
    });

    let newPos: Position = {x: -1, y: -1};
    let isPosGenerated: boolean = true;

    while (snakeBlockList.length < mapSize.width * mapSize.height) {
        newPos = generateNewPos();

        for (let i = 0; i < snakeBlockList.length; i++) {
            const {pos} = snakeBlockList[i];
    
            if (pos.x === newPos.x && pos.y === newPos.y) {
                isPosGenerated = false;
                break;
            }

            isPosGenerated = true;
        }

        if (isPosGenerated)
            break;
    }

    return newPos;
}



export const isSnakeInit = (snakeBlockList: SnakeBlock[]): boolean => snakeBlockList.length > 0;

export const isValidDirection = (curentDir: Direction, nextDir: Direction): boolean => (
    curentDir === Direction.Right && nextDir === Direction.Left ||
    curentDir === Direction.Left && nextDir === Direction.Right ||
    curentDir === Direction.Down && nextDir === Direction.Up ||
    curentDir === Direction.Up && nextDir === Direction.Down ? false : true
);

export const isSnakeOnFood = (snakeBlockList: SnakeBlock[], foodPos: Position): boolean => {
    if (!isSnakeInit(snakeBlockList))
        return false;

    const {pos} = snakeBlockList[0];

    if (pos.x === foodPos.x && pos.y === foodPos.y)
        return true;
    
    return false;
}

export const isSnakeEatItself = (snakeBlockList: SnakeBlock[]): boolean => {
    if (!isSnakeInit(snakeBlockList))
        return false;

    const {pos} = snakeBlockList[0];

    for (let i = 1; i < snakeBlockList.length; i++) {
        const {pos: blockPos} = snakeBlockList[i];

        if (blockPos.x === pos.x && blockPos.y === pos.y)
            return true;
    }

    return false;
}

export const isWon = (snakeBlockList: SnakeBlock[], mapSize: Size): boolean => snakeBlockList.length >= mapSize.width * mapSize.height;