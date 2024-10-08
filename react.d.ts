declare module "react" {
  // allow CSS custom properties
  interface CSSProperties {
    [varName: `--${string}`]: string | number | undefined;
  }
}

export {};