import React from "react";
import { Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Button } from "expo-ui-kit";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import { connect } from "react-redux";
import { moderateScale } from "react-native-size-matters";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import moment from "moment";
import xlsx from "xlsx";

import VisitorList from "../pages/visitor_list";

const Stack = createStackNavigator();
const icon_size = moderateScale(20);

const get_media_permission = async () => {
  const { granted } = await MediaLibrary.requestPermissionsAsync();

  return granted;
};

const save_file = async (file) => {
  console.log("getting album");
  const directory = await MediaLibrary.getAlbumAsync(
    "Ideation Camp/Sauvegardes"
  );
  console.log("get album ok");
  console.log("creating asset");
  console.log(file);
  const asset = await MediaLibrary.createAssetAsync(file);
  console.log("asset created");
  if (directory) {
    console.log("adding asset to album");
    await MediaLibrary.addAssetsToAlbumAsync(asset, directory, false);
    console.log("asset added to album");
  } else {
    console.log("creating album and adding asset");
    await MediaLibrary.createAlbumAsync(
      "Ideation Camp/Sauvegardes",
      asset,
      false
    );
    console.log("album created and asset added in it");
  }
};

class MyStack extends React.Component {
  state = {
    loading: false,
  };

  request_save = () => {
    Alert.alert("Confirmation", "Voulez-vous sauvegarder ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Exporter", onPress: this.export_data, style: "default" },
    ]);
  };

  export_data = async () => {
    if (await get_media_permission()) {
      this.setState({ loading: true });
      const { visitor_list } = this.props;
      if (visitor_list.length !== 0) {
        const xlsx_data_sheet = xlsx.utils.json_to_sheet(visitor_list);
        const xlsx_book = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(
          xlsx_book,
          xlsx_data_sheet,
          "Liste_de_presence"
        );

        const written_book = xlsx.write(xlsx_book, {
          type: "base64",
          bookType: "xlsx",
          cellDates: true,
          cellStyles: true,
        });

        const uri = FileSystem.cacheDirectory + `Liste_de_presence.xlsx`;
        console.log("Saving");
        await save_file(uri);
        console.log("Saved");
      }
    }
    this.setState({
      loading: false,
    });
  };

  render() {
    const { constants } = this.props;
    const { colors } = constants;

    return (
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "#fff",
            elevation: 10,
            backgroundColor: colors.maincolor,
          },
          headerLeft: () => (
            <Button
              padding
              margin
              transparent
              onPress={() =>
                route.name === "home_stack"
                  ? navigation.toggleDrawer()
                  : navigation.goBack()
              }
            >
              <Ionicons
                name={route.name === "visitor_list" ? "menu" : "arrow-back"}
                size={icon_size}
                color={"white"}
              />
            </Button>
          ),
          headerRight: () => (
            <Button padding margin transparent onPress={this.request_save}>
              <MaterialCommunityIcons
                name={"file-excel"}
                size={icon_size}
                color={"white"}
              />
            </Button>
          ),
        })}
      >
        <Stack.Screen
          name="visitor_list"
          component={VisitorList}
          options={{ title: "Listes des visiteurs" }}
        />
      </Stack.Navigator>
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

export default connect(mapStateToProps)(MyStack);
