import { App } from "../../Components/App/types";
import { Icon } from "../../Components/Icon";
import { Window } from "../../Components/Window";
import { Calculator as CalculatorComponent } from "./Components";

export const Calculator: App = {
    name: 'Калькулятор',
    icon: <Icon url="Apps/calculator.svg" />,
    windowComponentList: [
        <Window
            key="WindowCalculator"
            name="Калькулятор"
            left={200}
            top={100}
            contentWidth={300}
            contentHeight={375}
            minContentWidth={300}
            minContentHeight={375}
            isBackgroundTransparent={true} >
            <CalculatorComponent />
        </Window>
    ]
};