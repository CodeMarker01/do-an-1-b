import React from "react";
import "./home.scss";
import FeaturedInfo from "../components/featuredInfo/FeaturedInfo";
import Chart from "../components/chart/Chart";
import { userData } from "../dummyData";
import WidgetLg from "../components/widgetLg/WidgetLg";

const Home = () => {
  return (
    <div className="home">
      <FeaturedInfo />
      <Chart
        data={userData}
        title="User Analytics"
        grid
        dataKey="Active User"
      />
      <WidgetLg />
    </div>
  );
};

export default Home;
