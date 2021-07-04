import "./featuredInfo.scss";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { loadActivityUserWeek } from "../../actions/activity";
import {
  getBeginningOfTheDay,
  getEndingOfTheDay,
  hourToHHMM,
} from "../../utils/formatDate";

export default function UserFeaturedInfo() {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    loadActivityUserWeek().then((res) => {
      setUserData(res.data);
    });
  }, []);
  console.log(
    "🚀 ~ file: UserFeaturedInfo.js ~ line 8 ~ UserFeaturedInfo ~ userData",
    userData
  );

  const total = userData
    .map((item) => parseFloat(item.workingTime))
    .reduce((prev, next) => prev + next, 0);
  console.log(
    "🚀 ~ file: UserFeaturedInfo.js ~ line 14 ~ UserFeaturedInfo ~ total",
    total
  );

  const beginDate = getBeginningOfTheDay();
  console.log(
    "🚀 ~ file: UserFeaturedInfo.js ~ line 32 ~ UserFeaturedInfo ~ beginDate",
    beginDate
  );
  const endDate = getEndingOfTheDay();
  console.log(
    "🚀 ~ file: UserFeaturedInfo.js ~ line 34 ~ UserFeaturedInfo ~ endDate",
    endDate
  );
  let workedToday;

  //
  for (let data of userData) {
    let userDate = new Date(data.checkInTime);
    console.log(
      "🚀 ~ file: UserFeaturedInfo.js ~ line 40 ~ UserFeaturedInfo ~ userDate",
      userDate
    );
    if (userDate > beginDate && userDate < endDate) {
      workedToday = data.workingTime;
      break;
    } else workedToday = null;
  }
  console.log(workedToday);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">WORK THIS WEEK</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{hourToHHMM(total)}</span>
          <span className="featuredMoneyRate">
            -11.4 <ArrowDownward className="featuredIcon negative" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">WORKED TODAY</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{hourToHHMM(workedToday)}</span>
          <span className="featuredMoneyRate">
            -1.4 <ArrowDownward className="featuredIcon negative" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Cost</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$2,225</span>
          <span className="featuredMoneyRate">
            +2.4 <ArrowUpward className="featuredIcon" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}
