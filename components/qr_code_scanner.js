import React from "react";
import { StyleSheet, Alert, Dimensions } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Block, Text } from "expo-ui-kit";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/fr";

const { width, height } = Dimensions.get("window");

class QRScanner extends React.Component {
  _is_mounted = false;

  state = {
    has_permission: false,
    has_scanned: false,
  };

  get_permission = async () => {
    const { granted } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({ has_permission: granted });
  };

  componentDidMount() {
    this._is_mounted = true;
    this._is_mounted && this.get_permission();
    this.props.navigation.setOptions({
      title: null,
      headerShown: false,
      //headerTransparent: true,
    });
  }

  componentWillUnmount() {
    this._is_mounted = false;
  }

  handle_scanner = async ({ type, data }) => {
    const { navigation, dispatch, visitor_list, route, training_visitors } =
      this.props;
    const training =
      route.params && route.params.training ? route.params.training : null;
    console.log("training", training);
    if (type === 256) {
      this.setState({ has_scanned: true });
      try {
        let _data = JSON.parse(data);
        if (
          _data.api !== undefined &&
          _data.api === "ideation_camp_ujkz" &&
          _data.id !== undefined
        ) {
          _data.arrived_at = moment().unix();
          let _index = null;
          if (training !== null) {
            _index = training_visitors.findIndex(
              (value) =>
                value.id === _data.id &&
                value.training === training.training &&
                moment(value.training).isSame(_data.arrived_at, "day")
            );
          } else {
            _index = visitor_list.findIndex(
              (value) =>
                value.id === _data.id &&
                moment(value.arrived_at).isSame(_data.arrived_at, "day")
            );
          }
          console.log(_index);
          if (_index === -1) {
            if (training !== null) {
              _data.training = training.training;
              _data.trainer = training.trainer;
              _data.hour = training.hour;
              dispatch({ type: "add_training_visitor", value: _data });
            } else {
              dispatch({ type: "add_visitor", value: _data });
            }

            Alert.alert(
              "Alerte",
              `${_data.first_name} ${_data.last_name} enregistré.`
            );
          } else {
            Alert.alert(
              "Alerte",
              `${_data.first_name} ${_data.last_name} déjà enregistré pour aujourd'hui.`
            );
          }
        } else {
          Alert.alert("Erreur", `QRCOde non valide.`);
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Erreur", `QRCOde non valide.`);
      }
      navigation.goBack();
    }
  };

  render() {
    const { has_permission, has_scanned } = this.state;
    return (
      <Block>
        {has_permission ? (
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            onBarCodeScanned={has_scanned ? undefined : this.handle_scanner}
            style={[StyleSheet.absoluteFill]}
          />
        ) : (
          <Block center middle>
            <Text h1>Need your permission to scan</Text>
          </Block>
        )}
      </Block>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
    visitor_list: state.visitor_list,
    training_visitors: state.training_visitors,
  };
};

export default connect(mapStateToProps)(QRScanner);
