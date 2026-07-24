import { globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  {
    // Keep legacy findings visible without making the newly restored lint gate
    // unusable. New syntax, import, and framework correctness errors still fail.
    rules: {
      "@next/next/no-html-link-for-pages": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "prefer-const": "warn",
      "react/jsx-no-comment-textnodes": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
    },
  },
  {
    files: ["scripts/**/*.js"],
    rules: {
      // These Node maintenance scripts intentionally run as CommonJS because
      // the package itself is not configured as an ES module.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  globalIgnores([
    ".next/**",
    ".vercel/**",
    "public/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]

export default eslintConfig
