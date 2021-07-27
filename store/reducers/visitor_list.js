//const initial = [{ food: "", price: "", quantity: "", total_price: "" }];
const initial = [];

function visitor_list(state = initial, action) {
  switch (action.type) {
    case "add_visitor":
      return [...state, action.value] || state;
    case "DELETE_ALL_VISITES":
      return { orders: [] };
    default:
      return state;
  }
}

export default visitor_list;
