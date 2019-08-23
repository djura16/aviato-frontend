import React from "react";
import Login from "./components/login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Index from "./components/Index/Index";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./css/bootstrap.css";
import "antd/dist/antd.css";
import "./css/main.css";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { userChange } from "./reducers/userReducer";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "ADD":
//       state += action.payload;
//       break;
//     case "SUBTRACT":
//       state -= action.payload;
//       break;
//     default:
//       break;
//   }
//   return state;
// };
const store = createStore(userChange);

// store.dispatch({
//   type: "ADD",
//   payload: 20
// });

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/Home" render={() => <Home />} />
          <Route exact={true} path="/Login" render={() => <Login />} />
          <Route exact={true} path="/Register" render={() => <Register />} />
          <Route exact={true} path="/" render={() => <Index />} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
