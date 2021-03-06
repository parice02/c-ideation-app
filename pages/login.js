import React from "react";
import { View, StyleSheet, StatusBar, Dimensions } from "react-native";
import { connect } from "react-redux";
import {
  Button,
  ActivityIndicator,
  Portal,
  Modal,
  TextInput,
} from "react-native-paper";
import { Block, Text } from "expo-ui-kit";
import Color from "color";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { moderateScale } from "react-native-size-matters";

import { api_url, auth_token, create_user } from "@env";

const { height } = Dimensions.get("screen");
const logo_height = height * 0.3;
const icon_size = moderateScale(20);

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    conf_password: "",
    same_password: null,
    has_account: true,
    show_error: false,
    message_err: "",
    loading: false,
  };

  on_username_change = (username) => {
    this.setState({ username });
  };

  on_password_change = (password) => {
    this.setState({ password });
  };

  on_conf_password_change = (conf_password) => {
    this.setState({ conf_password });
  };

  on_pass_conf_blur = () => {
    const { password, conf_password } = this.state;
    this.setState({ same_password: conf_password === password });
  };

  toggle_has_account = () =>
    this.setState((state) => ({ has_account: !state.has_account }));

  validate = () => {
    const { username, password, conf_password, has_account } = this.state;
    let error_count = 0;

    if (!username) {
      error_count++;
    }

    if (!password) {
      error_count++;
    }

    if (!has_account) {
      if (!conf_password) {
        error_count++;
      }
    }

    if (error_count === 0) return true;
    else return false;
  };

  on_submit = async () => {
    const { dispatch } = this.props;
    const { username, password, has_account } = this.state;
    this.setState(() => ({ loading: true }));
    if (this.validate()) {
      const data = {
        username: username,
        password: password,
      };

      await axios({
        baseURL: api_url,
        url: has_account ? auth_token : create_user,
        method: "post",
        data,
      })
        .then(async (response) => {
          const _data = response.data;
          await SecureStore.setItemAsync("user_username", _data.username);
          //await SecureStore.setItemAsync("user_password", _data.password);
          if (has_account) {
            await SecureStore.setItemAsync("user_id", String(_data.id));
            await SecureStore.setItemAsync("user_token", _data.token);
          } else {
            await SecureStore.setItemAsync("user_id", String(_data.id));
            await axios({
              baseURL: api_url,
              url: auth_token,
              method: "post",
              data,
            }).then(async (response) => {
              const _data = response.data;
              await SecureStore.setItemAsync("user_token", _data.token);
            });
          }
          dispatch({ type: "has_account" });
        })
        .catch((error) => {
          let mess = "";
          console.log(error);
          if (error.response) {
            const _data = error.response.data;
            for (const key in _data) {
              mess += _data[key].join(" ") + "\n";
            }
          } else {
            mess =
              "Nous ne parvenons pas ?? nous connecter au serveur.\n" +
              "Veuillez r??essayer plus tard ou contacter les admins";
          }
          this.setState(() => ({
            show_error: true,
            message_err: mess,
          }));
        });
    } else {
      this.setState(() => ({
        show_error: true,
        message_err: "Tous les champs sont obligatoires",
      }));
    }
    this.setState(() => ({ loading: false }));
  };

  render_activity_indicator = () => (
    <Portal>
      <Modal
        dismissable={false}
        visible={this.state.loading}
        onDismiss={() => this.setState({ loading: false })}
      >
        <ActivityIndicator
          size={"large"}
          hidesWhenStopped={true}
          animating={this.state.loading}
          color={this.props.constants.colors.maincolor}
        />
      </Modal>
    </Portal>
  );

  render() {
    const { constants } = this.props;
    const { colors } = constants;
    const {
      username,
      has_account,
      password,
      same_password,
      conf_password,
      message_err,
      show_error,
      loading,
    } = this.state;
    return (
      <Block color={colors.light} safe>
        <StatusBar
          backgroundColor={colors.light}
          barStyle={"dark-content"}
          style="auto"
        />
        {loading && this.render_activity_indicator()}
        <Block middle>
          {show_error && (
            <Text title center margin color={colors.danger}>
              {message_err}
            </Text>
          )}
          <TextInput
            placeholder={"choisissez un nom d'utlisateur"}
            style={styles.text_iput}
            value={username}
            autoCapitalize={"none"}
            onChangeText={this.on_username_change}
            autoCompleteType={"username"}
            keyboardType={"default"}
            autoFocus={true}
            dense={true}
            left={
              <TextInput.Icon
                name={"account"}
                color={colors.maincolor}
                size={icon_size}
              />
            }
          />

          <TextInput
            placeholder={"votre mot de passe"}
            style={styles.text_iput}
            value={password}
            secureTextEntry={true}
            autoCapitalize={"none"}
            onChangeText={this.on_password_change}
            autoCompleteType={"password"}
            keyboardType={"default"}
            dense={true}
            left={
              <TextInput.Icon
                name={"form-textbox-password"}
                color={colors.maincolor}
                size={icon_size}
              />
            }
          />

          {!has_account && (
            <View>
              <TextInput
                placeholder={"confirmer votre mot de passe"}
                style={styles.text_input}
                value={conf_password}
                autoCapitalize={"none"}
                secureTextEntry={true}
                onChangeText={this.on_conf_password_change}
                onBlur={this.on_pass_conf_blur}
                autoCompleteType={"password"}
                keyboardType={"default"}
                dense={true}
                left={
                  <TextInput.Icon
                    name={"form-textbox-password"}
                    color={colors.maincolor}
                    size={icon_size}
                  />
                }
              />
              <Text color={same_password ? "green" : "red"}>
                {same_password === true
                  ? "Mot de passe identique"
                  : same_password === false
                  ? "Mot de passe non identique"
                  : ""}
              </Text>
            </View>
          )}

          <View>
            <Button
              onPress={this.on_submit}
              compact={true}
              color={colors.primary}
            >
              {has_account ? "Se connecter" : "S'incrire"}
            </Button>
          </View>
          <View>
            <Button
              onPress={this.toggle_has_account}
              color={colors.maincolor}
              compact={true}
            >
              {has_account ? "Je suis nouveau !" : "J'ai d??j?? un compte !"}
            </Button>
          </View>
          {has_account && (
            <View>
              <Button onPress={() => {}} color={colors.dark} compact={true}>
                {"J'ai oubli?? mon mot de passe"}
              </Button>
            </View>
          )}
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  text_input: {
    padding: 5,
    margin: 5,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: Color("gray").lighten(0.8).hex(),
    borderBottomWidth: 0.3,
    borderBottomColor: "#000",
  },
});

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
  };
};

export default connect(mapStateToProps)(Login);
