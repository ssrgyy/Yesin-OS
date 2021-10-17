import React from "react";
import { Provider } from "react-redux";
import { store } from "./Store";
import { SystemView } from "./Components/SystemView";

export const System: React.FC = () => (
    <Provider store={store}>
        <SystemView />
    </Provider>
);