import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import { Divider, Button, TextInput } from "react-native-paper";
import { Block, Text } from "expo-ui-kit";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import color from "color";

const _DEFAULT_STATE = {
  trainer: { value: "", error: false },
  training: { value: "", error: false },
  hour: { value: "", error: "" },
  loading: false,
  show_form: false,
  is_update: { check: false, id: null },
};

class Service extends React.Component {
  state = { ..._DEFAULT_STATE };

  render_item = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => this.on_long_press(item)}
      onPress={() => this.on_press(item)}
    >
      <View style={styles.row}>
        <Text margin transform={"capitalize"}>
          {item.training}
        </Text>
      </View>
    </TouchableOpacity>
  );

  on_press = (item) => {
    this.props.navigation.navigate("training_scan", { training: item });
  };

  on_long_press = async (item) => {
    const icon = (name, color) => (
      <MaterialCommunityIcons name={name} key={name} color={color} size={20} />
    );
    const options = ["Modifier", "Supprimer", "Annuler"];
    const icons = [
      icon("circle-edit-outline"),
      icon("delete-outline", "red"),
      icon("cancel"),
    ];

    const cancelButtonIndex = 2;
    const destructiveButtonIndex = 1;
    const process = async (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          /* this.setState(() => ({
            show_form: true,
            trainer: { value: item.trainer, error: false },
            training: { value: item.training, error: false },
            hour: { value: item.hour, error: false },
            is_update: { check: true, id: item.id },
          })); */
          break;
        case 1:
          break;
        default:
          break;
      }
    };
    this.props.showActionSheetWithOptions(
      { options, cancelButtonIndex, destructiveButtonIndex, icons },
      process
    );
  };

  render_separator = () => <Divider />;

  toggle_form = () =>
    this.setState((state) => ({ show_form: !state.show_form }));

  render_footer_header = () => <Block />;

  render_empty_list = () => (
    <Text middle center h3>
      Aucune formation sauvegarder
    </Text>
  );

  render_form = () => {
    const { training, trainer, hour, loading } = this.state;
    const { constants } = this.props;
    const { colors } = constants;

    return (
      <Block scroll>
        <Block>
          <TextInput
            label={"Intitulé de la formation"}
            autoFocus={true}
            required={true}
            dense={true}
            onChangeText={this.on_entitled_change}
            autoCompleteType={"name"}
            value={training.value}
            error={training.error}
          />
        </Block>
        <Block>
          <TextInput
            label={"Nom complet du formateur"}
            required={true}
            dense={true}
            onChangeText={this.on_trainer_change}
            value={trainer.value}
            error={trainer.error}
          />
        </Block>
        <Block>
          <TextInput
            label={"Heure début - heure fin"}
            required={true}
            dense={true}
            onChangeText={this.on_hour_change}
            value={hour.value}
            error={hour.error}
          />
        </Block>
        <Block row space={"between"} margin={"4x"}>
          <Button
            icon="cancel"
            mode="outlined"
            onPress={() => {
              this.setState({ ..._DEFAULT_STATE });
            }}
            color={colors.danger}
            style={styles.button}
          >
            annuler
          </Button>

          <Button
            icon="content-save"
            mode="outlined"
            onPress={this.on_submit}
            color={colors.primary}
            style={styles.button}
            loading={loading}
          >
            sauvegarder
          </Button>
        </Block>
      </Block>
    );
  };

  on_trainer_change = (value) =>
    this.setState({ trainer: { value: value, error: false } });

  on_entitled_change = (value) => {
    this.setState({ training: { value: value, error: false } });
  };
  on_hour_change = (value) => {
    this.setState({ hour: { value: value, error: false } });
  };

  validate = () => {
    const { training, hour, trainer } = this.state;
    let error_count = 0;
    if (!training.value) {
      this.setState(() => ({ training: { value: "", error: true } }));
      error_count++;
    }
    if (!hour.value) {
      this.setState(() => ({ hour: { value: "", error: true } }));
      error_count++;
    }
    if (!trainer.value) {
      this.setState(() => ({ trainer: { value: "", error: true } }));
      error_count++;
    }
    return error_count ? false : true;
  };

  on_submit = async () => {
    this.setState(() => ({ loading: true }));
    if (this.validate()) {
      const { trainer, training, hour, is_update } = this.state;
      const formation = {
        training: training.value,
        trainer: trainer.value,
        hour: hour.value,
        id: is_update.check
          ? is_update.id
          : this.props.training_list.length + 1,
      };

      if (is_update.check) {
        //En cas de modification d'une formation
      } else {
        this.props.dispatch({ type: "add_training", value: formation });
        Alert.alert("Alert", "Formation ajoutée avec succès!");
      }
      this.setState(_DEFAULT_STATE);
    }
    this.setState(() => ({ loading: false }));
  };

  render() {
    const { loading, show_form } = this.state;
    const { constants, training_list } = this.props;
    const { colors } = constants;

    return (
      <Block safe transparent flex>
        <StatusBar
          backgroundColor={colors.maincolor}
          barStyle={"light-content"}
          style="auto"
        />
        <Block flex>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
          >
            {show_form && (
              <Animatable.View
                style={[styles.card, { flex: 1 }]}
                animation={show_form ? "fadeIn" : "fadeOut"}
                useNativeDriver={true}
                duration={2000}
              >
                <View style={styles.row}>
                  <Text bold h3 margin style={styles.green}>
                    Ajouter une formation
                  </Text>
                </View>
                <View style={[styles.row, { flex: 1 }]}>
                  {this.render_form()}
                </View>
              </Animatable.View>
            )}

            <Animatable.View
              style={[styles.card, { flex: 1 }]}
              animation={show_form ? "slideInDown" : "slideInUp"}
              useNativeDriver={true}
              duration={1000}
            >
              <View style={styles.row}>
                <Text bold h3 margin style={styles.green}>
                  Formations
                </Text>
                <TouchableOpacity
                  onPress={this.toggle_form}
                  style={{ alignSelf: "center" }}
                >
                  <MaterialCommunityIcons
                    name={!show_form ? "plus" : "minus"}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={training_list}
                renderItem={this.render_item}
                ListEmptyComponent={this.render_empty_list}
                ItemSeparatorComponent={this.render_separator}
                ListFooterComponent={this.render_footer_header}
                ListHeaderComponent={this.render_footer_header}
                keyExtractor={(item, index) => `${index}`}
                onRefresh={this.load_list}
                refreshing={loading}
                progressViewOffset={10}
                legacyImplementation={true}
              />
            </Animatable.View>
          </KeyboardAvoidingView>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    margin: 7,
    marginTop: 10,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: color("#f5f5f5").hex(),
    backgroundColor: "#fff",
  },
  green: {
    color: color("#075e54").hex(),
  },
  button: {
    marginTop: 50,
  },
});

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
    training_list: state.training_list,
  };
};

export default connect(mapStateToProps)(connectActionSheet(Service));
