import "./featuredInfo.scss";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useEffect, useState } from "react";
import {
  loadActivityUserMonth,
  loadActivityUserWeek,
} from "../../actions/activity";
import {
  getBeginningOfTheDay,
  getBeginningOfTheWeek,
  getEnddingOfTheWeek,
  getEndingOfTheDay,
  hourToHHMM,
} from "../../utils/formatDate";
import { useSelector } from "react-redux";

export default function UserFeaturedInfo() {
  const [userData, setUserData] = useState([]);
  const [userDataMonth, setUserDataMonth] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // loadActivityUserWeek().then((res) => {
    //   setUserData(res.data);
    // });
    loadActivityUserMonth().then((res) => {
      setUserDataMonth(res.data);
    });
  }, []);
  // console.log(
  //   "🚀 ~ file: UserFeaturedInfo.js ~ line 8 ~ UserFeaturedInfo ~ userData",
  //   userData
  // );
  console.log(
    "🚀 ~ file: UserFeaturedInfo.js ~ line 13 ~ UserFeaturedInfo ~ userData",
    userData
  );
  console.log(
    "🚀 ~ file: UserFeaturedInfo.js ~ line 17 ~ UserFeaturedInfo ~ userDataMonth",
    userDataMonth
  );
  console.log(
    "🚀 ~ file: UserFeaturedInfo.js ~ line 21 ~ UserFeaturedInfo ~ user",
    user
  );

  const beginDay = getBeginningOfTheDay();
  const endDay = getEndingOfTheDay();
  const beginWeek = getBeginningOfTheWeek(new Date());
  const endWeek = getEnddingOfTheWeek(new Date());

  // const total = userData
  //   // .map((item) => parseFloat(item.workingTime))
  //   .map((item) =>
  //     item.checkInTime && item.checkOutTime
  //       ? Math.abs(new Date(item.checkOutTime) - new Date(item.checkInTime)) /
  //         3600000
  //       : 0
  //   )
  //   .reduce((prev, next) => prev + next, 0);
  // console.log(
  //   "🚀 ~ file: UserFeaturedInfo.js ~ line 14 ~ UserFeaturedInfo ~ total",
  //   total
  // );
  const totalMonth = userDataMonth
    .map((item) =>
      item.checkInTime && item.checkOutTime
        ? Math.abs(new Date(item.checkOutTime) - new Date(item.checkInTime)) /
          3600000
        : 0
    )
    .reduce((prev, next) => prev + next, 0);

  const totalWeek = userDataMonth
    // .map((item) => parseFloat(item.workingTime))
    .map((item) =>
      item.checkInTime &&
      item.checkOutTime &&
      new Date(item.checkInTime) > beginWeek &&
      new Date(item.checkInTime) < endWeek &&
      new Date(item.checkOutTime) > beginWeek &&
      new Date(item.checkOutTime) < endWeek
        ? Math.abs(new Date(item.checkOutTime) - new Date(item.checkInTime)) /
          3600000
        : 0
    )
    .reduce((prev, next) => prev + next, 0);

  // let workedToday;

  // //
  // for (let data of userData) {
  //   let userDate = new Date(data.checkInTime);
  //   // console.log(
  //   //   "🚀 ~ file: UserFeaturedInfo.js ~ line 40 ~ UserFeaturedInfo ~ userDate",
  //   //   userDate
  //   // );
  //   if (userDate > beginDay && userDate < endDay) {
  //     // workedToday = data.workingTime;
  //     workedToday =
  //       data.checkInTime && data.checkOutTime
  //         ? Math.abs(new Date(data.checkOutTime) - new Date(data.checkInTime)) /
  //           3600000
  //         : 0;
  //     break;
  //     // } else workedToday = null;
  //   } else workedToday = 0;
  // }
  // console.log(workedToday);

  const totalDay = userDataMonth
    .map((item) =>
      item.checkInTime &&
      item.checkOutTime &&
      new Date(item.checkInTime) > beginDay &&
      new Date(item.checkInTime) < endDay &&
      new Date(item.checkOutTime) > beginDay &&
      new Date(item.checkOutTime) < endDay
        ? Math.abs(new Date(item.checkOutTime) - new Date(item.checkInTime)) /
          3600000
        : 0
    )
    .reduce((prev, next) => prev + next, 0);
  console.log("🚀 ~ file: UserFeaturedInfo.js ~ line 119 ~ totalDay", totalDay);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">WORKED TODAY</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{hourToHHMM(totalDay)}</span>
        </div>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">WORKED THIS WEEK</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{hourToHHMM(totalWeek)}</span>
        </div>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">WORKED THIS MONTH</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{hourToHHMM(totalMonth)}</span>
        </div>
      </div>
    </div>
  );
}
