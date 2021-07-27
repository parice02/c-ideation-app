import React from "react";
import { View, StyleSheet } from "react-native";
import { Block, Text } from "expo-ui-kit";
import "moment/locale/fr";
import moment from "moment";

class MyCard extends React.Component {
  render() {
    const { item } = this.props;
    return (
      <View style={[styles.card]}>
        <View style={[styles.row]}>
          <Text
            size={20}
            transform={"capitalize"}
            style={[styles.text, styles.green]}
          >
            {item.first_name}
            {"\t\t"}
            {item.last_name}
          </Text>
          <Text transform={"capitalize"}>{item.card_num}</Text>
        </View>

        <View style={[styles.row]}>
          <Text transform={"capitalize"} style={[styles.number]}>
            {item.phone}
          </Text>
          <Text size={15}>Arrivé: {moment(item.arrived).format("LLL")}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    elevation: 5,
  },
  row: {
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  number: {
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#f5f5f5",
    backgroundColor: "#fff",
  },
  text: { margin: 2 },
  green: {
    color: "#075e54",
  },
});

export default MyCard;
