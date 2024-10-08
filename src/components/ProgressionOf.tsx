import React, { useEffect, useState } from "react";

import Locale from "../resources/locales/en.json";
import progressionStyles from "./assets/styles/progression.module.css";

import parseTemplate from "json-templates";

export interface IProgression {
  totalPositions?: number;
  currentPositions?: number[];
  relativeProgression?: number;
  currentChapter?: string;
  totalProgression?: number;
  currentPublication?: string;
}

export const ProgressionOf = ({progression}: {progression: IProgression}) => {
  const jsonTemplate = parseTemplate(Locale.reader.app.progression.of);
  const [current, setCurrent] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (progression.totalPositions && progression.currentPositions) {
      setCurrent(progression.currentPositions.length === 2 ? `${progression.currentPositions[0]}–${progression.currentPositions[1]}` : `${progression.currentPositions}`);
      setReference(`${progression.totalPositions}`);
    } else if (progression.totalProgression !== undefined && progression.currentPublication) {
      setCurrent(`${Math.round(progression.totalProgression * 100)}%`);
      setReference(progression.currentPublication);
    } else if (progression.relativeProgression !== undefined && progression.currentChapter) {
      setCurrent(`${Math.round(progression.relativeProgression * 100)}%`);
      setReference(progression.currentChapter);
    } else {
      setCurrent("");
      setReference("");
    }
  }, [progression])

  return (
    <>
    {(current && reference) && <div id={progressionStyles.current} aria-label={Locale.reader.app.progression.wrapper}>
      {jsonTemplate({ current: current, reference: reference })}
    </div>}
    </>
  )
}