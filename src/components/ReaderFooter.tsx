import React from "react";

import Locale from "../resources/locales/en.json";
import readerStateStyles from "./assets/styles/readerStates.module.css";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { ProgressionOf } from "./ProgressionOf";

export const ReaderFooter = () => {
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const dispatch = useAppDispatch();

  const setHover = () => {
    dispatch(setHovering(true));
  };

  const removeHover = () => {
    dispatch(setHovering(false));
  };

  const handleClassNameFromState = () => {
    let className = "";
    if (isImmersive && isHovering) {
      className = readerStateStyles.immersiveHovering;
    } else if (isImmersive) {
      className = readerStateStyles.immersive;
    }
    return className
  };

  return(
    <>
    <aside 
      className={ handleClassNameFromState() } 
      id="bottom-bar" 
      aria-label={ Locale.reader.app.footer.label } 
      onMouseEnter={ setHover } 
      onMouseLeave={ removeHover }
    >
      <ProgressionOf />
    </aside>
    </>
  )
}