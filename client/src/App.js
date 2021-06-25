import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home";
import UserList from "./pages/userList/UserList";
import Landing from "./pages/landing/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { useEffect } from "react";
//css
import "./styles/globalStyle.css";
import Alert from "./components/layout/Alert";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";
import store from "./store";
import History from "./pages/history";
//route
import UserRoute from "./components/routes/UserRoute";
import AdminRoute from "./components/routes/AdminRoute";

const App = () => {
  useEffect(() => {
    //
    console.log("run useEffect in app.js");
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());
  }, []);
  return (
    <div class="app">
      <Router>
        <Topbar />
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <>
            <div className="container-udm">
              <Alert />
              <Switch>
                <Route exact path="/login">
                  <Login />
                </Route>
                <Route exact path="/register">
                  <Register />
                </Route>
                <Route exact path="/history">
                  <History />
                </Route>
              </Switch>
            </div>
            {/* <div className="container-udm"></div> */}
            <div className="container admin-layout">
              <Switch>
                {/* <Route exact path="/register" component={Register} /> */}
                {/* <Route exact path="/login" component={Login} /> */}
                <UserRoute exact path="/dashboard">
                  <Sidebar />
                  <Home />
                </UserRoute>
                {/* <UserRoute exact path="/dashboard">
                <Sidebar />
                <Home />
              </UserRoute> */}
                <UserRoute exact path="/users">
                  <Sidebar />
                  <UserList />
                </UserRoute>
              </Switch>
            </div>
          </>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
