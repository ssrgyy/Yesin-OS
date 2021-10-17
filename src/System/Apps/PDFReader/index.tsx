import { App } from "../../Components/App/types";
import { Icon } from "../../Components/Icon";
import { Window } from "../../Components/Window";
import { PDFReader as PDFReaderComponent } from "./Components";

export const PDFReader: App = {
    name: 'Резюме',
    icon: <Icon url="Files/pdf_file.svg" />,
    windowComponentList: [
        <Window
            key="WindowPDFReader"
            name="Резюме"
            left={200}
            top={100}
            contentWidth={600}
            contentHeight={600}
            isBackgroundTransparent={true}
        >
            <PDFReaderComponent />
        </Window>
    ]
};