import { AppRegistryAction, AppRegistryActionTypes, AppRegistryState } from "./types";
import { AboutSystem } from "../../../Apps/AboutSystem";
import { Calculator } from "../../../Apps/Calculator";
import { Snake } from "../../../Apps/Snake";
import { PDFReader } from "../../../Apps/PDFReader";
import { TestingApp } from "../../../Apps/TestingApp";

export const initialAppRegistryState: AppRegistryState = {
    appList: {
        updateComponent: {},
        value: [
            AboutSystem,
            Calculator,
            Snake,
            PDFReader,
            TestingApp
        ]
    }
};

export const appRegistryReducer = (state: AppRegistryState = initialAppRegistryState, action: AppRegistryAction): AppRegistryState => {
    switch (action.type) {
        case AppRegistryActionTypes.TEST:
            return state;

        default:
            return state;
    }
}