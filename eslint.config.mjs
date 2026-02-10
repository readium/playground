import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
      ".vercel/**",
      ".wrangler/**",
      ".rollup.cache/**",
    ],
  },
  {
    files: [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.test.{js,jsx,ts,tsx}",
      "!src/**/__tests__/**",
      "!src/**/__mocks__/**"
    ],
    rules: {
      // Keep rules-of-hooks as error
      "react-hooks/rules-of-hooks": "error",
      // Set exhaustive-deps to warning
      "react-hooks/exhaustive-deps": "warn",
      // Disable other rules, as Next.JS lint config < 16 did
      "react-hooks/exhaustive-deps-misuse": "off",
      "react-hooks/stable-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/globals": "off",
      "react-hooks/use-memo": "off"
    }
  },
];

export default eslintConfig;
