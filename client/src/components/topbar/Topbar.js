import React from "react";
import "./topbar.scss";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();
  const pathname = location.pathname;
  console.log("🚀 ~ file: Topbar.js ~ line 9 ~ Topbar ~ pathname", pathname);
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
        {pathname !== "/" && (
          <div className="topRight">
            <div className="topbarIconContainer">
              <NotificationsNone />
              <span className="topIconBadge">2</span>
            </div>
            <div className="topbarIconContainer">
              <Language />
              <span className="topIconBadge">2</span>
            </div>
            <div className="topbarIconContainer">
              <Settings />
            </div>
            <img
              src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
              className="topAvatar"
            />
          </div>
        )}
      </div>
    </div>
  );
}
