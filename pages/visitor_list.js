import React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Block, Text } from "expo-ui-kit";
import { connect } from "react-redux";
import { Divider } from "react-native-paper";
import moment from "moment";
import "moment/locale/fr";

import Card from "../components/card";

class Other extends React.Component {
  state = { loading: false };

  render_visitor_list = ({ item }) => (
    <TouchableOpacity>
      <Card item={item} />
    </TouchableOpacity>
  );

  render_footer_header = () => <Block margin />;

  on_refreshing = () => {};

  render_separator = () => <Divider />;

  render_empty_list = () => (
    <Text middle center h2>
      Aucune visiteur enregistré
    </Text>
  );

  render() {
    const { visitor_list, constants } = this.props;
    const { loading } = this.state;
    const { colors } = constants;
    let _today = moment().unix();

    return (
      <Block white>
        <StatusBar
          backgroundColor={colors.maincolor}
          barStyle={"light-content"}
          style="auto"
        />
        <Block>
          <FlatList
            data={visitor_list.filter((value) =>
              moment(_today).isSame(value.arrived_at, "day")
            )}
            renderItem={this.render_visitor_list}
            ListEmptyComponent={this.render_empty_list}
            ItemSeparatorComponent={this.render_separator}
            ListFooterComponent={this.render_footer_header}
            ListHeaderComponent={this.render_footer_header}
            keyExtractor={(_, index) => `${index}`}
            onRefresh={this.on_refreshing}
            refreshing={loading}
            progressViewOffset={10}
            legacyImplementation={true}
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
    visitor_list: state.visitor_list,
  };
};

export default connect(mapStateToProps)(Other);
