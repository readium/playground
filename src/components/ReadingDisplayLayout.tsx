import React from "react";

import Locale from "../resources/locales/en.json";

import ScrollableIcon from "./assets/icons/scroll-icon.svg";
import PaginatedIcon from "./assets/icons/page-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import { RadioGroup, Radio, Label } from "react-aria-components";
import { setPaged } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export enum ReadingDisplayLayoutOption { 
  scroll = "scroll_option",
  paginated = "page_option"
}

export const ReadingDisplayLayout = ({ isFXL }: { isFXL: boolean }) => {
  const isPaged = useAppSelector(state => state.reader.isPaged);
  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    if (value === ReadingDisplayLayoutOption.paginated) {
      dispatch(setPaged(true));
    } else {
      dispatch(setPaged(false));
    }
  }
  
  return (
    <>
    <div>
      <RadioGroup 
        orientation="horizontal" 
        value={ isPaged ? ReadingDisplayLayoutOption.paginated : ReadingDisplayLayoutOption.scroll } 
        onChange={ handleChange }
      >
        <Label className={ settingsStyles.readerSettingsLabel }>{ Locale.reader.settings.layout.title }</Label>
        <div className={ settingsStyles.readerSettingsRadioWrapper }>
          <Radio 
            className={ settingsStyles.readerSettingsRadio } 
            value={ ReadingDisplayLayoutOption.scroll } 
            id={ ReadingDisplayLayoutOption.scroll } 
            isDisabled={ isFXL }
          >
            <ScrollableIcon aria-hidden="true" focusable="false" />
            <span>{ Locale.reader.settings.layout.scrolled }</span>
          </Radio>
          <Radio 
            className={ settingsStyles.readerSettingsRadio } 
            value={ ReadingDisplayLayoutOption.paginated } 
            id={ ReadingDisplayLayoutOption.paginated } 
            isDisabled={ false }
          >
            <PaginatedIcon aria-hidden="true" focusable="false" />
            <span>{ Locale.reader.settings.layout.paginated }</span>
          </Radio>
        </div>
      </RadioGroup>
    </div>
    </>
  )
}