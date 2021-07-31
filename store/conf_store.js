import { createStore } from "redux";
import { persistCombineReducers } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import constants from "./reducers/constants";
import visitor_list from "./reducers/visitor_list";
import training_list from "./reducers/training_list";
import training_visitors from "./reducers/training_visitors";
import has_account from "./reducers/has_account";

const persist_config = {
  key: "root",
  storage: AsyncStorage,
};

export default createStore(
  persistCombineReducers(persist_config, {
    constants,
    visitor_list,
    training_list,
    training_visitors,
    has_account,
  })
);
