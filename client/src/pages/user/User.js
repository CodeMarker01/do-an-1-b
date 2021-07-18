import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import Spinner from "../../components/layout/Spinner";
import { getCurrentUser, updateUser } from "../../utils/auth";
import { formatDate, formatTimeVi } from "../../utils/formatDate";
import "./user.css";
//toast
import { toast } from "react-toastify";
import { removeActivity } from "../../utils/activity";
import { LoadActivityUserData } from "../../actions/activity";

export default function User() {
  const { user } = useSelector((state) => state.auth);
  const [currentUser, setCurrentUser] = useState();
  const [adminDateChange, setAdminDateChange] = useState("");
  const [loading, setLoading] = useState(true);
  console.log("🚀 ~ file: User.js ~ line 22 ~ User ~ loading", loading);
  //   const [dateAdmin, setDateAdmin] = useState();
  const history = useHistory();
  //   console.log("🚀 ~ file: User.js ~ line 20 ~ User ~ history", history);

  //   const { userId } = useParams();
  const urlSearchParams = new URLSearchParams(useLocation().search);
  //   console.log("userID params", userId);
  //   const params = Object.fromEntries(urlSearchParams.entries());
  const { userId, date } = Object.fromEntries(urlSearchParams.entries());
  //   console.log("params", params);
  console.log("params", userId, date);

  const dispatch = useDispatch();

  //todo test callback
  const loadActivity = useCallback(() => {
    setTimeout(() => {
      getCurrentUser(userId, date).then((res) => {
        console.log("res.data", res.data);
        setCurrentUser(res.data);
        setAdminDateChange(new Date(res.data.date).toLocaleDateString("sv-SE"));
        setLoading(false);
      });
    }, 1000);
  }, [date, userId]);
  //todo end test callba

  useEffect(() => {
    //     console.log("run useEffect in User.js");
    //     setLoading(true);
    //     getCurrentUser(userId, date).then((res) => {
    //       console.log("res.data", res.data);
    //       setCurrentUser(res.data);
    //       //       if (currentUser && currentUser.userId) {
    //       if (res.data) {
    //         setLoading(false);
    //         console.log(res.data);
    //       }
    //       //       setLoading(false);
    //       console.log("set loading in useEffect become false");
    //       //       }
    //     });
    loadActivity();
  }, [date, userId, loadActivity, adminDateChange]);
  console.log("currentUser", currentUser);
  console.log(
    "AdminDateChange",
    adminDateChange
    //     new Date(adminDateChange).toISOString()
  );

  //function
  const handleChange = (e) => {
    //     console.log("e.target.name", e.target.name);
    const [section, key] = e.target.name.split(".");
    console.log(`section ${section} -  key ${key}`);
    setLoading(true);

    // section is : company
    // key is : position

    //     check if date
    //     if (section === "date") {
    //       urlSearchParams.set("date", e.target.value);
    //       history.push({
    //         pathname: '/user/activity"',
    //         search: `?userId=60e82f44a82de463207e8219&date=${e.target.value}`,
    //         //     search:`?userId=60e82f44a82de463207e8219&date=2021-07-11T01:25:46.000Z`
    //         // search: "?" + new URLSearchParams({clientId: clientId}).toString()
    //       });
    //     }

    if (key) {
      console.log("run if key");
      setCurrentUser({
        ...currentUser,
        [section]: {
          ...currentUser[section],
          [key]: e.target.value,
        },
      });
      console.log(key, " key----- ", e.target.value);
    } else {
      console.log("not run if key, run section");
      // if you're updating on the first level
      if (section === "date") {
        setCurrentUser({
          ...currentUser,
          date: new Date(e.target.value).toISOString(),
          //   date: e.target.value,
        });
        // urlSearchParams.set("date", new Date(e.target.value));
        urlSearchParams.set("date", e.target.value);
        history.push({
          pathname: "/user/activity",
          search: `?userId=${currentUser.userId._id}&date=${e.target.value}`,
          //     search:`?userId=60e82f44a82de463207e8219&date=2021-07-11T01:25:46.000Z`
          // search: "?" + new URLSearchParams({clientId: clientId}).toString()
        });
      } else if (section === "checkInTime" || section === "checkOutTime") {
        setCurrentUser({
          ...currentUser,
          [section]: `${adminDateChange.split("T")[0]}T${e.target.value}`,
          //${currentUser.date.split("T")[0]}T${e.target.value}
        });
      } else {
        setCurrentUser({
          ...currentUser,
          [section]: e.target.value,
        });
      }

      console.log(section, " section----- ", e.target.value);
    }
    setLoading(false);

    //     setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e) => {
    console.log("change checkIntTime value", e.target.value);
    //     setAdminDateChange(new Date(e.target.value).toISOString());
    setAdminDateChange(new Date(e.target.value).toLocaleDateString("sv-SE"));
    //     {JSON.stringify(new Date(adminDateChange).toLocaleDateString("sv-SE"))}

    urlSearchParams.set("date", e.target.value);
    history.push({
      pathname: "/user/activity",
      search: `?userId=${currentUser.userId._id}&date=${e.target.value}`,
      //     search:`?userId=60e82f44a82de463207e8219&date=2021-07-11T01:25:46.000Z`
      // search: "?" + new URLSearchParams({clientId: clientId}).toString()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    setLoading(true);
    updateUser(currentUser.userId._id, currentUser)
      .then((res) => {
        setLoading(false);
        console.log("update OK");
        toast.success(`${currentUser.userId.name} is updated successfully!`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.response.data.err);
      });
    //     toast.success("update thanh cong");
  };

  //todo delete this current date
  const handleDeleteDate = (e) => {
    e.preventDefault();
    console.log(e);
    console.log(currentUser._id);
    setLoading(true);
    removeActivity(currentUser._id)
      .then((res) => {
        console.log("delete Ok");
        // loadActivity();
        urlSearchParams.set("date", "cuoc song");
        console.log("adminDateChange in removeActivity", adminDateChange);
        //     urlSearchParams.set("date", adminDateChange);
      })
      .catch((err) => {
        console.log("err", err);
      });
    //         // dispatch(LoadActivityUserData());
    //         // setAdminDateChange(
    //         //   new Date(e.target.value).toLocaleDateString("sv-SE")
    //         // );
    //         //     {JSON.stringify(new Date(adminDateChange).toLocaleDateString("sv-SE"))}

    //         // console.log("e-->", e.target);
    //         // handleDateChange(e);
    //         setLoading(false);
    //         toast.success(`${adminDateChange} is deleted`);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         setLoading(false);
    //         toast.error(err.response.data.err);
    //       });
    //     urlSearchParams.set("date", adminDateChange);
    //     history.push({
    //       pathname: "/user/activity",
    //       search: `?userId=${currentUser.userId._id}&date=${adminDateChange}`,
    //       //     search:`?userId=60e82f44a82de463207e8219&date=2021-07-11T01:25:46.000Z`
    //       // search: "?" + new URLSearchParams({clientId: clientId}).toString()
    //     });
  };

  return loading /*Object.getOwnPropertySymbols(currentUser).length > 0*/ ? (
    <Spinner />
  ) : (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={currentUser.userId?.avatar}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">
                {currentUser.userId?.name}
              </span>
              <span className="userShowUserTitle">
                {currentUser.userId?.position
                  ? currentUser.userId?.position
                  : "Software Engineer"}
              </span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">
                {currentUser.userId?.name}
              </span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              <span className="userShowInfoTitle">10.12.1999</span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle">+1 123 456 67</span>
            </div>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">
                {currentUser.userId?.email}
              </span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowInfoTitle">SPKT | TPHCM</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm" onSubmit={handleSubmit}>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Position</label>
                <input
                  type="text"
                  placeholder="annabeck99"
                  className="userUpdateInput"
                  name="userId.position"
                  value={currentUser.userId?.position}
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Salary</label>
                <input
                  type="text"
                  placeholder="Anna Becker"
                  className="userUpdateInput"
                  name="userId.salary"
                  value={currentUser.userId?.salary}
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Date</label>
                <div className="userDateItemContainer">
                  <input
                    //   type="text"
                    type="date"
                    placeholder="annabeck99@gmail.com"
                    className="userUpdateInput"
                    name="date"
                    //   value={
                    //     currentUser?.checkInTime ? currentUser?.checkInTime : "--"
                    //   }
                    //   value={new Date()}
                    //   value={currentUser?.checkInTime}
                    // yyyy-mm-dd
                    //   value="2013-01-08"
                    //   value={
                    //     currentUser.date
                    //       ? new Date(currentUser.date).toLocaleDateString("sv-SE")
                    //       : ""
                    //   }
                    // YYYY-MM-DD
                    value={
                      adminDateChange
                        ? new Date(adminDateChange).toLocaleDateString("sv-SE")
                        : ""
                    }
                    onChange={handleDateChange}
                  />
                  <div className="buttonDateDelete">
                    <button onClick={handleDeleteDate}>Delete</button>
                  </div>
                </div>
              </div>
              <div className="userUpdateItem">
                <label>Check In</label>
                <input
                  type="time"
                  placeholder="+1 123 456 67"
                  className="userUpdateInput"
                  //   value={currentUser?.checkOutTime}
                  name="checkInTime"
                  value={
                    currentUser.checkInTime
                      ? formatTimeVi(currentUser.checkInTime)
                      : ""
                  }
                  onChange={handleChange}
                  //   onChange={(e) => {
                  //     console.log(e.target.value);
                  //     //     console.log(new Date(e.target.value));
                  //     console.log(
                  //       `${currentUser.date.split("T")[0]}T${e.target.value}`
                  //     );
                  //   }}
                />
                {/* {new Date(currentUser?.checkInTime).toLocaleTimeString()} */}
              </div>
              <div className="userUpdateItem">
                <label>Check Out</label>
                <input
                  type="time"
                  placeholder="+1 123 456 67"
                  className="userUpdateInput"
                  //   value={currentUser?.checkOutTime}
                  name="checkOutTime"
                  //   value="17:19"
                  value={
                    currentUser.checkOutTime
                      ? formatTimeVi(currentUser.checkOutTime)
                      : ""
                  }
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Worked</label>
                <input
                  type="text"
                  placeholder="New York | USA"
                  className="userUpdateInput"
                  value={
                    currentUser.checkInTime && currentUser.checkOutTime
                      ? (
                          Math.abs(
                            new Date(currentUser.checkOutTime) -
                              new Date(currentUser.checkInTime)
                          ) / 3600000
                        ).toFixed(1)
                      : 0
                  }
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src={currentUser.userId?.avatar}
                  alt=""
                />
                <label htmlFor="file">
                  <Publish className="userUpdateIcon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>
              <button className="userUpdateButton">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// import React from "react";
// import "./user.css";

// const User = () => {
//   return <div>this is user page</div>;
// };

// export default User;
