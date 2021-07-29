import React from "react";
import { Platform, View } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { connect } from "react-redux";

import Home from "./home_stack";
import Other from "./visitor_lis_stack";

const Tab = createBottomTabNavigator();

class Tabs extends React.Component {
  render() {
    const { constants } = this.props;
    const { colors } = constants;

    return (
      <Tab.Navigator
        //screenOptions={({ route }) => ({})}
        tabBarOptions={{
          activeTintColor: colors.danger,
          inactiveTintColor: "darkgray",
        }}
      >
        <Tab.Screen
          name="home"
          component={Home}
          options={{
            title: "Accueil",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={"home"} color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="other"
          component={Other}
          options={{
            title: "Visiteur",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={"list"} color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
  };
};

export default connect(mapStateToProps)(Tabs);
