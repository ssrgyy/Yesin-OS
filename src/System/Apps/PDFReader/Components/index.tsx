import css from "./CSS/pdf_reader.module.css";
import React from "react";

export const PDFReader: React.FC = () => {
    return (
        <div className={css.main}>
            <iframe className={css.view}
                src="./System/Resources/Files/Resume.pdf"
                frameBorder="0"
            />
        </div>
    );
}