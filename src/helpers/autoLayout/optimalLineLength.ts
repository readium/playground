export interface customFont {
  name: string;
  url: string;
}

export interface LineLengthTypography {
  chars: number;
  sample?: string;
  pageGutter?: number;
  fontFace?: string | customFont;
  letterSpacing?: number;
  wordSpacing?: number;
  isCJK?: boolean;
}

// We’re “embracing” design limitations of the ch length
// See https://developer.mozilla.org/en-US/docs/Web/CSS/length#ch

export const getOptimalLineLength = (typo: LineLengthTypography): number => {
  const defaultFontSize = 16;
  const padding = typo.pageGutter ? typo.pageGutter * 2 : 0;
  const letterSpacing = typo.letterSpacing || 0;
  const wordSpacing = typo.wordSpacing || 0;

  // It’s impractical or impossible to get the font in canvas 
  // so we assume it’s 0.5em wide by 1em tall
  let optimalLineLength = Math.round((typo.chars * ((defaultFontSize * 0.5) + letterSpacing)) + padding) / defaultFontSize;

  const approximateWordSpaces = () => {
    let wordSpaces = 0;
    if (typo.sample && typo.sample.length >= typo.chars) {
      const spaceCount = typo.sample.match(/([\s]+)/gi);
      // Average for number of chars
      wordSpaces = (spaceCount ? spaceCount.length : 0) * (typo.chars / typo.sample.length);
    }
    return wordSpaces;
  }

  const measureText = (canvas: HTMLCanvasElement, fontFace: string) => {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      // ch based on 0, ic based on water ideograph
      let txt = typo.isCJK ? "水".repeat(typo.chars) : "0".repeat(typo.chars);
      ctx.font = `${defaultFontSize}px ${fontFace}`;

      if (typo.sample && typo.sample.length >= typo.chars) {
        txt = typo.sample.slice(0, typo.chars);
      }

      // Not supported in Safari
      if (Object.hasOwn(ctx, "letterSpacing") && Object.hasOwn(ctx, "wordSpacing")) {
        ctx.letterSpacing = letterSpacing.toString() + "px";
        ctx.wordSpacing = wordSpacing.toString() + "px";
        optimalLineLength = Math.round(ctx.measureText(txt).width + padding) / defaultFontSize;
      } else {
        // Instead of filling text with an offset for each character and space
        // We simply add them to the measured width
        const letterSpace = letterSpacing * (typo.chars - 1);
        const wordSpace = wordSpacing * approximateWordSpaces();
        optimalLineLength = Math.round(ctx.measureText(txt).width + letterSpace + wordSpace + padding) / defaultFontSize;
      }
    }
  }

  if (typo.fontFace) {
    // We know the font and can use canvas as a proxy
    // to get the optimal width for the number of characters
    const canvas = document.createElement("canvas");
    if (typeof typo.fontFace === "string") {
      measureText(canvas, typo.fontFace);
    } else {
      const customFont = new FontFace(typo.fontFace.name, `url(${typo.fontFace.url})`);
      customFont.load().then(
        () => {
          document.fonts.add(customFont);
          measureText(canvas, customFont.family)
        },
        (_err) => {});
    }
  }

  return optimalLineLength;
}