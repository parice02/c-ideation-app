import React from "react";
import { StyleSheet, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Block, Text } from "expo-ui-kit";
import { connect } from "react-redux";
import moment from "moment";

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
  }

  componentWillUnmount() {
    this._is_mounted = false;
  }

  handle_scanner = async ({ type, data }) => {
    const { navigation, dispatch, visitor_list = [] } = this.props;
    if (type === 256) {
      this.setState({ has_scanned: true });
      try {
        let _data = JSON.parse(data);
        if (
          _data.api !== undefined &&
          _data.api === "ideation_camp_2021" &&
          _data.id !== undefined
        ) {
          _data.arrived_at = moment().unix();
          const _index = visitor_list.findIndex(
            (value) =>
              value.id === _data.id &&
              moment(value.arrived_at).isSame(_data.arrived_at, "day")
          );
          if (_index === -1) {
            dispatch({ type: "add_visitor", value: _data });
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
        Alert.alert("Erreur", `QRCOde non valide.`);
      }
      navigation.goBack();
    }
  };

  render() {
    const { has_permission, has_scanned } = this.state;
    return (
      <Block flex>
        {has_permission ? (
          <BarCodeScanner
            type={BarCodeScanner.Constants.Type.back}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            onBarCodeScanned={has_scanned ? null : this.handle_scanner}
            style={[StyleSheet.absoluteFillObject, { flex: 1 }]}
          />
        ) : (
          <Block center middle>
            <Text h2>Need your permission to scan</Text>
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
  };
};

export default connect(mapStateToProps)(QRScanner);
