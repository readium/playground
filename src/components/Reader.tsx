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
import { useEffect, useState, useRef } from "react";

import { ReaderHeader } from "./ReaderHeader";
import { ArrowButton } from "./ArrowButton";
import { IProgression, ProgressionOf } from "./ProgressionOf";

import { autoPaginate } from "@/helpers/autoLayout/autoPaginate";
import { getOptimalLineLength } from "@/helpers/autoLayout/optimalLineLength";
import { propsToCSSVars } from "@/helpers/propsToCSSVars";
import { useLocalStorage } from "@uidotdev/usehooks";

export const Reader = ({ rawManifest, selfHref }: { rawManifest: object, selfHref: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const arrowsWidth = useRef(2 * ((RSPrefs.theming.arrow.size || 40) + (RSPrefs.theming.arrow.offset || 0)));
  const publicationTitle = useRef(Locale.reader.app.header.title);
  const isRTL = useRef(false);
  const breakpointReached = useRef(false);

  const [immersive, setImmersive] = useState(false);
  const [fullscreen, setFullscren] = useState(false);
  const [publicationStart, setPublicationStart] = useState(false);
  const [publicationEnd, setPublicationEnd] = useState(false);

  // In practice, selfHref is what is used to set the self link, which is our scope
  const [currentLocation, saveCurrentLocation] = useLocalStorage<Locator | null>(`${selfHref}-current-location`, null)
  const [progression, setProgression] = useState<IProgression>({});

  const activateImmersiveOnAction = () => {
    if (!immersive) setImmersive(true);
  }

  const toggleImmersive = () => {
    setImmersive(immersive => !immersive);
  }

  useEffect(() => {
    const fetcher: Fetcher = new HttpFetcher(undefined, selfHref);
    const manifest = Manifest.deserialize(rawManifest)!;
    manifest.setSelfLink(selfHref);

    const publication = new Publication({
      manifest: manifest,
      fetcher: fetcher,
    });

    let positionsList: Locator[] | undefined;
    
    let optimalLineLength: number;

    publicationTitle.current = publication.metadata.title.getTranslation("en");
    isRTL.current = publication.metadata.effectiveReadingProgression === ReadingProgression.rtl;

    setProgression(progression => progression = { ...progression, currentPublication: publicationTitle.current});

    const fetchPositions = async () => {
      const positionsJSON = publication.manifest.links.findWithMediaType("application/vnd.readium.position-list+json");
      if (positionsJSON) {
        const fetcher = new HttpFetcher(undefined, selfHref);
        const fetched = fetcher.get(positionsJSON);
        try {
          const positionObj = await fetched.readAsJSON() as {total: number, positions: Locator[]};
          positionsList = positionObj.positions;
          setProgression(progression => progression = { ...progression, totalPositions: positionObj.total });
        } catch(err) {
          console.error(err)
        }
      }
    };

    fetchPositions()
      .catch(console.error);

    const p = new Peripherals({
      moveTo: (direction) => {
        if (direction === "right") {
          nav.goRight(true, activateImmersiveOnAction);
        } else if (direction === "left") {
          nav.goLeft(true, activateImmersiveOnAction);
        }
      },
      goProgression: (shiftKey) => {
        shiftKey 
          ? nav.goBackward(true, activateImmersiveOnAction) 
          : nav.goForward(true, activateImmersiveOnAction);
      },
      resize: () => {
        handleResize();
      }
    });

    const handleResize = () => {
      if (nav && container.current) {
        breakpointReached.current = RSPrefs.breakpoint < container.current.clientWidth;

        const containerWidth = breakpointReached.current ? window.innerWidth - arrowsWidth.current : window.innerWidth;
        container.current.style.width = `${containerWidth}px`;

        if (nav.layout === EPUBLayout.reflowable) {
          const colCount = autoPaginate(RSPrefs.breakpoint, containerWidth, optimalLineLength);

          nav._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
            if (frameManager) {
              frameManager.window.document.documentElement.style.setProperty("--RS__colCount", `${colCount}`);
              frameManager.window.document.documentElement.style.setProperty("--RS__defaultLineLength", `${optimalLineLength}rem`);
              frameManager.window.document.documentElement.style.setProperty("--RS__pageGutter", `${RSPrefs.typography.pageGutter}px`);
            }
          });
        }
      }
    };

    const initReadingEnv = () => {
      if (nav.layout === EPUBLayout.reflowable) {
        optimalLineLength = getOptimalLineLength({
          chars: RSPrefs.typography.lineLength,
          fontFace: fontStacks.RS__oldStyleTf,
          pageGutter: RSPrefs.typography.pageGutter,
        //  letterSpacing: 2,
        //  wordSpacing: 2,
        //  sample: "It will be seen that this mere painstaking burrower and grub-worm of a poor devil of a Sub-Sub appears to have gone through the long Vaticans and street-stalls of the earth, picking up whatever random allusions to whales he could anyways find in any book whatsoever, sacred or profane. Therefore you must not, in every case at least, take the higgledy-piggledy whale statements, however authentic, in these extracts, for veritable gospel cetology. Far from it. As touching the ancient authors generally, as well as the poets here appearing, these extracts are solely valuable or entertaining, as affording a glancing bird’s eye view of what has been promiscuously said, thought, fancied, and sung of Leviathan, by many nations and generations, including our own."
        });
        handleResize();
      }
    }

    const handleProgression = (locator: Locator) => {
      const relativeRef = locator.title || Locale.reader.app.progression.referenceFallback;
      
      setProgression(progression => progression = { ...progression, currentPositions: nav.currentPositionNumbers, relativeProgression: locator.locations.progression, currentChapter: relativeRef, totalProgression: locator.locations.totalProgression });
    }

    const handleTap = (event: FrameClickEvent) => {
      const oneQuarter = ((nav._cframes.length === 2 ? nav._cframes[0]!.window.innerWidth + nav._cframes[1]!.window.innerWidth : nav._cframes[0]!.window.innerWidth) * window.devicePixelRatio) / 4;
      if (event.x < oneQuarter) {
        nav.goLeft(true, activateImmersiveOnAction);
      } 
      else if (event.x > oneQuarter * 3) {
        nav.goRight(true, activateImmersiveOnAction);
      } else if (oneQuarter <= event.x && event.x <= oneQuarter * 3) {
        toggleImmersive();
      }
    }

    const listeners: EpubNavigatorListeners = {
      frameLoaded: function (_wnd: Window): void {
        initReadingEnv();
        nav._cframes.forEach(
          (frameManager: FrameManager | FXLFrameManager | undefined) => {
            if (frameManager) p.observe(frameManager.window);
          }
        );
        p.observe(window);
      },
      positionChanged: function (locator: Locator): void {
        window.focus();

        handleProgression(locator);
        saveCurrentLocation(locator);
      },
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
    const nav = new EpubNavigator(container.current!, publication, listeners, positionsList, currentLocation ? currentLocation : undefined);
    nav.load().then(() => {
      p.observe(window);

      window.addEventListener("reader-control", (ev) => {
        const detail = (ev as CustomEvent).detail as {
          command: string;
          data: unknown;
        };
        switch (detail.command) {
          case "goRight":
            nav.goRight(true, () => {});
            break;
          case "goLeft":
            nav.goLeft(true, () => {});
            break;
          case "goTo":
            const link = nav.publication.linkWithHref(detail.data as string);
            if (!link) {
              console.error("Link not found", detail.data);
              return;
            }
            nav.goLink(link, true, () => {});
            break;
          default:
            console.error("Unknown reader-control event", ev);
        }
      });
    });

    return () => {
      // Cleanup TODO!
      p.destroy();
      nav.destroy();
    };
  }, [rawManifest, selfHref]);

  return (
    <>
    <main style={propsToCSSVars(RSPrefs.theming.color, "color")}>
      <ReaderHeader 
        className={immersive ? "immersive" : ""} 
        title = { publicationTitle.current } 
      />

      <nav className={arrowStyles.container} id={arrowStyles.left}>
        <ArrowButton 
          direction="left" 
          className={(immersive && !breakpointReached.current || fullscreen || publicationStart) ? arrowStyles.hidden : immersive ? arrowStyles.immersive : ""} 
          isRTL={isRTL.current} 
          disabled={publicationStart}
        />
      </nav>

      <article id="wrapper" aria-label={Locale.reader.app.publicationWrapper}>
        <div id="container" ref={container}></div>
      </article>

      <nav className={arrowStyles.container} id={arrowStyles.right}>
        <ArrowButton 
          direction="right" 
          className={(immersive && !breakpointReached.current || fullscreen || publicationEnd) ? arrowStyles.hidden : immersive ? arrowStyles.immersive : ""} 
          isRTL={isRTL.current} 
          disabled={publicationEnd}
        />
      </nav>

      <aside className={immersive ? "immersive" : ""}  id="bottom-bar">
        <ProgressionOf 
          progression={progression} 
        />
      </aside>
    </main>
    </>
  );
};
