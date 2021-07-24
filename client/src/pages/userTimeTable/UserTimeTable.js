import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { loadActivityUserAllTime } from "../../actions/activity";
import { formatDateVi, formatTimeVi } from "../../utils/formatDate";
import "./userTimeTable.css";

const UserTimeTable = () => {
  //state
  const [userTableData, setUserTableData] = useState([]);
  //use effect
  useEffect(() => {
    loadActivityUserAllTime().then((a) => {
      setUserTableData(a.data);
    });
  }, []);
  console.log(
    "🚀 ~ file: UserTimeTable.js ~ line 11 ~ UserTimeTable ~ userTableData",
    userTableData
  );

  const tableDataMui = userTableData.map((u, index) => {
    return {
      id: index,
      //       name: u.userId.name,
      //       email: u.userId.email,
      date: u.checkInTime ? formatDateVi(u.checkInTime) : "--",
      dateOri: u.checkInTime ? new Date(u.checkInTime) : "--",
      checkIn:
        !u.checkInTime ||
        (new Date(u.checkInTime).getHours() === 0 &&
          new Date(u.checkInTime).getMinutes() === 0 &&
          new Date(u.checkInTime).getSeconds() === 0)
          ? "--"
          : formatTimeVi(u.checkInTime),
      checkOut: u.checkOutTime ? formatTimeVi(u.checkOutTime) : "--",
      worked:
        u.checkInTime && u.checkOutTime
          ? parseFloat(
              Math.abs(new Date(u.checkOutTime) - new Date(u.checkInTime)) /
                3600000
            ).toFixed(1)
          : 0,
    };
  });
  console.log(
    "🚀 ~ file: UserTimeTable.js ~ line 30 ~ tableDataMui ~ tableDataMui",
    tableDataMui
  );

  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 200,
      renderCell: (params) => {
        return <div className="userListUser">{params.row.date}</div>;
      },
    },
    {
      field: "checkIn",
      headerName: "Check In",
      width: 200,
    },
    {
      field: "checkOut",
      headerName: "Check Out",
      width: 200,
    },
    {
      field: "worked",
      headerName: "Worked",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row.worked ? `${params.row.worked} hour(s)` : "--"}
          </div>
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
  //render
  return (
    <div className="userTimeTable">
      <DataGrid
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
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
};

export default UserTimeTable;
