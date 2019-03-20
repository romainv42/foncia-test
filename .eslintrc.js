module.exports = {
  "extends": ["airbnb-base"],
  "overrides": [
    {
      "files": [
        "*.test.js",
        "*.spec.js"
      ],
      "rules": {
        "class-methods-use-this": "off",
        "global-require": "off",
        "no-console": "off",
        "one-var": "off",
        "import/no-extraneous-dependencies": "off"
      }
    }
  ]
};
