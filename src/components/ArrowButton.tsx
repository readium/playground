import React, { useEffect, useRef } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import LeftArrow from "./assets/icons/baseline-arrow_left_ios-24px.svg";
import RightArrow from "./assets/icons/baseline-arrow_forward_ios-24px.svg";

import { control } from "../helpers/control";
import { propsToCSSVars } from "@/helpers/propsToCSSVars";

export interface ReaderArrowProps {
  direction: "left" | "right";
  isRTL: boolean;
  className: string;
  disabled: boolean;
}

export const ArrowButton = (props: ReaderArrowProps) => {
  const button = useRef<HTMLButtonElement>(null);

  const label = (props.direction === "right" || props.isRTL) ? Locale.reader.navigation.goForward : Locale.reader.navigation.goBackward;

  useEffect(() => {
    if (props.disabled && document.activeElement === button.current) {
      button.current!.blur()
    }
  })
  
  return (
    <>
     <button 
        ref={button}
        title={label} 
        aria-label={label} 
        onClick={() => { props.direction === "left" ? control("goLeft") : control("goRight")} } 
        className={props.className} 
        style={propsToCSSVars(RSPrefs.theming.arrow, "arrow")} 
        disabled={props.disabled}
        tabIndex={props.disabled ? -1 : 0}>
        {props.direction === "left" ? <LeftArrow aria-hidden="true" focusable="false"/> : <RightArrow aria-hidden="true" focusable="false"/>}
      </button>
    </>);
}