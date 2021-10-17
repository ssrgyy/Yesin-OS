import { UpdateableComponent } from "../../../Component/Update/types";
import { App } from "../../../Components/App/types";

export interface AppList extends UpdateableComponent {
    value: App[];
}

export interface AppRegistryState {
    appList: AppList;
}

export enum AppRegistryActionTypes {
    TEST = 'TEST'
}

interface AppRegistryTestAction {
    type: AppRegistryActionTypes.TEST
}

export type AppRegistryAction =
    AppRegistryTestAction;