import React from "react";
import Login from "./components/login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./css/bootstrap.css";
import "antd/dist/antd.css";
import "./css/main.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/Home" render={() => <Home />} />
        <Route exact={true} path="/Login" render={() => <Login />} />
        <Route exact={true} path="/Register" render={() => <Register />} />
      </Switch>
    </Router>
  );
}

export default App;
