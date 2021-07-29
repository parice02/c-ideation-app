import React from "react";
import { StyleSheet, StatusBar, Button } from "react-native";
import { Block } from "expo-ui-kit";
import { connect } from "react-redux";

class Home extends React.Component {
  on_press = () => this.props.navigation.navigate("qr_stack");

  render() {
    const { constants } = this.props;
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
            onPress={this.on_press}
          />
        </Block>
      </Block>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
  };
};

export default connect(mapStateToProps)(Home);
