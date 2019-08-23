let initialState = [];
if (localStorage.getItem("user") !== null) {
  initialState = JSON.parse(localStorage.getItem("user"));
}

export const userChange = (state = initialState, action) => {
  switch (action.type) {
    case "USER_CHANGE":
      state = action.user;
      break;
    default:
      break;
  }
  return state;
};
