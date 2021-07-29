import React from "react";
//import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import AppContainer from "./navigations/app_stack";
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
    //persistor.purge();
    return (
      <ReduxProvider store={Store}>
        <PersistGate persistor={persistor}>
          <PaperProvider>
            <ActionSheetProvider>
              <NavigationContainer>
                <AppContainer />
              </NavigationContainer>
            </ActionSheetProvider>
          </PaperProvider>
        </PersistGate>
      </ReduxProvider>
    );
  }
}
