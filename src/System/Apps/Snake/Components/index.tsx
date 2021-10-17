import React, { ReactElement, useState } from "react";
import { Menu } from "./Menu";
import { MenuButton } from "./Menu/Components/MenuButton";
import { SnakeMenu } from "./SnakeMenu";
import { Game } from "./Game";

export const Snake: React.FC = () => {
    const [isGameStart, setIsGameStart] = useState(false);

    const menu: ReactElement = (
        <SnakeMenu>
            <Menu text="Змейка">
                <MenuButton text="Играть"
                    onClick={setIsGameStart.bind(null, true)} />
            </Menu>
        </SnakeMenu>
    );

    return isGameStart ? <Game /> : menu;
}