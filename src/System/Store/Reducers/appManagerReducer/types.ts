import { UpdateableComponent } from "../../../Component/Update/types";
import { AppId } from "../../../Components/App/types";

export interface StartRegistryAppId extends UpdateableComponent {
    value?: AppId;
}

export interface AppData {
    appId: AppId;
    appRegistryId: AppId;
}

export type AppDataList = (AppData | undefined)[];

export interface StartedAppDataList extends UpdateableComponent {
    value: AppDataList;
}

export interface FreeAppIdList extends UpdateableComponent {
    value: AppId[];
}

export interface AppManagerState {
    startRegistryAppId: StartRegistryAppId;
    startedAppDataList: StartedAppDataList;
    freeAppIdList: FreeAppIdList;
}

export enum AppManagerActionTypes {
    START_REGISTRY_APP = 'START_REGISTRY_APP',
    ADD_STARTED_APP_ID = 'ADD_STARTED_APP_ID',
    CLEAR_START_REGISTRY_APP_ID = 'CLEAR_START_REGISTRY_APP_ID',
    TERMINATE_APP = 'TERMINATE_APP'
}

export type StartRegistryAppPayload = AppId;

interface StartRegistryAppAction {
    type: AppManagerActionTypes.START_REGISTRY_APP;
    payload: StartRegistryAppPayload;
}

export type AddStartedAppIdPayload = AppData;

interface AddStartedAppIdAction {
    type: AppManagerActionTypes.ADD_STARTED_APP_ID;
    payload: AddStartedAppIdPayload;
}

interface ClearStartRegistryAppIdAction {
    type: AppManagerActionTypes.CLEAR_START_REGISTRY_APP_ID;
}

export type TerminateAppPayload = AppId;

interface TerminteAppAction {
    type: AppManagerActionTypes.TERMINATE_APP;
    payload: TerminateAppPayload;
}

export type AppManagerAction =
    StartRegistryAppAction
    | AddStartedAppIdAction
    | ClearStartRegistryAppIdAction
    | TerminteAppAction;