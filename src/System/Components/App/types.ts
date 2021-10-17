import { ReactElement } from "react";
import { WindowComponent } from "../../Store/Reducers/windowManagerReducer/types";

export type AppId = number;

export interface App {
    name: string;
    icon: ReactElement;
    windowComponentList: WindowComponent[];
}