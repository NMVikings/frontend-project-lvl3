module.exports = {
  env: {
    node: true,
    browser: true,
    jest: true
  },
  plugins: ["babel", "jest"],
  extends: ["airbnb-base", "plugin:jest/all"],
  parser: "babel-eslint",
  rules: {},
};
