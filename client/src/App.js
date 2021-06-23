import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useLocation,
} from "react-router-dom";
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

const App = () => {
  // const location = useLocation();
  // let pathname = location.pathname;

  useEffect(() => {
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
            <div className={"container-udm"}>
              <Alert />
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
            </div>
            <div className="container admin-layout">
              {/* <Route exact path="/register" component={Register} /> */}
              {/* <Route exact path="/login" component={Login} /> */}
              <Route path="/dashboard">
                <Sidebar />
                <Home />
              </Route>
              <Route path="/users">
                <Sidebar />
                <UserList />
              </Route>
            </div>
          </>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
