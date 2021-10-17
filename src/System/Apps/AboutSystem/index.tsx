import { App } from "../../Components/App/types";
import { Icon } from "../../Components/Icon";
import { Window } from "../../Components/Window";
import { AboutSystem as AboutSystemComponent } from "./Components";

export const AboutSystem: App = {
    name: 'О Системе',
    icon: <Icon url="Apps/about_system.png" />,
    windowComponentList: [
        <Window
            key="WindowAboutSystem"
            name="О Системе"
            left={200}
            top={100}
            width={700}
            height={450}
            minWidth={700}
            minHeight={450}
            isBackgroundTransparent={true}
        >
            <AboutSystemComponent />
        </Window>
    ]
};