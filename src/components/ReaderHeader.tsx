import React from "react";

import Locale from "../resources/locales/en.json";

export const ReaderHeader = ({className, title}: {className: string | undefined, title: string | undefined}) => {
  return (
    <>
      <header className={className ? className : ""} id="top-bar" aria-label="Top Bar">
        <h1 aria-label={Locale.reader.app.header.title}>
          {title
            ? title
            : Locale.reader.app.header.fallback}
        </h1>
      </header>
    </>
  );
}