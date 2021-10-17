import { App } from "../../Components/App/types";
import { Icon } from "../../Components/Icon";
import { Window } from "../../Components/Window";
import { Snake as SnakeComponent } from "./Components";

export const Snake: App = {
    name: 'Змейка',
    icon: <Icon url="Apps/snake_game.png" />,
    windowComponentList: [
        <Window
            key="WindowSnake"
            name="Змейка"
            left={200}
            top={100}
            contentWidth={400}
            contentHeight={445}
            minContentWidth={400}
            minContentHeight={445}
            isBackgroundTransparent={true}
            frameColor="#68b854"
        >
            <SnakeComponent />
        </Window>
    ]
};