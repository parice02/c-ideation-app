//const initial = [{ food: "", price: "", quantity: "", total_price: "" }];
const initial = [];

function training_visitors(state = initial, action) {
  switch (action.type) {
    case "add_training_visitor":
      return [...state, action.value] || state;
    case "DELETE_ALL_VISITES":
      return initial;
    default:
      return state;
  }
}

export default training_visitors;
