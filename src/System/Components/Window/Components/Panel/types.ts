import { WindowName } from '../../types';
import { WindowId } from '../../../../Store/Reducers/windowManagerReducer/types';
import { ReactMouseEventHandler } from '../../../../Events/Mouse/types';

export interface PanelProps {
    windowId: WindowId;
    name: WindowName;
    height: number;
    backgroundColor: string;
    isActive: boolean;
    activeboxMouseDownHandler: ReactMouseEventHandler;
    closeButtonClickHandler: ReactMouseEventHandler;
    fullButtonClickHandler: ReactMouseEventHandler;
    hideButtonClickHandler: ReactMouseEventHandler;
    resetButtonClickHandler: ReactMouseEventHandler;
}