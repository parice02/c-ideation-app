import React from "react";
import { StyleSheet, StatusBar, Button } from "react-native";
import { Block, Text } from "expo-ui-kit";
import { connect } from "react-redux";

class TrainingScan extends React.Component {
  componentDidMount() {
    const { navigation, route } = this.props;
    navigation.setOptions({ title: route.params.training.training });
  }

  on_press = () => {
    const { navigation, route } = this.props;
    navigation.navigate("training_qrcode", { training: route.params.training });
  };

  render() {
    const { constants, route } = this.props;
    const { colors } = constants;

    return (
      <Block white>
        <StatusBar
          backgroundColor={colors.maincolor}
          barStyle={"light-content"}
          style="auto"
        />
        <Text h2 margin padding>
          Attention ! {"\n"}
          Vous enregistrer pour la formation / communication{" "}
          {route.params.training.training}
        </Text>
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

export default connect(mapStateToProps)(TrainingScan);
