"use client";

import { useEffect, useState } from "react";

import { HttpFetcher } from "@readium/shared";
import { Link } from "@readium/shared";

import "../app.css";

import { ThThemeKeys } from "@edrlab/thorium-web/core/preferences";

import { 
  ThPlugin,
  useTheming,  
  usePreferences,
  useAppDispatch, 
  useAppSelector,
  setBreakpoint, 
  setColorScheme, 
  setContrast, 
  setForcedColors, 
  setMonochrome, 
  setReducedMotion, 
  setReducedTransparency
} from "@edrlab/thorium-web/epub";

import dynamic from "next/dynamic";
const Reader = dynamic<{ rawManifest: object; selfHref: string; plugin?: ThPlugin }>(() => import("@/Components/CustomReader").then((mod) => mod.CustomReader), { ssr: false });

const StatefulLoader = dynamic(() => 
  import("@edrlab/thorium-web/epub").then((mod) => mod.StatefulLoader),
  { ssr: false }
);

import { propsToCSSVars } from "@edrlab/thorium-web/core/helpers";

// TODO page metadata w/ generateMetadata

export default function ReaderPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const [isClient, setIsClient] = useState(false);
  const [params, setParams] = useState<{ [key: string]: string | string[] | undefined } | null>(null);
  const [error, setError] = useState("");
  const [manifest, setManifest] = useState<object | undefined>(undefined);
  const [selfLink, setSelfLink] = useState<string | undefined>(undefined);

  const readerIsLoading = useAppSelector(state => state.reader.isLoading);

  const RSPrefs = usePreferences();
  const theme = useAppSelector(state => state.theming.theme);

  const dispatch = useAppDispatch();

  // Init theming (breakpoints, theme, media queries…)
  useTheming<ThThemeKeys>({ 
    theme: theme,
    themeKeys: RSPrefs.theming.themes.keys,
    systemKeys: {
      light: ThThemeKeys.light,
      dark: ThThemeKeys.dark,
    },
    breakpointsMap: RSPrefs.theming.breakpoints,
    initProps: {
      ...propsToCSSVars(RSPrefs.theming.arrow, "arrow"), 
      ...propsToCSSVars(RSPrefs.theming.icon, "icon"),
      ...propsToCSSVars(RSPrefs.theming.layout, "layout")
    },
    onBreakpointChange: (breakpoint) => dispatch(setBreakpoint(breakpoint)),
    onColorSchemeChange: (colorScheme) => dispatch(setColorScheme(colorScheme)),
    onContrastChange: (contrast) => dispatch(setContrast(contrast)),
    onForcedColorsChange: (forcedColors) => dispatch(setForcedColors(forcedColors)),
    onMonochromeChange: (isMonochrome) => dispatch(setMonochrome(isMonochrome)),
    onReducedMotionChange: (reducedMotion) => dispatch(setReducedMotion(reducedMotion)),
    onReducedTransparencyChange: (reducedTransparency) => dispatch(setReducedTransparency(reducedTransparency))
  });

  useEffect(() => {
    setIsClient(true);
    searchParams.then((params) => setParams(params));
  }, [searchParams]);

  useEffect(() => {
    if (params && isClient) {
      let book = "moby-dick";
      let publicationURL = "";
      if (params["book"]) {
        book = Array.isArray(params["book"]) ? params["book"][0] : params["book"];
      }
      
      if (book.startsWith("http://") || book.startsWith("https://")) {
        // TODO: use URL.canParse()
        // Make sure streamer gets Base64Url
        const bookUrl = new URL(book);
        const bookPathnameArray = bookUrl.pathname.split("/");
        const sanitizedBookPathnameArray = bookPathnameArray.map((entry) => {
          if (entry && entry !== "manifest.json") {
            return entry.replace(/\+|%2B/g, "-").replace(/\/|%2F/g, "_").replace(/=|%3D/g, "");
          } else {
            return entry;
          }
        });
        const sanitizedBook = new URL(sanitizedBookPathnameArray.join("/"), bookUrl.origin);
        publicationURL = sanitizedBook.href;
          
        if (!publicationURL.endsWith("manifest.json") && !publicationURL.endsWith("/"))
          publicationURL += "/";
      } else {
        throw new Error("book parameter is required");
      }
  
      const manifestLink = new Link({ href: "manifest.json" });
      const fetcher = new HttpFetcher(undefined, publicationURL);
      const fetched = fetcher.get(manifestLink);
      fetched.link().then((link) => {
        setSelfLink(link.toURL(publicationURL));
      });

      fetched.readAsJSON().then((manifestData) => {
        setManifest(manifestData as object);
      }).catch((error) => {
        console.error("Error loading manifest:", error);
        setError(`Failed loading manifest ${ publicationURL }: ${ error.message }`);
      });
    }
  }, [params, isClient]);

  return (
    <>
    { error 
      ? <span>{ error }</span> 
      : <StatefulLoader isLoading={ readerIsLoading }>
          { isClient && manifest && selfLink && <Reader rawManifest={ manifest } selfHref={ selfLink } /> }
        </StatefulLoader>        
    }
    </>
  );
}