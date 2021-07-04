import React, { useEffect, useState } from "react";
import "./userHome.scss";

import UserFeaturedInfo from "../../components/featuredInfo/UserFeaturedInfo";
import { userData, userData2, userData4 } from "../../dummyData";
import Chart from "../../components/chart/Chart";
import UserChart from "../../components/chart/UserChart";
import { loadActivityUserWeek } from "../../actions/activity";
import { useDispatch } from "react-redux";

const UserHome = () => {
  //hook
  // const dispatch = useDispatch();
  const [userData3, setUserData3] = useState([]);
  useEffect(() => {
    loadActivityUserWeek().then((a) => {
      setUserData3(a.data);
    });
  }, []);

  let userData3Chart = [
    {
      name: "Mon",
      Worked: 0,
    },
    {
      name: "Tue",
      Worked: 0,
    },
    {
      name: "Wed",
      Worked: 0,
    },
    {
      name: "Thu",
      Worked: 0,
    },
    {
      name: "Fri",
      Worked: 0,
    },
    {
      name: "Sat",
      Worked: 0,
    },
    {
      name: "Sun",
      Worked: 0,
    },
  ];
  //* chay duoc
  let userData3Filter = userData3.map((u) => {
    return {
      name: new Date(u.checkInTime).toDateString().split(" ")[0],
      Worked: u.workingTime,
    };
  });

  // console.log("useState userData3", userData3);
  // console.log(
  //   "🚀 ~ file: UserHome.js ~ line 51 ~ userData3Filter ~ userData3Filter",
  //   userData3Filter
  // );

  // userData3Chart = userData3Chart.map((u, index) => {
  //   console.log("u", u.name);
  //   console.log("userDataFilter", userData3Filter[index].name);
  // });

  // for (let i = 0; i < userData3Chart.length; i++) {
  //   for (let j = 0; j < userData3Filter.length; j++) {
  //     if (userData3Chart[i].name === userData3Filter[j].name) {
  //       userData3Chart[i].Worked === userData3Filter[j].Worked;
  //     } else {
  //       userData3Chart[i].Worked = 0;
  //     }
  //   }
  // }
  // console.log(
  //   "🚀 ~ file: UserHome.js ~ line 81 ~ UserHome ~ userData3Chart",
  //   userData3Chart
  // );
  // console.log(
  //   "🚀 ~ file: UserHome.js ~ line 84 ~ UserHome ~ userData3Filter",
  //   userData3Filter
  // );
  // console.log(
  //   "🚀 ~ file: UserHome.js ~ line 107 ~ UserHome ~ userData2",
  //   userData2
  // );

  for (let chart of userData3Chart) {
    for (let filter of userData3Filter) {
      if (chart.name === filter.name) {
        chart.Worked = parseFloat(filter.Worked);
        break;
      } else {
        chart.Worked = 0;
      }
    }
  }

  return (
    <div className="userHome">
      <UserFeaturedInfo />
      <UserChart
        data={userData3Chart}
        title="User Analytics"
        dataKey="Worked"
        // grid
      />
    </div>
  );
};

export default UserHome;
