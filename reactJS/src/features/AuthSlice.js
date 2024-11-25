const initialState = {
  isAuth: JSON.parse(window.localStorage.getItem("userData")) ? true : false,
  token: JSON.parse(window.localStorage.getItem("userData"))?.token,
};

export function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case "user/login":
      return {
        ...state,
        isAuth: true,
        token: action.payload.token,
      };
    case "user/logout":
      return {
        ...state,
        isAuth: false,
        token: undefined,
      };
    default:
      return state;
  }
}

export function login(data) {
  const data1 = { ...data.data.user, token: data.token };
  window.localStorage.setItem("userData", JSON.stringify(data1));
  return { type: "user/login", payload: data1 };
}

export function logout() {
  window.localStorage.removeItem("userData");
  return { type: "user/logout" };
}
