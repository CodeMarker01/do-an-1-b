import "./userList.scss";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { userRows, userRow2 } from "../../dummyData";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDate, formatDateVi, formatTimeVi } from "../../utils/formatDate";
import { getUserWithActivity } from "../../utils/activity";
import { useSelector } from "react-redux";

export default function UserList() {
  const [data, setData] = useState(userRows);
  // const [data2, setData2] = useState();
  const { tableData } = useSelector((state) => state.activity);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  // useEffect(() => {
  //   getUserWithActivity().then((u) => {
  //     setData2(u.data);
  //   });
  // }, []);

  let tableDataMui = [];
  tableDataMui = tableData.map((obj, index) => {
    return (tableDataMui = {
      id: index,
      name: obj.userId.name,
      avatar: obj.userId.avatar,
      email: obj.userId.email,
      date: obj.date,
      checkInTime: obj.checkInTime,
      checkOutTime: obj.checkOutTime,
      workingTime: obj.workingTime,
    });
  });

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.avatar} alt="" />
            {params.row.name}
          </div>
        );
      },
      // valueGetter: (params) => console.log(params.getValue(params.row.date)),
      // sortComparator: (v1, v2, param1, param2) =>
      //   // param1.getCellValue(param1.row.userId.name, "name") -
      //   // param2.getCellValue(param2.row.userId.name, "name"),
      //   console.log(
      //     "param1",
      //     param1.api.getCellValue(param1.id, "email"),
      //     "param2"
      //     // param2.getValue(param2.id)
      //   ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      type: "string",
      renderCell: (params) => {
        return <div className="userListUser">{params.row.email}</div>;
      },
      // sortComparator: (e) => console.log(e),
    },
    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser">{formatDate(params.row.date)}</div>
        );
      },
    },
    {
      field: "checkIn",
      headerName: "Check In",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row.checkInTime
              ? formatTimeVi(params.row.checkInTime)
              : "--"}
          </div>
        );
      },
    },
    {
      field: "checkOut",
      headerName: "Check Out",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row.checkOutTime
              ? `${formatTimeVi(params.row.checkOutTime)}`
              : "--"}
          </div>
        );
      },
    },
    {
      field: "workingTime",
      headerName: "Worked",
      width: 160,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row.workingTime ? `${params.row.workingTime} hour` : "--"}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row.id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <DataGrid
        // ban dau : rows={usersRow} import tu dummyData
        // getRowId={(row) => row._id}
        // rows={tableData}
        rows={tableDataMui}
        disableSelectionOnClick
        columns={columns}
        pageSize={10}
        checkboxSelection
        sortModel={[
          {
            field: "date",
            sort: "desc",
          },
        ]}
      />
      {/* {JSON.stringify(tableData)} */}
    </div>
  );
}
