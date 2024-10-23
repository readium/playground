export interface customFont {
  name: string;
  url: string;
}

export interface LineLengthTypography {
  minChars: number | null;
  optimalChars: number;
  fontSize?: number;
  sample?: string;
  pageGutter?: number;
  fontFace?: string | customFont;
  letterSpacing?: number;
  wordSpacing?: number;
  isCJK?: boolean;
}

export interface IOptimalLineLength {
  min: number;
  optimal: number;
  fontSize: number;
}

export const DEFAULT_FONT_SIZE = 16;

// We’re “embracing” design limitations of the ch length
// See https://developer.mozilla.org/en-US/docs/Web/CSS/length#ch

export const getOptimalLineLength = (typo: LineLengthTypography): IOptimalLineLength => {
  const padding = typo.pageGutter ? typo.pageGutter * 2 : 0;
  const letterSpacing = typo.letterSpacing || 0;
  const wordSpacing = typo.wordSpacing || 0;
  const fontSize = typo.fontSize || DEFAULT_FONT_SIZE;
  const divider = (typo.minChars && typo.minChars < typo.optimalChars) ? (typo.optimalChars / typo.minChars) : 1;

  // It’s impractical or impossible to get the font in canvas 
  // so we assume it’s 0.5em wide by 1em tall
  let optimalLineLength = (typo.optimalChars * ((fontSize * 0.5) + letterSpacing));

  const approximateWordSpaces = () => {
    let wordSpaces = 0;
    if (typo.sample && typo.sample.length >= typo.optimalChars) {
      const spaceCount = typo.sample.match(/([\s]+)/gi);
      // Average for number of chars
      wordSpaces = (spaceCount ? spaceCount.length : 0) * (typo.optimalChars / typo.sample.length);
    }
    return wordSpaces;
  }

  const measureText = (canvas: HTMLCanvasElement, fontFace: string) => {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      // ch based on 0, ic based on water ideograph
      let txt = typo.isCJK ? "水".repeat(typo.optimalChars) : "0".repeat(typo.optimalChars);
      ctx.font = `${DEFAULT_FONT_SIZE}px ${fontFace}`;

      if (typo.sample && typo.sample.length >= typo.optimalChars) {
        txt = typo.sample.slice(0, typo.optimalChars);
      }

      // Not supported in Safari
      if (Object.hasOwn(ctx, "letterSpacing") && Object.hasOwn(ctx, "wordSpacing")) {
        ctx.letterSpacing = letterSpacing.toString() + "px";
        ctx.wordSpacing = wordSpacing.toString() + "px";
        optimalLineLength = ctx.measureText(txt).width;
      } else {
        // Instead of filling text with an offset for each character and space
        // We simply add them to the measured width
        const letterSpace = letterSpacing * (typo.optimalChars - 1);
        const wordSpace = wordSpacing * approximateWordSpaces();
        optimalLineLength = ctx.measureText(txt).width + letterSpace + wordSpace;
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

  return {
    min: Math.round((optimalLineLength / divider) + padding) / fontSize,
    optimal: Math.round(optimalLineLength + padding) / fontSize,
    fontSize: fontSize
  }
}