module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/function-component-definition": 0,
    "react/react-in-jsx-scope": 0,
    "react/jsx-props-no-spreading": 0,
    "import/extensions": 0,
    "react/prop-types": 0,
    "linebreak-style": 0,
    "react/state-in-constructor": 0,
    "import/prefer-default-export": 0,
    "max-len": [2, 250],
    "operator-linebreak": 0,
    "comma-dangle": 0,
    "no-console": 0,
    "no-alert": 0,
    "consistent-return": 0,
    radix: 0,
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    "nonblock-statement-body-position": 0,
    curly: 0,
    "implicit-arrow-linebreak": 0,
    "no-underscore-dangle": 0,
    "object-curly-newline": 0,
    "react/jsx-filename-extension": 0,
    "react/jsx-one-expression-per-line": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/alt-text": 0,
    "jsx-a11y/no-autofocus": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "react/no-array-index-key": 0,
    // "react-hooks/exhaustive-deps": 1,
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["to", "hrefLeft", "hrefRight"],
        aspects: ["noHref", "invalidHref", "preferButton"],
      },
    ],
    quotes: [2, "double", { avoidEscape: true }],
  },
};
