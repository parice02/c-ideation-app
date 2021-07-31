import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Block, Button } from "expo-ui-kit";
import { Ionicons } from "react-native-vector-icons";
import { connect } from "react-redux";
import { moderateScale } from "react-native-size-matters";

import Trainings from "../pages/training";
import TrainingScan from "../pages/training_scan";
import TrainingQRCode from "../components/qr_code_scanner";

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
            elevation: 10,
            backgroundColor: colors.maincolor,
          },
          headerLeft: () => (
            <Button
              padding
              margin
              transparent
              onPress={() =>
                route.name === "list_formation"
                  ? navigation.toggleDrawer()
                  : navigation.goBack()
              }
            >
              <Ionicons
                name={route.name === "list_formation" ? "menu" : "arrow-back"}
                color={"white"}
                size={icon_size}
              />
            </Button>
          ),
        })}
      >
        <Stack.Screen
          name="list_formation"
          component={Trainings}
          options={{ title: "Les formations" }}
        />
        <Stack.Screen
          name="training_scan"
          component={TrainingScan}
          //options={{ title: "Les formations" }}
        />
        <Stack.Screen name="training_qrcode" component={TrainingQRCode} />
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
