import { formatDate } from "../../utils/formatDate";
import "./widgetLg.scss";

export default function WidgetLg({ newEmployees }) {
  //function
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">New Employees</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Name</th>
          <th className="widgetLgTh">Date</th>
          <th className="widgetLgTh">Position</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        {newEmployees &&
          newEmployees.map((employee) => (
            <tr className="widgetLgTr">
              <td className="widgetLgUser">
                <img src={employee.avatar} alt="" className="widgetLgImg" />
                <span className="widgetLgName">{employee.name}</span>
              </td>
              <td className="widgetLgDate">{formatDate(employee.createdAt)}</td>
              <td className="widgetLgAmount">{employee.position}</td>
              <td className="widgetLgStatus">
                <Button type="Approved" />
              </td>
            </tr>
          ))}
      </table>
    </div>
  );
}
