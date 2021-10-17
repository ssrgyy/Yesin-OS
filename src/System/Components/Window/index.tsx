import css from "./CSS/window.module.css";
import testBlockCss from "./TestBlock/CSS/test_block.module.css";
import React, { ReactElement, CSSProperties, Dispatch, useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "../../Store/Reducers";
import { Sizebox } from "./Components/Sizebox";
import { Panel } from "./Components/Panel";
import { CoordinatesType, Position, PositionType, Size, SizeType } from "../../types";
import { MousePos } from "../../Mouse/types";
import { CursorType, SizeboxSide } from "./Components/Sizebox/types";
import { defaultThemeColor } from "../../Store/Reducers/systemSettingsReducer";
import { convertStringToInt } from "../../Functions/Сonversion";
import { WindowSettingsSelectorResult, WindowModeType, WindowProps, WindowSelectorResult, WindowState, WindowStateSelectorResult, WindowDisposeHandlers } from "./types";
import { WindowManagerAction, WindowManagerActionTypes} from "../../Store/Reducers/windowManagerReducer/types";
import { SystemSettingsAction, SystemSettingsActionTypes } from "../../Store/Reducers/systemSettingsReducer/types";
import { calculateMinSizeValue, calculateMinPosValue, calculateMinSize, calculateMaxSize, calculateMaxSizeValue } from "../../Store/Reducers/windowManagerReducer";
import { TestBlockCreateWindowNameInput, TestBlockColor, TestBlockStatus } from "./TestBlock/types";

export const initialWindowState: WindowState = {
    id: -1,
    appId: -1,
    zIndex: 0,
    name: 'Новое окно',
    pos: {
        left: 0,
        top: 0
    },
    size: {
        width: 640,
        height: 360
    },
    contentSize: {
        width: 0,
        height: 0
    },
    minSize: {
        width: 0,
        height: 0,
    },
    maxSize: {
        width: 0,
        height: 0
    },
    isActive: false,
    mode: {
        type: 0,
        prevMode: {
            state: {
                pos: {
                    left: 0,
                    top: 0
                },
                size: {
                    width: 600,
                    height: 300
                }
            },
            type: 0
        }
    },
    isBackgroundTransparent: false
};

export const Window: React.FC<WindowProps> = (props) => {
    const id = props.id == undefined ? initialWindowState.id : props.id;

    const {
        stateSelectorResult,
        windowSettingsSelectorResult,
        themeSettingsSelectorResult,
        screenSettingsSelectorResult
    }: WindowSelectorResult = useSelector(createSelector(
        createSelector(
            (rootState: RootState) => rootState.windowManager.windowList[id]?.updateComponent,
            (rootState: RootState) => rootState.windowManager.windowList[id]?.state,
            (updateComponent, state): WindowStateSelectorResult => {
                if (updateComponent != undefined && state != undefined)
                    return {updateComponent, state};

                return {
                    updateComponent: {},
                    state: {...initialWindowState}
                };
            }
        ),
        createSelector(
            (rootState: RootState) => rootState.systemSettings.window.settings.borderLengths.updateComponent,
            (rootState: RootState) => rootState.systemSettings.window.settings.borderLengths,
            (rootState: RootState) => rootState.systemSettings.window.settings.borderRadius.updateComponent,
            (rootState: RootState) => rootState.systemSettings.window.settings.borderRadius,
            (rootState: RootState) => rootState.systemSettings.window.settings.minSize.updateComponent,
            (rootState: RootState) => rootState.systemSettings.window.settings.minSize,
            (borderLengthsUpdate, borderLengths, borderRadiusUpdate, borderRadius,
                minSizeUpdate, minSize): WindowSettingsSelectorResult => ({
                    windowBorderLengthsSettingsUpdate: borderLengthsUpdate,
                    windowBorderLengthsSettings: borderLengths,
                    windowBorderRadiusSettingsUpdate: borderRadiusUpdate,
                    windowBorderRadiusSettings: borderRadius,
                    windowMinSizeSettingsUpdate: minSizeUpdate,
                    windowMinSizeSettings: minSize
                })
        ),
        createSelector(
            (rootState: RootState) => rootState.systemSettings.theme.settings.color.updateComponent,
            (rootState: RootState) => rootState.systemSettings.theme.settings.color,
            (colorUpdate, color) => ({
                themeColorSettingsUpdate: colorUpdate,
                themeColorSettings: color
            })
        ),
        createSelector(
            (rootState: RootState) => rootState.systemSettings.screen.settings.size.updateComponent,
            (rootState: RootState) => rootState.systemSettings.screen.settings.size,
            (rootState: RootState) => rootState.systemSettings.screen.settings.pos.updateComponent,
            (rootState: RootState) => rootState.systemSettings.screen.settings.pos,
            (sizeUpdate, size, posUpdate, pos) => ({
                screenSizeSettingsUpdate: sizeUpdate,
                screenSizeSettings: size,
                screenPosSettingsUpdate: posUpdate,
                screenPosSettings: pos
            })
        ),
        (stateSelectorResult, windowSettingsSelectorResult,
            themeSettingsSelectorResult, screenSettingsSelectorResult): WindowSelectorResult => ({
                stateSelectorResult,
                windowSettingsSelectorResult,
                themeSettingsSelectorResult,
                screenSettingsSelectorResult
            })
    ));

    const windowManagerDispatch = useDispatch<Dispatch<WindowManagerAction>>();
    const systemSettingsDispatch = useDispatch<Dispatch<SystemSettingsAction>>();

    const [disposeHandlers, setDisposeHandlers] = useState<WindowDisposeHandlers>({});
    const [cursorType, setCursorType] = useState<CursorType>();

    useEffect(() => () => {
        const {
            sizeboxMousemoveHandler,
            sizeboxMouseupHandler,
            panelActiveboxMousemoveHandler,
            panelActiveboxMouseupHandler
        } = disposeHandlers;

        if (sizeboxMousemoveHandler)
            document.removeEventListener('mousemove', sizeboxMousemoveHandler);

        if (sizeboxMouseupHandler)
            document.removeEventListener('mouseup', sizeboxMouseupHandler);

        if (panelActiveboxMousemoveHandler)
            document.removeEventListener('mousemove', panelActiveboxMousemoveHandler);

        if (panelActiveboxMouseupHandler)
            document.removeEventListener('mouseup', panelActiveboxMouseupHandler);
    }, []);

    const {state} = stateSelectorResult;

    const {
        windowBorderLengthsSettings,
        windowBorderRadiusSettings,
        windowMinSizeSettings
    } = windowSettingsSelectorResult;

    const {themeColorSettings} = themeSettingsSelectorResult;
    const {screenPosSettings, screenSizeSettings} = screenSettingsSelectorResult;

    const frameColor: string = state.frameColor == undefined
        ? themeColorSettings.value
        : state.frameColor;    
    
    const style: CSSProperties = {
        display: 'block',
        position: 'fixed',
        left: state.pos.left, top: state.pos.top,
        width: state.size.width, height: state.size.height,
        zIndex: state.zIndex,
        borderRadius: windowBorderRadiusSettings.value,
    };

    if (state.mode.type !== WindowModeType.Hidden)
        style.boxShadow = '0 0 10px 0 rgba(0, 0, 0, 0.5)';

    const wrapperStyle: CSSProperties  = {
        borderRadius: style.borderRadius
    }

    const contentStyles: CSSProperties = {
        width: state.contentSize.width,
        height: state.contentSize.height
    };

    if (state.isBackgroundTransparent)
        contentStyles.backgroundColor = 'transparent';

    const contentActiveboxStyle: CSSProperties = {
        position: 'fixed',
        width: state.contentSize.width,
        height: state.contentSize.height
    };

    const activeboxStyle: CSSProperties = {
        position: 'fixed',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };

    const mousedownHandler = (event: React.MouseEvent) => {
        if (!state.isActive)
            windowManagerDispatch({type: WindowManagerActionTypes.ACTIVE_WINDOW, payload: id});
    }
    
    const sizeboxSizeHandler = (event: React.MouseEvent, sizeboxSide: SizeboxSide) => {
        if (event.button !== 0)
            return;

        const prevMousePos: MousePos = {x: 0, y: 0};
        let posState: Position = state.pos;
        const minSizeState: Size = state.minSize;
        const maxSizeState: Size = state.maxSize;

        let sizeState: Size = state.size;

        const systemWindowMinSize: Size = windowMinSizeSettings.value;

        const screenSize: Size = screenSizeSettings.value;
        const screenPos: Position = screenPosSettings.value;

        const mousemoveGlobalHandler = (event: MouseEvent) => {
            let newCoords: CoordinatesType | undefined = undefined;

            if (sizeboxSide === SizeboxSide.Right) {
                sizeState.width = event.pageX - posState.left;
                newCoords = {size: {width: sizeState.width}};
            }
            else if (sizeboxSide === SizeboxSide.Bottom) {
                sizeState.height = event.pageY - posState.top;
                newCoords = {size: {height: sizeState.height}};
            }
            else if (sizeboxSide === SizeboxSide.BottomRight) {
                sizeState.width = event.pageX - posState.left;
                sizeState.height = event.pageY - posState.top;

                newCoords = {size: sizeState};
            }
            else if (sizeboxSide === SizeboxSide.Left) {
                const prevLength = posState.left + sizeState.width;

                sizeState.width = sizeState.width + (posState.left - calculateMinPosValue(event.pageX, screenPos.left));
                sizeState.width = calculateMinSizeValue(sizeState.width, minSizeState.width, systemWindowMinSize.width);
                sizeState.width = calculateMaxSizeValue(sizeState.width, posState.left, screenPos.left, maxSizeState.width, screenSize.width);

                posState.left = prevLength - sizeState.width;

                newCoords = {
                    pos: {left: posState.left},
                    size: {width: sizeState.width}
                };
            }
            else if (sizeboxSide === SizeboxSide.Top) {
                const prevTopLength = posState.top + sizeState.height;

                sizeState.height = sizeState.height + (posState.top - calculateMinPosValue(event.pageY, screenPos.top));
                sizeState.height = calculateMinSizeValue(sizeState.height, minSizeState.height, systemWindowMinSize.height);
                sizeState.height = calculateMaxSizeValue(sizeState.height, posState.top, screenPos.top, maxSizeState.height, screenSize.height);
                
                posState.top = prevTopLength - sizeState.height;

                newCoords = {
                    pos: {top: posState.top},
                    size: {height: sizeState.height}
                };
            }
            else if (sizeboxSide === SizeboxSide.BottomLeft) {
                const prevLeftLength = posState.left + sizeState.width;

                sizeState.width = sizeState.width + (posState.left - calculateMinPosValue(event.pageX, screenPos.left));
                sizeState.height = calculateMinPosValue(event.pageY, screenPos.top) - posState.top;

                sizeState.width = calculateMinSizeValue(sizeState.width, minSizeState.width, systemWindowMinSize.width);
                sizeState = calculateMaxSize(sizeState, posState, screenPos, maxSizeState, screenSize);

                posState.left = prevLeftLength - sizeState.width;

                newCoords = {
                    pos: {left: posState.left},
                    size: sizeState
                };
            }
            else if (sizeboxSide === SizeboxSide.TopRight) {
                const prevTopLength = posState.top + sizeState.height;

                sizeState.width = calculateMinPosValue(event.pageX, screenPos.top) - posState.left;
                sizeState.height = sizeState.height + (posState.top - calculateMinPosValue(event.pageY, screenPos.top));

                sizeState.height = calculateMinSizeValue(sizeState.height, minSizeState.height, systemWindowMinSize.height);
                sizeState = calculateMaxSize(sizeState, posState, screenPos, maxSizeState, screenSize);

                posState.top = prevTopLength - sizeState.height;

                newCoords = {
                    pos: {top: posState.top},
                    size: sizeState
                };
            }
            else if (sizeboxSide === SizeboxSide.TopLeft) {
                const prevLeftLength = posState.left + sizeState.width;
                const prevTopLength = posState.top + sizeState.height;

                sizeState.width = sizeState.width + (posState.left - calculateMinPosValue(event.pageX, screenPos.left));
                sizeState.height = sizeState.height + (posState.top - calculateMinPosValue(event.pageY, screenPos.top));
                    
                sizeState = calculateMinSize(sizeState, minSizeState, systemWindowMinSize);
                sizeState = calculateMaxSize(sizeState, posState, screenPos, maxSizeState, screenSize);

                posState.left = prevLeftLength - sizeState.width;
                posState.top = prevTopLength - sizeState.height;

                newCoords = {
                    pos: posState,
                    size: sizeState
                };
            }

            if (!newCoords)
                return;
            
            windowManagerDispatch({
                type: WindowManagerActionTypes.SET_WINDOW_COORDS,
                payload: {
                    windowId: id,
                    coords: newCoords
                }
            });
        }

        const mouseupGlobalHandler = () => {
            if (event.button !== 0)
                return;

            document.removeEventListener('mousemove', mousemoveGlobalHandler);
            window.removeEventListener('mouseup', mouseupGlobalHandler);

            setDisposeHandlers(prevState => ({
                ...prevState,
                sizeboxMousemoveHandler: undefined,
                sizeboxMouseupHandler: undefined
            }));

            setCursorType(undefined);
        }

        prevMousePos.x = event.pageX;
        prevMousePos.y = event.pageY;

        let cursorType: CursorType = CursorType.TopLeft;

        if (sizeboxSide === SizeboxSide.Top)
            cursorType = CursorType.Top;
        else if (sizeboxSide === SizeboxSide.TopRight)
            cursorType = CursorType.TopRight;
        else if (sizeboxSide === SizeboxSide.Right)
            cursorType = CursorType.Right;
        else if (sizeboxSide === SizeboxSide.BottomRight)
            cursorType = CursorType.BottomRight;
        else if (sizeboxSide === SizeboxSide.Bottom)
            cursorType = CursorType.Bottom;
        else if (sizeboxSide === SizeboxSide.BottomLeft)
            cursorType = CursorType.BottomLeft;
        else if (sizeboxSide === SizeboxSide.Left)
            cursorType = CursorType.Left;
            
        window.addEventListener('mouseup', mouseupGlobalHandler);
        document.addEventListener('mousemove', mousemoveGlobalHandler);

        setCursorType(cursorType);

        setDisposeHandlers(prevState => ({
            ...prevState,
            sizeboxMousemoveHandler: mousemoveGlobalHandler,
            sizeboxMouseupHandler: mouseupGlobalHandler
        }));
    }

    const panelActiveboxMoveHandler = (event: React.MouseEvent) => {
        if (event.button !== 0 || state.mode.type === WindowModeType.Hidden)
            return;

        const mousePos: MousePos = {x: 0, y: 0};
        const statePos: Position = state.pos;
        const prevWindowModeSize: Size = state.mode.prevMode.state.size;

        const mousemoveGlobalHandler = (event: MouseEvent) => {
            if (state.mode.type !== WindowModeType.Full) {
                statePos.left = event.pageX - (event.pageX - (statePos.left + (event.pageX - mousePos.x)));
                statePos.top = event.pageY - (event.pageY - (statePos.top +  (event.pageY - mousePos.y)));
            }
            else {
                windowManagerDispatch({
                    type: WindowManagerActionTypes.SET_WINDOW_MODE,
                    payload: {
                        windowId: id,
                        windowModeType: WindowModeType.Standard
                    }
                });

                statePos.left = event.pageX - prevWindowModeSize.width / 2;
                statePos.top = event.pageY - (event.pageY - (statePos.top +  (event.pageY - mousePos.y)));
            }

            mousePos.x = event.pageX;
            mousePos.y = event.pageY;

            windowManagerDispatch({
                type: WindowManagerActionTypes.SET_WINDOW_POS,
                payload: {
                    windowId: id,
                    pos: statePos
                }
            });
        }

        const mouseupGlobalHandler = (event: MouseEvent) => {
            if (event.button !== 0)
                return;

            document.removeEventListener('mousemove', mousemoveGlobalHandler);
            window.removeEventListener('mouseup', mouseupGlobalHandler);

            setDisposeHandlers(prevState => ({
                ...prevState,
                panelActiveboxMousemoveHandler: undefined,
                panelActiveboxMouseupHandler: undefined
            }));
        }

        mousePos.x = event.pageX;
        mousePos.y = event.pageY;
            
        window.addEventListener('mouseup', mouseupGlobalHandler);
        document.addEventListener('mousemove', mousemoveGlobalHandler);

        setDisposeHandlers(prevState => ({
            ...prevState,
            panelActiveboxMousemoveHandler: mousemoveGlobalHandler,
            panelActiveboxMouseupHandler: mouseupGlobalHandler
        }));
    }

    const closeButtonClickHandler = (event: React.MouseEvent) => {
        if (event.button !== 0)
            return;

        windowManagerDispatch({
            type: WindowManagerActionTypes.CLOSE_WINDOW,
            payload: id
        });
    }

    const fullButtonClickHandler = (event: React.MouseEvent) => {
        if (event.button !== 0)
            return;

        let newWindowModeType: WindowModeType = WindowModeType.Full;

        if (state.mode.type === WindowModeType.Full)
            newWindowModeType = WindowModeType.Standard;

        windowManagerDispatch({
            type: WindowManagerActionTypes.SET_WINDOW_MODE,
            payload: {
                windowId: id,
                windowModeType: newWindowModeType
            }
        });
    }

    const hideButtonClickHandler = (event: React.MouseEvent) => {
        if (event.button !== 0)
            return;

        let newWindowModeType: WindowModeType = WindowModeType.Hidden;

        if (state.mode.type === WindowModeType.Hidden)
            newWindowModeType = state.mode.prevMode.type;

        windowManagerDispatch({
            type: WindowManagerActionTypes.SET_WINDOW_MODE,
            payload: {
                windowId: id,
                windowModeType: newWindowModeType
            }
        });
    }

    const resetButtonClickHandler = (event: React.MouseEvent) => {
        windowManagerDispatch({
            type: WindowManagerActionTypes.RESET_WINDOW,
            payload: id
        });
    }

    const sizebox: React.ReactNode = useMemo(() => (
        state.mode.type === WindowModeType.Standard
            ? <Sizebox sizeboxSizeHandler={sizeboxSizeHandler} />
            : null
    ), [state.mode.type]);

    const panel: ReactElement = useMemo(() => (
        <Panel
            windowId={id}
            name={state.name}
            isActive={state.isActive}
            activeboxMouseDownHandler={panelActiveboxMoveHandler}
            closeButtonClickHandler={closeButtonClickHandler}
            fullButtonClickHandler={fullButtonClickHandler}
            hideButtonClickHandler={hideButtonClickHandler}
            resetButtonClickHandler={resetButtonClickHandler}
            height={windowBorderLengthsSettings.value.top}
            backgroundColor={frameColor}
        />
    ), [state.isActive,
        state.name,
        frameColor,
        windowBorderLengthsSettings.value.top
    ]);

    const contentActivebox: ReactElement = <div style={contentActiveboxStyle} />;

    const sizeboxActivebox: ReactElement = useMemo(() => {
        if (cursorType != undefined)
            activeboxStyle.cursor = cursorType;

        return <div style={activeboxStyle} />;
    }, [cursorType]);

    const testBlockSetThemeColorHandler = (color: TestBlockColor) => {
        systemSettingsDispatch({
            type: SystemSettingsActionTypes.SET_THEME_COLOR,
            payload: color === TestBlockColor.Standard
                ? defaultThemeColor
                : color
        });
    }

    const testBlockSetWindowFrameColorHandler = (color: TestBlockColor) => {
        windowManagerDispatch({
            type: WindowManagerActionTypes.SET_WINDOW_FRAME_COLOR,
            payload: {
                windowId: id,
                frameColor: color === TestBlockColor.Standard
                    ? undefined
                    : color
            }
        });
    }

    const testBlockSetWindowBackgroundTransparentHandler = (value: boolean) => {
        windowManagerDispatch({
            type: WindowManagerActionTypes.SET_WINDOW_BACKGROUND_TRANSPARENT,
            payload: {
                windowId: id,
                isBackgroundTransparent: value
            }
        });
    }

    const testBlockCreateWindowHandler = () => {
        for (let key in testBlockCreateWindowInputList) {
            if (testBlockCreateWindowInputList[key].current == null)
                return;
        }

        const {
            nameInputRef,
            leftInputRef,
            topInputRef,
            widthInputRef,
            heightInputRef
        } = testBlockCreateWindowInputList;

        const setErrorStatus = () => setTestBlockCreateWindowStatus(TestBlockStatus.InvalidData);

        const newLeftPos: number = convertStringToInt(leftInputRef.current!.value);

        if (isNaN(newLeftPos)) {
            setErrorStatus();
            return;
        }

        const newTopPos: number = convertStringToInt(topInputRef.current!.value);

        if (isNaN(newTopPos)) {
            setErrorStatus();
            return;
        }

        const newWidth: number = convertStringToInt(widthInputRef.current!.value);

        if (isNaN(newWidth)) {
            setErrorStatus();
            return;
        }
    
        const newHeight: number = convertStringToInt(heightInputRef.current!.value);
    
        if (isNaN(newHeight)) {
            setErrorStatus();
            return;
        }

        windowManagerDispatch({
            type: WindowManagerActionTypes.CREATE_WINDOW,
            payload: {
                windowId: id,
                appId: state.appId,
                name: nameInputRef.current!.value,
                pos: {
                    left: newLeftPos,
                    top: newTopPos
                },
                size: {
                    width: newWidth,
                    height: newHeight
                },
            }
        });
    }

    const testBlockSetWindowNameHandler = () => {
        if (!testBlockSetWindowNameInputRef.current)
            return;

        windowManagerDispatch({
            type: WindowManagerActionTypes.SET_WINDOW_NAME,
            payload: {
                windowId: id,
                name: testBlockSetWindowNameInputRef.current.value
            }
        });
    }

    const testBlockSetWindowPosHandler = () => {
        if (!testBlockSetWindowPositionLeftInputRef.current ||
            !testBlockSetWindowPositionTopInputRef.current)
            return;

        const newLeftPos: number = convertStringToInt(testBlockSetWindowPositionLeftInputRef.current.value);
        const newTopPos: number = convertStringToInt(testBlockSetWindowPositionTopInputRef.current.value);

        const isNaNleftPos: boolean = isNaN(newLeftPos);
        const isNaNtopPos: boolean = isNaN(newTopPos);

        const setWindowPos = (pos: PositionType) => {
            windowManagerDispatch({
                type: WindowManagerActionTypes.SET_WINDOW_POS,
                payload: {
                    windowId: id,
                    pos
                }
            });
        }

        if (isNaNleftPos && isNaNtopPos) {
            setTestBlockWindowPosStatus(TestBlockStatus.InvalidData);
            return;
        }

        if (!isNaNleftPos && !isNaNtopPos)
            setWindowPos({left: newLeftPos, top: newTopPos});
        else if (!isNaNleftPos)
            setWindowPos({left: newLeftPos});
        else if (!isNaNtopPos)
            setWindowPos({top: newTopPos});
    }

    const testBlockSetWindowSizeHandler = () => {
        if (!testBlockSetWindowSizeLeftInputRef.current ||
            !testBlockSetWindowSizeTopInputRef.current)
            return;

        const newWidth: number = convertStringToInt(testBlockSetWindowSizeLeftInputRef.current.value);
        const newHeight: number = convertStringToInt(testBlockSetWindowSizeTopInputRef.current.value);

        const isNaNwidth: boolean = isNaN(newWidth);
        const isNaNheight: boolean = isNaN(newHeight);

        const setWindowSize = (size: SizeType) => {
            windowManagerDispatch({
                type: WindowManagerActionTypes.SET_WINDOW_SIZE,
                payload: {
                    windowId: id,
                    size
                }
            });
        }

        if (isNaNwidth && isNaNheight) {
            setTestBlockWindowSizeStatus(TestBlockStatus.InvalidData);
            return;
        }

        if (!isNaNwidth && !isNaNheight)
            setWindowSize({width: newWidth, height: newHeight});
        else if (!isNaNwidth)
            setWindowSize({width: newWidth});
        else if (!isNaNheight)
            setWindowSize({height: newHeight});
    }

    const testBlockSetWindowNameInputRef = useRef<HTMLInputElement>(null);

    const testBlockCreateWindowInputList: TestBlockCreateWindowNameInput = {
        nameInputRef: useRef<HTMLInputElement>(null),
        leftInputRef: useRef<HTMLInputElement>(null),
        topInputRef: useRef<HTMLInputElement>(null),
        widthInputRef: useRef<HTMLInputElement>(null),
        heightInputRef: useRef<HTMLInputElement>(null)
    };

    const testBlockSetWindowPositionLeftInputRef = useRef<HTMLInputElement>(null);
    const testBlockSetWindowPositionTopInputRef = useRef<HTMLInputElement>(null);

    const testBlockSetWindowSizeLeftInputRef = useRef<HTMLInputElement>(null);
    const testBlockSetWindowSizeTopInputRef = useRef<HTMLInputElement>(null);

    const [testBlockCreateWindowStatus, setTestBlockCreateWindowStatus] = useState<TestBlockStatus>(TestBlockStatus.Ok);
    const [testBlockWindowPosStatus, setTestBlockWindowPosStatus] = useState<TestBlockStatus>(TestBlockStatus.Ok);
    const [testBlockWindowSizeStatus, setTestBlockWindowSizeStatus] = useState<TestBlockStatus>(TestBlockStatus.Ok);

    const testBlockCreateWindowStatusClass: string = testBlockCreateWindowStatus === TestBlockStatus.Ok
        ? testBlockCss.test_block_status_ok
        : testBlockCss.test_block_status_error;

    const testBlockWindowPosStatusClass: string = testBlockWindowPosStatus === TestBlockStatus.Ok
        ? testBlockCss.test_block_status_ok
        : testBlockCss.test_block_status_error;

    const testBlockWindowSizeStatusClass: string = testBlockWindowSizeStatus === TestBlockStatus.Ok
        ? testBlockCss.test_block_status_ok
        : testBlockCss.test_block_status_error;

    const testInfoBlock: ReactElement = (
        <>
            <p>APP_ID: {state.appId}</p>
            <p>WINDOW_ID: {props.id}</p>
            <hr />
            <p>Window Name: {state.name}</p>
            <p>Window Mode: {WindowModeType[state.mode.type]}</p>
            <p>Left: {state.pos.left} Top: {state.pos.top}</p>
            <p>Width: {state.size.width} Height: {state.size.height}</p>
            <p>Content Width: {state.contentSize.width} Content Height: {state.contentSize.height}</p>
        </>
    );

    const testBlock: ReactElement = (
        <div className={testBlockCss.test_block}>
            <fieldset>
                <legend>INFO</legend>
                {testInfoBlock}
            </fieldset>
            <fieldset>
                <legend>SystemSettings: SET_THEME_COLOR</legend>
                <button onClick={testBlockSetThemeColorHandler.bind(null, TestBlockColor.Red)}>Red</button>
                <button onClick={testBlockSetThemeColorHandler.bind(null, TestBlockColor.Green)}>Green</button>
                <button onClick={testBlockSetThemeColorHandler.bind(null, TestBlockColor.Blue)}>Blue</button>
                <button onClick={testBlockSetThemeColorHandler.bind(null, TestBlockColor.Standard)}>Standard</button>
            </fieldset>
            <fieldset>
                <legend>WindowManager: SET_WINDOW_FRAME_COLOR</legend>
                <button onClick={testBlockSetWindowFrameColorHandler.bind(null, TestBlockColor.Red)}>Red</button>
                <button onClick={testBlockSetWindowFrameColorHandler.bind(null, TestBlockColor.Green)}>Green</button>
                <button onClick={testBlockSetWindowFrameColorHandler.bind(null, TestBlockColor.Blue)}>Blue</button>
                <button onClick={testBlockSetWindowFrameColorHandler.bind(null, TestBlockColor.Standard)}>Standard</button>
            </fieldset>
            <fieldset>
                <legend>WindowManager: SET_WINDOW_BACKGROUND_TRANSPARENT</legend>
                <button onClick={testBlockSetWindowBackgroundTransparentHandler.bind(null, true)}>true</button>
                <button onClick={testBlockSetWindowBackgroundTransparentHandler.bind(null, false)}>false</button>
            </fieldset>
            <fieldset>
                <legend>WindowManager: CREATE_WINDOW</legend>
                <label>
                    <span>Name:</span>
                    <input type="text" defaultValue="New Name" id={testBlockCss.test_block_name_input}
                        ref={testBlockCreateWindowInputList.nameInputRef} />
                </label>
                <fieldset>
                    <legend>Positon</legend>
                    <label>
                        <span>left</span>
                        <input type="number" min="0" defaultValue="0"
                            ref={testBlockCreateWindowInputList.leftInputRef} />
                    </label>
                    <label>
                        <span>top</span>
                        <input type="number" min="0" defaultValue="0"
                            ref={testBlockCreateWindowInputList.topInputRef} />
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Size</legend>
                    <label>
                        <span>width</span>
                        <input type="number" min="0" defaultValue="600"
                            ref={testBlockCreateWindowInputList.widthInputRef} />
                    </label>
                    <label>
                        <span>height</span>
                        <input type="number" min="0" defaultValue="400"
                            ref={testBlockCreateWindowInputList.heightInputRef} />
                    </label>
                </fieldset>
                <button onClick={testBlockCreateWindowHandler}>Сreate window</button>
                <p className={testBlockCreateWindowStatusClass}>Status: {testBlockCreateWindowStatus}</p>
            </fieldset>
            <fieldset>
                <legend>WindowManager: SET_WINDOW_NAME</legend>
                <label>
                    <span>Name:</span>
                    <input type="text" defaultValue="New Name" id={testBlockCss.test_block_name_input}
                        ref={testBlockSetWindowNameInputRef} />
                </label>
                <br />
                <button onClick={testBlockSetWindowNameHandler}>Set window name</button>
            </fieldset>
            <fieldset>
                <legend>WindowManager: SET_WINDOW_POS</legend>
                <p>Position:</p>
                <label>
                    <span>left</span>
                    <input type="number" min="0" defaultValue="0"
                        ref={testBlockSetWindowPositionLeftInputRef} />
                </label>
                <label>
                    <span>top</span>
                    <input type="number" min="0" defaultValue="0"
                        ref={testBlockSetWindowPositionTopInputRef} />
                </label>
                <br />
                <button onClick={testBlockSetWindowPosHandler}>Set window pos</button>
                <p className={testBlockWindowPosStatusClass}>Status: {testBlockWindowPosStatus}</p>
            </fieldset>
            <fieldset>
                <legend>WindowManager: SET_WINDOW_SIZE</legend>
                <p>Size:</p>
                <label>
                    <span>width</span>
                    <input type="number" min="0" defaultValue="0"
                        ref={testBlockSetWindowSizeLeftInputRef} />
                </label>
                <label>
                    <span>height</span>
                    <input type="number" min="0" defaultValue="0"
                        ref={testBlockSetWindowSizeTopInputRef} />
                </label>
                <br />
                <button onClick={testBlockSetWindowSizeHandler}>Set window size</button>
                <p className={testBlockWindowSizeStatusClass}>Status: {testBlockWindowSizeStatus}</p>
            </fieldset>
        </div>
    );
    
    return (
        <div className={css.window} style={style} onMouseDown={mousedownHandler}>
            {disposeHandlers.sizeboxMouseupHandler ? sizeboxActivebox : null }
            <div style={wrapperStyle}>
                {sizebox}
                {panel}
                <div className={css.window_content} style={contentStyles}>
                    {disposeHandlers.panelActiveboxMouseupHandler ? contentActivebox : null}
                    {!props.isTest ? null : testBlock}
                    {props.children}
                </div>
            </div>
        </div>
    );
}