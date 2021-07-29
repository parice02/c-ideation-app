import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import DrawerMenu from "./menu_drawer";

const Stack = createStackNavigator();

class AppStack extends React.Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName={"menu_drawer"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="menu_drawer" component={DrawerMenu} />
      </Stack.Navigator>
    );
  }
}

export default AppStack;
