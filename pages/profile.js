import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { Block } from "expo-ui-kit";
import axios from "axios";

import { MaterialCommunityIcons, Fontisto } from "react-native-vector-icons";


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.data = this.props.route.params.data;
    this.results = this.data.success ? this.data.results.data : null;
    this.state = {
      pers_info: this.results.id
        ? this.get_data({ path: "patients", id: this.results.id })
        : null,
      contact: this.results.contact
        ? this.get_data({ path: "contact", id: this.results.contact })
        : null,
      allergies:
        this.results.allergy.length !== 0
          ? this.get_data({ path: "allergies", id: this.results.allergy })
          : [],
      user: this.results.user
        ? this.get_data({ path: "pers_info", id: this.results.user })
        : null,
    };
  }

  get_data = async (data) =>
    await axios({
      method: "get",
      url: `${data.path}/${data.id}`,
      baseURL: "https://backendss2.herokuapp.com/hs/api/",
      data: null,
      //auth: { username: "parice02", password: "password123" },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Basic cGFyaWNlMDI6cGFzc3dvcmQxMjM=",
      },
      responseType: "json",
    })
      .then((value) => {
        switch (data.path) {
          case "pers_info":
            this.setState({ user: value.data });
            break;
          case "patients":
            this.setState({ pers_info: value.data });
            break;
          case "contact":
            this.setState({ contact: value.data });
            break;
          case "allergies":
            this.setState({ allergies: value.data });
            break;

          default:
            break;
        }
      })
      .catch((reason) => {
        Alert.alert("Error", reason.message);
      });

  render() {
    //const { route, navigation } = this.props;
    const { allergies, contact, pers_info, user } = this.state;
    return (
      <Block white safe>
        {this.data !== undefined && this.data.success ? (
          <Block scroll>
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <Avatar.Image
                  source={{
                    uri: pers_info
                      ? pers_info.photo
                      : require("../assets/user.png"),
                  }}
                  size={100}
                  style={{ backgroundColor: "white", resizeMode: "contain" }}
                />
                <View style={{ marginLeft: 20 }}>
                  <Title
                    style={[
                      styles.title,
                      {
                        marginTop: 15,
                        marginBottom: 5,
                      },
                    ]}
                  >
                    {user ? user.first_name : "John"}{" "}
                    {user ? user.last_name : "Doe"}
                  </Title>
                  <Caption style={styles.caption}>
                    @{user ? user.username : "john_doe"}
                  </Caption>
                </View>
              </View>
            </View>

            <View style={styles.userInfoSection}>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  color="#777777"
                  size={20}
                />
                <Text style={{ color: "#777777", marginLeft: 20 }}>
                  {contact ? contact.city : ""},{" "}
                  {contact ? contact.country : ""}
                </Text>
              </View>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="phone"
                  color="#777777"
                  size={20}
                />
                <Text style={{ color: "#777777", marginLeft: 20 }}>
                  {contact ? contact.phone_number : ""},
                  {contact ? contact.phone_number2 : ""}
                </Text>
              </View>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="email"
                  color="#777777"
                  size={20}
                />
                <Text style={{ color: "#777777", marginLeft: 20 }}>
                  {user ? user.email : ""}
                </Text>
              </View>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="calendar"
                  color="#777777"
                  size={20}
                />
                <Text style={{ color: "#777777", marginLeft: 20 }}>
                  {pers_info ? pers_info.birthdate : ""},{" "}
                  {pers_info ? pers_info.birth_place : ""}
                </Text>
              </View>
            </View>

            {/* <View style={styles.infoBoxWrapper}>
              <View
                style={[
                  styles.infoBox,
                  {
                    borderRightColor: "#dddddd",
                    borderRightWidth: 1,
                  },
                ]}
              >
                <Title>₹140.50</Title>
                <Caption>Wallet</Caption>
              </View>
              <View style={styles.infoBox}>
                <Title>12</Title>
                <Caption>Orders</Caption>
              </View>
            </View> */}

            <View style={styles.menuWrapper}>
              <TouchableRipple onPress={() => {}}>
                <View style={styles.menuItem}>
                  <Fontisto name="blood-drop" color="red" size={25} />
                  <Text style={styles.menuItemText}>
                    {pers_info ? pers_info.blood_group : "unkown"}
                  </Text>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => {}}>
                <View style={styles.menuItem}>
                  <Fontisto name="heartbeat-alt" color="lightblue" size={25} />
                  {allergies.length !== 0 &&
                    allergies.map((i, v) => (
                      <Text key={i} style={styles.menuItemText}>
                        {v}
                      </Text>
                    ))}
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => {}}>
                <View style={styles.menuItem}>
                  <MaterialCommunityIcons
                    name="share-outline"
                    color="lightblue"
                    size={25}
                  />
                  <Text style={styles.menuItemText}>Tell Your Friends</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => {}}>
                <View style={styles.menuItem}>
                  <MaterialCommunityIcons
                    name="account-check-outline"
                    color="lightblue"
                    size={25}
                  />
                  <Text style={styles.menuItemText}>Support</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => {}}>
                <View style={styles.menuItem}>
                  <MaterialCommunityIcons
                    name="settings-outline"
                    color="lightblue"
                    size={25}
                  />
                  <Text style={styles.menuItemText}>Settings</Text>
                </View>
              </TouchableRipple>
            </View>
          </Block>
        ) : (
          <Block center middle>
            <Title>Non data</Title>
          </Block>
        )}
      </Block>
    );
  }
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});
