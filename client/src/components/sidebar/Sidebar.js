import "./sidebar.scss";
import {
  LineStyle,
  Timeline,
  TrendingUp,
  PermIdentity,
  Storefront,
  AttachMoney,
  BarChart,
  MailOutline,
  DynamicFeed,
  ChatBubbleOutline,
  WorkOutline,
  Report,
} from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
  //redux auth
  const { user } = useSelector((state) => state.auth);
  const { reportList } = useSelector((state) => state.rfidOpenDoor);
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  console.log(
    "🚀 ~ file: Sidebar.js ~ line 25 ~ Sidebar ~ splitLocation",
    splitLocation
  );
  let directToPage;
  if (user?.role === "admin") {
    directToPage = "/dashboard";
  } else if (user?.role === "subscriber") {
    directToPage = "/dashboardUser";
  } else {
    directToPage = "/";
  }
  console.log(
    "🚀 ~ file: Sidebar.js ~ line 32 ~ Sidebar ~ reportList",
    reportList
  );
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to={directToPage} className="link">
              <li
                className={`sidebarListItem ${
                  splitLocation[1] === "dashboard" ||
                  splitLocation[1] === "dashboardUser"
                    ? "active"
                    : ""
                }`}
              >
                <LineStyle className="sidebarIcon" />
                Home
              </li>
            </Link>

            {user.role === "subscriber" && (
              <Link to="/time-table" className="link">
                <li
                  className={`sidebarListItem ${
                    splitLocation[1] === "time-table" ? "active" : ""
                  }`}
                >
                  <PermIdentity className="sidebarIcon" />
                  Time Table
                </li>
              </Link>
            )}

            {user.role === "admin" && (
              <Link to="/users" className="link">
                <li
                  className={`sidebarListItem ${
                    splitLocation[1] === "users" ? "active" : ""
                  }`}
                >
                  <PermIdentity className="sidebarIcon" />
                  Users
                </li>
              </Link>
            )}
            {user.role === "admin" && (
              <Link to="/report" className="link">
                <li
                  className={`sidebarListItem reportContainer ${
                    splitLocation[1] === "report" ? "active" : ""
                  }`}
                >
                  <Report className="sidebarIcon" />
                  Report
                  {reportList && reportList.length > 0 && (
                    <span className="reportBadge">{reportList.length}</span>
                  )}
                </li>
              </Link>
            )}
            {/* <li className="sidebarListItem">
              <Timeline className="sidebarIcon" />
              Analytics
            </li>
            <li className="sidebarListItem">
              <TrendingUp className="sidebarIcon" />
              Sales
            </li> */}
          </ul>
        </div>
        {/* <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li className="sidebarListItem">
                <PermIdentity className="sidebarIcon" />
                Users
              </li>
            </Link>
            <Link to="/products" className="link">
              <li className="sidebarListItem">
                <Storefront className="sidebarIcon" />
                Products
              </li>
            </Link>
            <li className="sidebarListItem">
              <AttachMoney className="sidebarIcon" />
              Transactions
            </li>
            <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
              Reports
            </li>
          </ul>
        </div> */}
        {/* <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <MailOutline className="sidebarIcon" />
              Mail
            </li>
            <li className="sidebarListItem">
              <DynamicFeed className="sidebarIcon" />
              Feedback
            </li>
            <li className="sidebarListItem">
              <ChatBubbleOutline className="sidebarIcon" />
              Messages
            </li>
          </ul>
        </div> */}
        {/* <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <WorkOutline className="sidebarIcon" />
              Manage
            </li>
            <li className="sidebarListItem">
              <Timeline className="sidebarIcon" />
              Analytics
            </li>
            <li className="sidebarListItem">
              <Report className="sidebarIcon" />
              Reports
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
