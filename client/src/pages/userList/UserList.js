import "./userList.scss";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { userRows, userRow2 } from "../../dummyData";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDate, formatDateVi, formatTimeVi } from "../../utils/formatDate";
import { getUserWithActivity } from "../../utils/activity";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../utils/auth";
import { ACCOUNT_DELETED, DATA_TABLE_LOADED } from "../../actions/types";
import { setAlert } from "../../actions/alert";
import { LoadActivityUserData } from "../../actions/activity";
import { toast } from "react-toastify";

export default function UserList() {
  const [data, setData] = useState(userRows);
  // const [data2, setData2] = useState();
  const { tableData } = useSelector((state) => state.activity);

  const dispatch = useDispatch();

  const handleDelete = (name) => {
    // setData(data.filter((item) => item.id !== id));
    console.log("name-->", name); // let answer = window.confirm("Delete?");
    if (window.confirm("Are you sure to delete ?")) {
      // console.log("send delete request", slug);
      removeUser(name)
        .then((res) => {
          dispatch(LoadActivityUserData());
          // dispatch(setAlert("Your account has been permanently deleted"));
          // alert(`${res.data.title} is deleted`);
          toast.success(`${name} is deleted`);
        })
        .catch((err) => {
          if (err.response.status === 400) toast.error(err.response.data);
          console.log(err);
        });
    }
    // toast.success("cuoc song ma");
    // toast.success(`Successfully Deleted ${name}`);
  };

  // useEffect(() => {
  //   getUserWithActivity().then((u) => {
  //     setData2(u.data);
  //   });
  // }, []);

  //todo test handle click
  const handleClick = (e) => {
    // document.body.style.overflow = "hidden";
    // dispatch(loadDetail(id));
    console.log(e);
  };

  let tableDataMui = [];
  tableDataMui = tableData.map((obj, index) => {
    return (tableDataMui = {
      id: index,
      name: obj.userId.name,
      avatar: obj.userId.avatar,
      email: obj.userId.email,
      // date: obj.checkInTime,
      date: new Date(obj.date),
      dateFilter: formatDate(obj.date),
      checkInTime: obj.checkInTime,
      checkInTimeFilter: formatTimeVi(obj.checkInTime),
      checkOutTime: obj.checkOutTime,
      checkOutTimeFilter: formatTimeVi(obj.checkOutTime),
      // workingTime: obj.workingTime,
      workingTime:
        obj.checkInTime && obj.checkOutTime
          ? parseFloat(
              Math.abs(new Date(obj.checkOutTime) - new Date(obj.checkInTime)) /
                3600000
            ).toFixed(1)
          : 0,
      userId: obj.userId._id,
      activityId: obj._id,
    });
  });
  console.log(
    "🚀 ~ file: UserList.js ~ line 88 ~ tableDataMui=tableData.map ~ tableDataMui",
    tableDataMui
  );

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
      field: "dateFilter",
      headerName: "Date",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser">{formatDate(params.row.date)}</div>
        );
      },
    },
    {
      field: "checkInTimeFilter",
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
      field: "checkOutTimeFilter",
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
            {params.row.workingTime
              ? `${params.row.workingTime} hour(s)`
              : "--"}
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
            <Link
              to={`/user/activity?userId=${params.row.userId}&date=${params.row.date}`}
            >
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row.name)}
            />
          </>
        );
      },
    },
  ];

  //todo Toolbar
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

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
            field: "dateFilter",
            sort: "desc",
          },
        ]}
        // actions={[
        //   {
        //     icon: () => <button>Export</button>,
        //     onClick: () => alert("Cliked Export"),
        //   },
        // ]}
        components={{
          Toolbar: CustomToolbar,
        }}
        // onClick={handleClick}
      />
      {/* {JSON.stringify(tableData)} */}
    </div>
  );
}
