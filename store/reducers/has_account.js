const initial = { value: true };

function first_launch(state = initial, action) {
  switch (action.type) {
    case "has_account":
      return (
        {
          ...state,
          value: true,
        } || state
      );
    case "has_not_account":
      return (
        {
          ...state,
          value: false,
        } || state
      );
    default:
      return initial;
  }
}

export default first_launch;
