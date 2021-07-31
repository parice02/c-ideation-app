import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { connect } from "react-redux";
import * as SecureStore from "expo-secure-store";

import DrawerMenu from "./menu_drawer";
import Login from "../pages/login";

const Stack = createStackNavigator();

class AppStack extends React.Component {
  async componentDidMount() {
    /* const user_token = await SecureStore.getItemAsync("user_token");
    const user_username = await SecureStore.getItemAsync("user_username");

    if (user_token && user_username) {
      this.props.dispatch({ type: "has_account" });
    } else {
      this.props.dispatch({ type: "has_not_account" });
    } */
  }

  render() {
    const { has_account } = this.props;

    return (
      <Stack.Navigator
        initialRouteName={"menu_drawer"}
        screenOptions={{
          headerShown: false,
        }}
      >
        {has_account ? (
          <Stack.Screen name={"menu_drawer"} component={DrawerMenu} />
        ) : (
          <Stack.Screen name={"login_stack"} component={Login} />
        )}
      </Stack.Navigator>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    has_account: state.has_account.value,
  };
};

export default connect(mapStateToProps)(AppStack);
