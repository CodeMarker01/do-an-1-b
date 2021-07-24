import React from "react";
import "./topbar.scss";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/auth";
import { LOGOUT } from "../../actions/types";

export default function Topbar() {
  // useHook
  const location = useLocation();
  const pathname = location.pathname;
  console.log("🚀 ~ file: Topbar.js ~ line 9 ~ Topbar ~ pathname", pathname);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log(
    "🚀 ~ file: Topbar.js ~ line 32 ~ Topbar ~ isAuthenticated",
    isAuthenticated
  );
  console.log("🚀 ~ file: Topbar.js ~ line 33 ~ Topbar ~ user", user);

  //dispatch
  const dispatch = useDispatch();
  const history = useHistory();

  //function
  const btnLogOut = () => {
    // console.log("btnLogOut");
    // console.log(logout());
    dispatch(logout());
    // dispatch({
    //   type: LOGOUT,
    // });
    history.push("/");
  };

  // render
  return (
    <div
      className={`topbar ${pathname === "/" ? "colorBgForLandingPage" : ""}`}
    >
      <div className="topbarWrapper">
        <div className="topLeft">
          <Link
            to="/"
            className={`logo ${
              pathname === "/" ? "colorLogoForLandingPage" : ""
            }`}
          >
            QuangSinh Inc.
          </Link>
        </div>
        {isAuthenticated && (
          <div className="topRight">
            <div
              className={`topbarIconContainer ${
                pathname === "/" ? "colorLogoForLandingPage" : ""
              }`}
            >
              <NotificationsNone />
              <span className="topIconBadge">2</span>
            </div>
            <div
              className={`topbarIconContainer ${
                pathname === "/" ? "colorLogoForLandingPage" : ""
              }`}
            >
              <Language />
              <span className="topIconBadge">2</span>
            </div>
            <div
              className={`topbarIconContainer ${
                pathname === "/" ? "colorLogoForLandingPage" : ""
              }`}
            >
              <Settings />
            </div>
            <div className="topbarUserContainer">
              <img src={user?.avatar} alt="" className="topAvatar" />
              <div className="topbarUserDropdown">
                <button
                  className={`dropbtn ${
                    pathname === "/" ? "colorLogoForLandingPage" : ""
                  }`}
                >
                  Hi <span>{user?.name}</span>
                </button>
                <div className="dropdown-content">
                  {/* <Link to="/user/account">Account Setting</Link> */}
                  <a href="#" onClick={btnLogOut}>
                    Log Out
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
