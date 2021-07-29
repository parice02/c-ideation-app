import React from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { connect } from "react-redux";
import Color from "color";

const logo_uri = require("../assets/icon.png");

class DrawerMenu extends React.Component {
  render() {
    const { constants } = this.props;
    const { colors } = constants;

    return (
      <DrawerContentScrollView style={{ flex: 1 }} {...this.props}>
        <View style={[styles_header.container]}>
          {/* <Image
            source={logo_uri}
            resizeMode={"center"}
            style={{ flex: 1, height: 200 }}
          /> */}
        </View>
        <DrawerItemList {...this.props} style={{ flex: 1 }} />
      </DrawerContentScrollView>
    );
  }
}

const styles_header = StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
    borderBottomWidth: 0.6,
  },
});

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
  };
};

export default connect(mapStateToProps)(DrawerMenu);
