import React, { useEffect, useState } from "react";
import "./home.scss";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import Chart from "../../components/chart/Chart";
import { userData } from "../../dummyData";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { loadActivityAdminWeek } from "../../actions/activity";
import { loadNewUserWeek } from "../../actions/auth";
import { useDispatch } from "react-redux";
import { loadReportUserData } from "../../actions/rfidOpenDoor";

const Home = () => {
  //state
  const [allUserWeekData, setAllUserMonthData] = useState([]);
  const [newEmployees, setNewEmployees] = useState([]);

  //useeffect
  useEffect(() => {
    loadActivityAdminWeek().then((a) => {
      setAllUserMonthData(a.data);
    });
    loadNewUserWeek().then((res) => {
      setNewEmployees(res.data);
    });
  }, []);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadReportUserData());
  }, [dispatch]);
  console.log(
    "🚀 ~ file: Home.js ~ line 14 ~ Home ~ newEmployees",
    newEmployees
  );

  let userDataChart = [
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

  let userDataFilter = allUserWeekData.map((u) => {
    return {
      name: new Date(u.checkInTime).toDateString().split(" ")[0],
      // Worked: u.workingTime,
      Worked:
        u.checkOutTime && u.checkInTime
          ? Math.abs(new Date(u.checkOutTime) - new Date(u.checkInTime)) /
            3600000
          : 0,
    };
  });

  for (let chart of userDataChart) {
    for (let filter of userDataFilter) {
      if (chart.name === filter.name) {
        chart.Worked = parseFloat(filter.Worked).toFixed(1);
        break;
      } else {
        chart.Worked = 0;
      }
    }
  }

  //return
  return (
    <div className="home">
      <FeaturedInfo />
      {/* <Chart
        data={userDataChart}
        title="User Analytics"
        grid
        dataKey="Active User"
      /> */}
      <WidgetLg newEmployees={newEmployees} />
    </div>
  );
};

export default Home;
