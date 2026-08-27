import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Hydration pattern reads browser-only state (localStorage/matchMedia) in an
      // effect and syncs it to state after mount. The compiler-derived rule flags this
      // canonical pattern; refactoring to useSyncExternalStore would add churn for no benefit here.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "data/items/**",
    "data/names.json",
    "data/search-index.json",
    "data/hadiths.json",
    "public/data/**",
    "scripts/*.js",
    "scripts/*.jsx",
  ]),
]);
