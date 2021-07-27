import { createStore } from "redux";
import { persistCombineReducers } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import constants from "./reducers/constants";
import visitor_list from "./reducers/visitor_list";

const persist_config = {
  key: "root",
  storage: AsyncStorage,
};

export default createStore(
  persistCombineReducers(persist_config, {
    constants,
    visitor_list,
  })
);
