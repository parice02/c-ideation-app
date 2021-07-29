//const initial = [{ intitulé: "", formateur: "", heure: "", total_price: "" }];
const initial = [];

function visitor_list(state = initial, action) {
  switch (action.type) {
    case "add_training":
      return [...state, action.value] || state;
    case "delete_training":
      return { orders: [] };
    case "delete_all_training":
      return { orders: [] };
    default:
      return state;
  }
}

export default visitor_list;
