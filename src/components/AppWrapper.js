import React from "react";
import withApi from "../Utils/ApiHelper";
import { NavigationProvider } from "../Utils/NavigationProvider";

import App from "./app";

const AppWithApi = withApi(App); // Apply withApi to App here

const AppWrapper = () => (
  <NavigationProvider> {/* Wrap with NavigationProvider here */}
    <AppWithApi />
  </NavigationProvider>
);

export default AppWrapper;
