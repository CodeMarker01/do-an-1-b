import "./chart.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
} from "recharts";

export default function UserChart({ title, data, dataKey, grid }) {
  return (
    <div className="chart">
      <h3 className="chartTitle">{title}</h3>
      {/* aspect -> ti le width / height */}
      <ResponsiveContainer width="100%" aspect={4 / 1.3}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#5550bd" />
          <YAxis />
          <Bar dataKey={dataKey} fill="#5550bd" barSize={80}>
            <LabelList dataKey={dataKey} position="top" />
          </Bar>
          <Tooltip cursor={{ fill: "transparent" }} />
          {grid && <CartesianGrid stroke="#161515" strokeDasharray="5 5" />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
