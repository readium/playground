/** Converts Object properties to CSSProperties, recursively. If recursive, the prefix will be ignored for objects */
export const propsToCSSVars = (props: { [x: string]: any; }, prefix?: string) => {
  return Object.entries(props)
          .reduce((acc: { [key: string]: any }, [key, value]) => {
            const cssVar = prefix ? `--${prefix}-${key}` : `--${key}`;
            if (typeof props[key] === "object" && props[key] !== null) {
              Object.assign(acc, propsToCSSVars(props[key], `${key}`));
            } else {
              if (value) {
                const cssValue = typeof value === "number" ? `${value}px` : value;
                acc[cssVar] = cssValue;
              }
            } 
            return acc;
          }, {})
}