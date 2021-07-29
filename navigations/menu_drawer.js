import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Color from "color";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import Home from "./tabs";
import VisitorListStack from "./visitor_lis_stack";
import TrainingStack from "./training_stack";
import DrawerMenu from "../components/drawer_content";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

class MyDrawer extends React.Component {
  async componentDidMount() {}

  render_drawer = (props) => <DrawerMenu {...props} />;

  render() {
    const { constants } = this.props;
    const { colors } = constants;

    return (
      <LinearGradient
        style={{ flex: 1 }}
        colors={[
          Color("yellow").lighten(0.7).hex(),
          Color("yellow").lighten(0.5).hex(),
          Color("yellow").lighten(0.2).hex(),
        ]}
      >
        <Drawer.Navigator
          drawerType={"back"}
          overlayColor={"transparent"}
          initialRouteName={"home"}
          drawerStyle={{
            width: (3 * width) / 5,
            backgroundColor: "transparent",
          }}
          drawerContentOptions={{
            activeTintColor: Color(colors.light).lighten(0.09).hex(),
            inactiveTintColor: Color(colors.dark).lighten(0.09).hex(),
            activeBackgroundColor: Color(colors.maincolor).lighten(0.09).hex(),
            inactiveBackgroundColor: "transparent",
          }}
          sceneContainerStyle={{
            backgroundColor: "transparent",
          }}
          drawerContent={this.render_drawer}
        >
          <Drawer.Screen
            name="home"
            options={{
              drawerLabel: "Accueil",
              drawerIcon: ({ focused, size, color }) => (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          >
            {(props) => <Home {...props} />}
          </Drawer.Screen>
          <Drawer.Screen
            name="other"
            options={{
              drawerLabel: "Liste des participants",
              drawerIcon: ({ focused, size, color }) => (
                <Ionicons
                  name={focused ? "list" : "list-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          >
            {(props) => <VisitorListStack {...props} />}
          </Drawer.Screen>
          <Drawer.Screen
            name="formation_drawer"
            options={{
              drawerLabel: "Les formations",
              drawerIcon: ({ focused, size, color }) => (
                <Ionicons
                  name={focused ? "list" : "list-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          >
            {(props) => <TrainingStack {...props} />}
          </Drawer.Screen>
        </Drawer.Navigator>
      </LinearGradient>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
  };
};

export default connect(mapStateToProps)(MyDrawer);
