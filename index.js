/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./android/app.json";

// Initialize Tempo Devtools if available
if (typeof window !== "undefined") {
  try {
    const { TempoDevtools } = require("tempo-devtools");
    TempoDevtools.init();
  } catch (e) {
    console.log("Tempo devtools not available");
  }
}

AppRegistry.registerComponent(appName, () => App);
