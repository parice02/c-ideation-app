import React from "react";
import { StyleSheet, StatusBar, Button } from "react-native";
import { Block } from "expo-ui-kit";
import { connect } from "react-redux";

class Home extends React.Component {
  render() {
    const { navigation, constants } = this.props;
    const { colors } = constants;

    return (
      <Block white>
        <StatusBar
          backgroundColor={colors.maincolor}
          barStyle={"light-content"}
          style="auto"
        />
        <Block center middle>
          <Button
            title={"Press to Scan"}
            color={colors.maincolor}
            onPress={() => navigation.navigate("qr_stack")}
          />
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
  };
};

export default connect(mapStateToProps)(Home);
