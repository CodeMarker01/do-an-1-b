import React, { useEffect, useState } from "react";
import "./report.css";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@material-ui/data-grid";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { loadActivityUserAllTime } from "../../actions/activity";
import { formatDateVi, formatTimeVi } from "../../utils/formatDate";
import { useDispatch, useSelector } from "react-redux";
import {
  loadReportUserData,
  updateReportUserData,
} from "../../actions/rfidOpenDoor";
import { RFID_FINGERPRINT_APPROVED } from "../../actions/types";

const Report = () => {
  //state
  const [userTableData, setUserTableData] = useState([]);

  const { reportList } = useSelector((state) => state.rfidOpenDoor);
  const dispatch = useDispatch();
  //use effect
  // useEffect(() => {
  //   loadActivityUserAllTime().then((a) => {
  //     setUserTableData(a.data);
  //   });
  // }, []);

  useEffect(() => {
    dispatch(loadReportUserData());
  }, [dispatch]);

  console.log(
    "🚀 ~ file: Report.js ~ line 22 ~ Report ~ reportList",
    reportList
  );

  const handleDelete = () => {};
  const handleApprove = (id) => {
    console.log("id", id);
    const objIndex = reportList.findIndex((obj) => obj._id === id);

    reportList[objIndex].status = "approved";
    console.log("reportList2", reportList);

    dispatch(updateReportUserData({ reportList, objIndex }));
  };

  const tableDataMui = reportList?.map((u, index) => {
    return {
      _id: u._id,
      id: index,
      name: u.userId.name,
      email: u.userId.email,
      date: formatDateVi(u.date),
      message: u.message,
      checkIn: u.checkInTime ? formatTimeVi(u.checkInTime) : "--",
      checkOut: u.checkOutTime ? formatTimeVi(u.checkOutTime) : "--",
    };
  });
  console.log(
    "🚀 ~ file: UserTimeTable.js ~ line 30 ~ tableDataMui ~ tableDataMui",
    tableDataMui
  );

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
    },
    {
      field: "checkIn",
      headerName: "Check In",
      width: 150,
    },
    {
      field: "checkOut",
      headerName: "Check Out",
      width: 150,
    },
    {
      field: "message",
      headerName: "Message",
      width: 200,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <CheckCircleIcon
              className="userListApprove"
              onClick={() => handleApprove(params.row._id)}
            />
            <RemoveCircleIcon
              className="userListDelete"
              onClick={handleDelete}
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

export default Report;
