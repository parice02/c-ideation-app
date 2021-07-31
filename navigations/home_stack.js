import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Block, Button } from "expo-ui-kit";
import { Ionicons } from "react-native-vector-icons";
import { connect } from "react-redux";
import { moderateScale } from "react-native-size-matters";

import Home from "../pages/home";
import QRCode from "../components/qr_code_scanner";

const icon_size = moderateScale(20);

const Stack = createStackNavigator();

class MyStack extends React.Component {
  render() {
    const { constants } = this.props;
    const { colors } = constants;

    return (
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerStyle: {
            elevation: 0,
            backgroundColor: colors.maincolor,
          },
          headerLeft: () => (
            <Button
              padding
              margin
              transparent
              onPress={() =>
                route.name === "home_stack"
                  ? navigation.toggleDrawer()
                  : navigation.goBack()
              }
            >
              <Ionicons
                name={route.name === "home_stack" ? "menu" : "arrow-back"}
                color={"white"}
                size={icon_size}
              />
            </Button>
          ),
        })}
      >
        <Stack.Screen
          name="home_stack"
          component={Home}
          options={{ title: "Home" }}
        />
        <Stack.Screen name="qr_stack" component={QRCode} />
      </Stack.Navigator>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
  };
};

export default connect(mapStateToProps)(MyStack);
