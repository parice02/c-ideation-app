import React from "react";
import { Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Button } from "expo-ui-kit";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import { connect } from "react-redux";
import { moderateScale } from "react-native-size-matters";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as MailComposer from "expo-mail-composer";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import "moment/locale/fr";
import xlsx from "xlsx";

import VisitorList from "../pages/visitor_list";

const Stack = createStackNavigator();
const icon_size = moderateScale(20);

const get_media_permission = async () => {
  const { granted } = await MediaLibrary.requestPermissionsAsync();
  return granted;
};

const send_by_mail = (file) => {
  NetInfo.fetch().then(async ({ isConnected, isInternetReachable }) => {
    if (isConnected && isInternetReachable) {
      const available = await MailComposer.isAvailableAsync();
      if (available) {
        const result = await MailComposer.composeAsync({
          recipients: ["djenesidibe93@gmail.com"],
          ccRecipients: ["parice02@hotmail.com"],
          subject: "Liste de présence aux camps d'idéation 2021",
          body: "Recevez en pièce joint la liste de présence au camp d'idéation 2021.\n Cordialement",
          isHtml: false,
          attachments: [file],
        });
      } else {
        Alert.alert("Info", "Impossible d'utiliser l'application mail.");
      }
    } else {
      Alert.alert(
        "Info",
        "Vous n'êtes pas connecté à Internet. Veuillez vous connectez et recommencer."
      );
    }
  });
};

const save_file = async (file) => {
  const directory = await MediaLibrary.getAlbumAsync(
    "Ideation Camp/Sauvegardes"
  );
  const asset = await MediaLibrary.createAssetAsync(file);
  if (directory) {
    await MediaLibrary.addAssetsToAlbumAsync(asset, directory, false);
  } else {
    await MediaLibrary.createAlbumAsync(
      "Ideation Camp/Sauvegardes",
      asset,
      false
    );
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
      const { visitor_list, training_visitors } = this.props;
      if (visitor_list.length !== 0 || training_visitors.length !== 0) {
        const xlsx_book = xlsx.utils.book_new();

        if (visitor_list.length !== 0) {
          const xlsx_data_sheet_1 = xlsx.utils.json_to_sheet(visitor_list);
          xlsx.utils.book_append_sheet(
            xlsx_book,
            xlsx_data_sheet_1,
            "Présence au camp"
          );
        }

        if (training_visitors.length !== 0) {
          const xlsx_data_sheet_2 = xlsx.utils.json_to_sheet(training_visitors);
          xlsx.utils.book_append_sheet(
            xlsx_book,
            xlsx_data_sheet_2,
            `Presence aux formations`
          );
        }

        const written_book = xlsx.write(xlsx_book, {
          type: "base64",
          bookType: "xlsx",
          cellDates: true,
          cellStyles: true,
        });
        const _date = moment().format("LLL");
        const uri =
          FileSystem.documentDirectory + `Liste de presence  du ${_date}.xlsx`;

        FileSystem.writeAsStringAsync(uri, written_book, {
          encoding: FileSystem.EncodingType.Base64,
        });

        //await save_file(uri);
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert("Message", "Sauvegarde réussit");
        //send_by_mail(uri);
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
    training_visitors: state.training_visitors,
  };
};

export default connect(mapStateToProps)(MyStack);
