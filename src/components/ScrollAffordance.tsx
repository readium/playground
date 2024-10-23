import React from "react";

import Locale from "../resources/locales/en.json";
import scrollAffordanceStyles from "./assets/styles/scrollAffordance.module.css"

import { control } from "../helpers/control";
import { Button } from "react-aria-components";

import { useAppSelector } from "@/lib/hooks";
import { ScrollAffordancePref } from "@/preferences";

export interface IScrollAffordance {
  pref: ScrollAffordancePref;
  width?: number;
}

export const ScrollAffordance = (props: IScrollAffordance) => {
  const isRTL = useAppSelector(state => state.publication.isRTL);

  return (
    <>
    { props.pref !== ScrollAffordancePref.none ?
      <div 
        className={ scrollAffordanceStyles.scrollAffWrapper } 
        { ...(isRTL ? { dir: "rtl" } : {}) }
        style={ props.width ? { width: `${props.width}px` } : { width: "100%" } }
      >

      { props.pref === ScrollAffordancePref.both || props.pref === ScrollAffordancePref.prev ? 
        <Button 
          id={ scrollAffordanceStyles.prevButton }
          onPress={ () => { control("goLeft") } }>
          { Locale.reader.navigation.scrollPrevious }
        </Button> : 
        <></> 
      }

      { props.pref === ScrollAffordancePref.both || props.pref === ScrollAffordancePref.next ? 
        <Button
          id={ scrollAffordanceStyles.nextButton } 
          onPress={ () => { control("goRight") } }>
          { Locale.reader.navigation.scrollNext }
        </Button> : 
        <></> 
      }

      </div> : 
      <></>
    }
    </>
  );
}