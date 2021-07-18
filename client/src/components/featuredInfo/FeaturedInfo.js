import "./featuredInfo.scss";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useEffect, useState } from "react";
import {
  loadActivityAdminDay,
  loadActivityAdminMonth,
  loadActivityAdminWeek,
} from "../../actions/activity";
import {
  getBeginningOfTheDay,
  getBeginningOfTheWeek,
  getEnddingOfTheWeek,
  getEndingOfTheDay,
  hourToHHMM,
} from "../../utils/formatDate";

export default function FeaturedInfo() {
  // state
  const [allUserWeekData, setAllUserWeekData] = useState([]);
  const [allUserMonthData, setAllUserMonthData] = useState([]);
  // const [allUserWeekData, setAllUserWeekData] = useState([]);

  // useEffect
  useEffect(() => {
    // loadActivityAdminWeek().then((res) => {
    //   setAllUserWeekData(res.data);
    // });
    loadActivityAdminMonth().then((res) => {
      setAllUserMonthData(res.data);
    });
  }, []);
  // console.log(
  //   "🚀 ~ file: FeaturedInfo.js ~ line 9 ~ FeaturedInfo ~ allUserWeekData",
  //   allUserWeekData
  // );
  console.log(
    "🚀 ~ file: FeaturedInfo.js ~ line 11 ~ FeaturedInfo ~ allUserMonthData",
    allUserMonthData
  );
  // const totalWeek = allUserWeekData
  //   // .map((item) => parseFloat(item.workingTime))
  //   .map((item) =>
  //     item.checkInTime && item.checkOutTime
  //       ? Math.abs(new Date(item.checkOutTime) - new Date(item.checkInTime)) /
  //         3600000
  //       : 0
  //   )
  //   .reduce((prev, next) => prev + next, 0);
  // console.log(
  //   "🚀 ~ file: FeaturedInfo.js ~ line 21 ~ FeaturedInfo ~ totalWeek",
  //   totalWeek
  // );

  //todo day, week, month v2
  const beginWeek = getBeginningOfTheWeek(new Date());
  const endWeek = getEnddingOfTheWeek(new Date());
  const beginDay = getBeginningOfTheDay(new Date());
  const endDay = getEndingOfTheDay(new Date());
  const totalMonth = allUserMonthData
    // .map((item) => parseFloat(item.workingTime))
    .map((item) =>
      item.checkInTime && item.checkOutTime
        ? Math.abs(new Date(item.checkOutTime) - new Date(item.checkInTime)) /
          3600000
        : 0
    )
    .reduce((prev, next) => prev + next, 0);

  const totalWeek = allUserMonthData
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
  const totalDay = allUserMonthData
    // .map((item) => parseFloat(item.workingTime))
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

  //todo end day,week, month v2

  //function

  //return
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
