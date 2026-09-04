import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Plain browser-extension JS, loaded via <script> tags with no bundler —
    // cross-file globals (validators.js's functions used by onboarding.js
    // and popup.js) are real, not the unused-var/import issues this
    // Next.js/React ruleset is built to catch.
    "extension/**",
  ]),
]);

export default eslintConfig;
