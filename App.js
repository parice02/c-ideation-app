import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";

import Drawer from "./navigations/principal";
import Store from "./store/conf_store";

export default class App extends React.Component {
  state = { loading: true };

  async componentDidMount() {
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
    this.setState({ loading: false }, async () => {
      await SplashScreen.hideAsync();
    });
  }

  render() {
    if (this.state.loading) {
      return <></>;
    }

    const persistor = persistStore(Store);
    persistor.purge();
    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <PaperProvider>
            <NavigationContainer>
              <Drawer />
            </NavigationContainer>
          </PaperProvider>
        </PersistGate>
      </Provider>
    );
  }
}
