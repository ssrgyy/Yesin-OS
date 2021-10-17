import { App } from "../../Components/App/types";
import { Icon } from "../../Components/Icon";
import { Window } from "../../Components/Window";

export const TestingApp: App = {
    name: 'Testing App',
    icon: <Icon />,
    windowComponentList: [
        <Window
            key="WindowTestingApp"
            name="Testing App"
            left={100}
            top={50}
            contentWidth={700}
            contentHeight={450}
            isTest={true}
        />
    ]
}