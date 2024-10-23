"use client";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import "./assets/styles/reader.css";
import arrowStyles from "./assets/styles/arrowButton.module.css";
import fontStacks from "readium-css/css/vars/fontStacks.json";

import {
  BasicTextSelection,
  FrameClickEvent,
} from "@readium/navigator-html-injectables";
import { EpubNavigator, EpubNavigatorListeners, FrameManager, FXLFrameManager } from "@readium/navigator";
import { Locator, Manifest, Publication, Fetcher, HttpFetcher, EPUBLayout, ReadingProgression } from "@readium/shared";

import Peripherals from "@/helpers/peripherals";
import { useCallback, useEffect, useRef } from "react";

import { ReaderHeader } from "./ReaderHeader";
import { ArrowButton } from "./ArrowButton";
import { ReaderFooter } from "./ReaderFooter";

import { autoPaginate } from "@/helpers/autoLayout/autoPaginate";
import { getOptimalLineLength, IOptimalLineLength } from "@/helpers/autoLayout/optimalLineLength";
import { propsToCSSVars } from "@/helpers/propsToCSSVars";
import { localData } from "@/helpers/localData";
import { setImmersive, setBreakpoint, setHovering } from "@/lib/readerReducer";
import { setFXL, setRTL, setProgression, setRunningHead } from "@/lib/publicationReducer";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import debounce from "debounce";
import { ScrollAffordance } from "./ScrollAffordance";

export const Reader = ({ rawManifest, selfHref }: { rawManifest: object, selfHref: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const nav = useRef<EpubNavigator | null>(null);
  const publication = useRef<Publication | null>(null);
  const optimalLineLength = useRef<IOptimalLineLength | null>(null);

  const arrowsWidth = useRef(2 * ((RSPrefs.theming.arrow.size || 40) + (RSPrefs.theming.arrow.offset || 0)));

  const localDataKey = useRef(`${selfHref}-current-location`);

  const hasReachedBreakpoint = useAppSelector(state => state.reader.hasReachedBreakpoint) || RSPrefs.breakpoint <= window.innerWidth;
  const isPaged = useAppSelector(state => state.reader.isPaged);
  const colCount = useAppSelector(state => state.reader.colCount);
  
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const immersive = useRef(isImmersive);

  const runningHead = useAppSelector(state => state.publication.runningHead);
  const atPublicationStart = useAppSelector(state => state.publication.atPublicationStart);
  const atPublicationEnd = useAppSelector(state => state.publication.atPublicationEnd);

  const dispatch = useAppDispatch();

  // TMP: Nasty trick to get around usage in useEffect with explicit deps
  // i.e. isImmersive will stay the same as long as the entire navigator
  // is not re-rendered so we have to rely on an alias…
  // a toggle reducer wouldn’t help either, as activateImmersiveOnAction
  // always sees isImmersive as false and fires on every keyboard action
  useEffect(() => {
    immersive.current = isImmersive;
  }, [isImmersive]);

  const activateImmersiveOnAction = () => {
    if (!immersive.current) dispatch(setImmersive(true));
  }

  const toggleImmersive = () => {
    // If tap/click in iframe, then header/footer no longer hoovering 
    dispatch(setHovering(false));
    dispatch(setImmersive(!immersive.current));
  }

  const applyReadiumCSSStyles = (stylesObj: { [key: string]: string }) => {
    nav.current?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
      if (frameManager) {
        for (const [key, value] of Object.entries(stylesObj)) {
          frameManager.window.document.documentElement.style.setProperty(key, value);
        }
      }
    })
  };

  useEffect(() => {
    if (isPaged) { 
      applyReadiumCSSStyles({
        "--USER__view": "readium-paged-on"
      });
    } else {
      applyReadiumCSSStyles({
        "--USER__view": "readium-scroll-on"
      })
    }
  }, [isPaged]);

  const handleColCountReflow = useCallback(() => {
    if (container.current && optimalLineLength.current) {
      let RCSSColCount = 1;

      if (colCount === "auto") {
        RCSSColCount = autoPaginate(RSPrefs.breakpoint, window.innerWidth, optimalLineLength.current.optimal);
      } else if (colCount === "2") {
        const requiredWidth = ((2 * optimalLineLength.current.min) * optimalLineLength.current.fontSize);
        window.innerWidth > requiredWidth ? RCSSColCount = 2 : RCSSColCount = 1;
      } else {
        RCSSColCount = Number(colCount);
      }

      if (hasReachedBreakpoint) {
        const containerWithArrows = window.innerWidth - arrowsWidth.current;
        const containerWidth = RCSSColCount > 1 ? Math.min(((RCSSColCount * optimalLineLength.current.optimal) * optimalLineLength.current.fontSize), containerWithArrows) : containerWithArrows;
        container.current.style.width = `${containerWidth}px`;
      } else {
        container.current.style.width = `${window.innerWidth}px`;
      }

      applyReadiumCSSStyles({
        "--USER__colCount": `${RCSSColCount}`,
        "--RS__defaultLineLength": `${optimalLineLength.current.optimal}rem`
      })
    }
  }, [colCount, hasReachedBreakpoint]);

  useEffect(() => {
    if (nav.current?.layout === EPUBLayout.reflowable) {
      handleColCountReflow();
    } else if (nav.current?.layout === EPUBLayout.fixed) {
      if (colCount === "1") {
        // @ts-ignore
        nav.current.pool.setPerPage(1);
      } else {
        // @ts-ignore
        nav.current.pool.setPerPage(0)
      }
    }
  }, [colCount, handleColCountReflow]);

  const handleResize = useCallback(debounce(() => {
    if (nav.current?.layout === EPUBLayout.reflowable) {
      handleColCountReflow();
    }
  }, 250), [handleColCountReflow]);

  const handleReaderControl = useCallback((ev: Event) => {
    const detail = (ev as CustomEvent).detail as {
      command: string;
      data: unknown;
    };
    
    switch (detail.command) {
      case "goRight":
        nav.current?.goRight(true, () => {});
        break;
      case "goLeft":
        nav.current?.goLeft(true, () => {});
        break;
      case "goTo":
        const link = nav.current?.publication.linkWithHref(detail.data as string);
        if (!link) {
          console.error("Link not found", detail.data);
          return;
        }
        nav.current?.goLink(link, true, () => {});
        break;
      default:
        console.error("Unknown reader-control event", ev);
    }
  }, []);

  const mq = "(min-width:"+ RSPrefs.breakpoint + "px)";
  const breakpointQuery = window.matchMedia(mq);
  const handleBreakpointChange = useCallback((event: MediaQueryListEvent) => {
    dispatch(setBreakpoint(event.matches))}, [dispatch]);

  useEffect(() => {
    window.addEventListener("reader-control", handleReaderControl);
    breakpointQuery.addEventListener("change", handleBreakpointChange);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    
    return () => {
      window.removeEventListener("reader-control", handleReaderControl);
      breakpointQuery.removeEventListener("change", handleBreakpointChange);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    }
  }, [breakpointQuery, handleBreakpointChange, handleResize, handleReaderControl]);

  useEffect(() => {
    const fetcher: Fetcher = new HttpFetcher(undefined, selfHref);
    const manifest = Manifest.deserialize(rawManifest)!;
    manifest.setSelfLink(selfHref);

    publication.current = new Publication({
      manifest: manifest,
      fetcher: fetcher,
    });

    let positionsList: Locator[] | undefined;

    dispatch(setRunningHead(publication.current.metadata.title.getTranslation("en")));    
    dispatch(setRTL(publication.current.metadata.effectiveReadingProgression === ReadingProgression.rtl));
    dispatch(setFXL(publication.current.metadata.getPresentation()?.layout === EPUBLayout.fixed));

    dispatch(setProgression({ currentPublication: runningHead }));

    const fetchPositions = async () => {
      const positionsJSON = publication.current?.manifest.links.findWithMediaType("application/vnd.readium.position-list+json");
      if (positionsJSON) {
        const fetcher = new HttpFetcher(undefined, selfHref);
        const fetched = fetcher.get(positionsJSON);
        try {
          const positionObj = await fetched.readAsJSON() as {total: number, positions: Locator[]};
          positionsList = positionObj.positions;
          dispatch(setProgression( { totalPositions: positionObj.total }));
        } catch(err) {
          console.error(err)
        }
      }
    };

    fetchPositions()
      .catch(console.error);
    
    const initReadingEnv = () => {
      if (nav.current?.layout === EPUBLayout.reflowable) {
        optimalLineLength.current = getOptimalLineLength({
          minChars: RSPrefs.typography.minimalLineLength,
          optimalChars: RSPrefs.typography.optimalLineLength,
          fontFace: fontStacks.RS__oldStyleTf,
          pageGutter: RSPrefs.typography.pageGutter,
        //  letterSpacing: 2,
        //  wordSpacing: 2,
        //  sample: "It will be seen that this mere painstaking burrower and grub-worm of a poor devil of a Sub-Sub appears to have gone through the long Vaticans and street-stalls of the earth, picking up whatever random allusions to whales he could anyways find in any book whatsoever, sacred or profane. Therefore you must not, in every case at least, take the higgledy-piggledy whale statements, however authentic, in these extracts, for veritable gospel cetology. Far from it. As touching the ancient authors generally, as well as the poets here appearing, these extracts are solely valuable or entertaining, as affording a glancing bird’s eye view of what has been promiscuously said, thought, fancied, and sung of Leviathan, by many nations and generations, including our own."
        });
        applyReadiumCSSStyles({
          "--RS__pageGutter": `${RSPrefs.typography.pageGutter}px`
        });
        handleResize();
      } else if (nav.current?.layout === EPUBLayout.fixed) {
        // [TMP] Working around positionChanged not firing consistently for FXL
        // Init’ing so that progression can be populated on first spread loaded
        handleProgression(nav.current.currentLocator);
        handleResize();
      }
    }
    
    const handleProgression = (locator: Locator) => {
      const relativeRef = locator.title || Locale.reader.app.progression.referenceFallback;
        
      dispatch(setProgression( { currentPositions: nav.current?.currentPositionNumbers, relativeProgression: locator.locations.progression, currentChapter: relativeRef, totalProgression: locator.locations.totalProgression }));
    }
    
    const handleTap = (event: FrameClickEvent) => {
      const oneQuarter = ((nav.current?._cframes.length === 2 ? nav.current._cframes[0]!.window.innerWidth + nav.current._cframes[1]!.window.innerWidth : nav.current!._cframes[0]!.window.innerWidth) * window.devicePixelRatio) / 4;
      
      if (event.x < oneQuarter) {
        nav.current?.goLeft(true, activateImmersiveOnAction);
      } 
      else if (event.x > oneQuarter * 3) {
        nav.current?.goRight(true, activateImmersiveOnAction);
      } else if (oneQuarter <= event.x && event.x <= oneQuarter * 3) {
        toggleImmersive();
      }
    }

    const p = new Peripherals({
      moveTo: (direction) => {
        if (direction === "right") {
          nav.current?.goRight(true, activateImmersiveOnAction);
        } else if (direction === "left") {
          nav.current?.goLeft(true, activateImmersiveOnAction);
        }
      },
      goProgression: (shiftKey) => {
        shiftKey 
          ? nav.current?.goBackward(true, activateImmersiveOnAction) 
          : nav.current?.goForward(true, activateImmersiveOnAction);
      }
    });

    // [TMP] Working around positionChanged not firing consistently for FXL
    // We’re observing the FXLFramePoolManager spine div element’s style
    // and checking whether its translate3d has changed.
    // Sure IntersectionObserver should be the obvious one to use here,
    // observing iframes instead of the style attribute on the spine element
    // but there’s additional complexity to handle as a spread = 2 iframes
    // And keeping in sync while the FramePool is re-aligning on resize can be suboptimal
    const FXLPositionChanged = new MutationObserver((mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        const re = /translate3d\(([^)]+)\)/;
        const newVal = (mutation.target as HTMLElement).getAttribute(mutation.attributeName as string);
        const oldVal = mutation.oldValue;
        if (newVal?.split(re)[1] !== oldVal?.split(re)[1]) {
          const locator = nav.current?.currentLocator;
          if (locator) {
            handleProgression(locator);
            localData.set(localDataKey.current, locator)
          }
        }
      }
    });

    const listeners: EpubNavigatorListeners = {
      frameLoaded: function (_wnd: Window): void {
        initReadingEnv();
        nav.current?._cframes.forEach(
          (frameManager: FrameManager | FXLFrameManager | undefined) => {
            if (frameManager) p.observe(frameManager.window);
          }
        );
        p.observe(window);
      },
      positionChanged: debounce(function (locator: Locator): void {
        window.focus();

        // This can’t be relied upon with FXL to handleProgression at the moment,
        // Only reflowable snappers will register the "progress" event
        // that triggers positionChanged every time the progression changes
        // in FXL, only first_visible_locator will, which is why it triggers when
        // the spread has not been shown yet, but won’t if you just slid to them.
        if (nav.current?.layout === EPUBLayout.reflowable) {
          handleProgression(locator);
          localData.set(localDataKey.current, locator);
        }
      }, 250),
      tap: function (_e: FrameClickEvent): boolean {
        handleTap(_e);
        return true;
      },
      click: function (_e: FrameClickEvent): boolean {
        toggleImmersive()
        return true;
      },
      zoom: function (_scale: number): void {},
      miscPointer: function (_amount: number): void {},
      customEvent: function (_key: string, _data: unknown): void {},
      handleLocator: function (locator: Locator): boolean {
        const href = locator.href;
        if (
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
        ) {
          if (confirm(`Open "${href}" ?`)) window.open(href, "_blank");
        } else {
          console.warn("Unhandled locator", locator);
        }
        return false;
      },
      textSelected: function (_selection: BasicTextSelection): void {},
    };
    
    const currentLocation = localData.get(localDataKey.current);

    nav.current = new EpubNavigator(container.current!, publication.current, listeners, positionsList, currentLocation);

    nav.current.load().then(() => {
      p.observe(window);

      if (nav.current?.layout === EPUBLayout.fixed) {
        // @ts-ignore
        FXLPositionChanged.observe((nav.current?.pool.spineElement as HTMLElement), {attributes: ["style"], attributeOldValue: true});
      }
    });

    return () => {
      // Cleanup TODO!
      p.destroy();
      if (nav.current?.layout === EPUBLayout.fixed) {
        FXLPositionChanged.disconnect();
      }
      nav.current?.destroy();
    };
  }, [rawManifest, selfHref]);

  return (
    <>
    <main style={ propsToCSSVars(RSPrefs.theming) }>
      <ReaderHeader 
        runningHead={ runningHead } 
      />

    { isPaged ? 
      <nav className={ arrowStyles.container } id={ arrowStyles.left }>
        <ArrowButton 
          direction="left" 
          disabled={ atPublicationStart }
        />
      </nav> : 
      <></>
    }

      <article id="wrapper" aria-label={ Locale.reader.app.publicationWrapper }>
        { !isPaged ? 
          <ScrollAffordance 
            pref={ RSPrefs.scroll.topAffordance } 
          /> : 
          <></> 
        }

        <div id="container" ref={ container }></div>

        { !isPaged ? 
          <ScrollAffordance 
            pref={ RSPrefs.scroll.bottomAffordance } 
          /> : 
          <></> 
        }
      </article>

    { isPaged ?
      <nav className={ arrowStyles.container } id={ arrowStyles.right }>
        <ArrowButton 
          direction="right"  
          disabled={ atPublicationEnd }
        />
      </nav> : 
      <></>
    }

    { isPaged ? <ReaderFooter /> : <></>}
  </main>
  </>
)};