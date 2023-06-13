import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Button } from "bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SideSearchbar from "../../../data/Modal/SideSearchbar";
import * as loderdata from "../../../data/Component/loderdata/loderdata";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";

const FuelSales = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [searchdata, setSearchdata] = useState({});
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [activeArray, setActiveArray] = useState([]);
  const [SearchList, setSearchList] = useState(false);





  const SuccessAlert = (message) => toast.success(message);

  const Errornotify = (message) => toast.error(message);
  const token = localStorage.getItem("token");

  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      Errornotify(errorMessage);
    }
  }

  const handleSubmit = (formData) => {
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => value !== null && value !== ""
      )
    );

    if (Object.values(filteredFormData).length > 0) {
      setSearchdata(filteredFormData);
      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });



      
     

     
    }

 
  };

//   useEffect(() => {
//     handleFetchData();
//   }, []);



//   const handleFetchData = async () => {
//     try {
//       const response = await getData("/fuel-sale/list?drs_date=2023-06-12&site_id=Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09/");

      

//       if (response && response.data && response.data.data) {
//         setData(response.data.data);
//        console.log(response.data.data)

//       } else {
//         throw new Error("No data available in the response");
//       }
//     } catch (error) {
//       console.error("API error:", error);
//     }
//   };

useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = async () => {
    try {
      const response = await getData("/fuel-sale/list?drs_date=2023-06-12&site_id=Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09");

      console.log(response)

      if (response && response.data && response.data.data) {
        setData(response.data.data);
      
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };




  const permissionsToCheck = [
    "client-list",
    "client-create",
    "client-status-update",
    "client-edit",
    "client-delete",
  ];

  let isPermissionAvailable = false;
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);





  const isStatusPermissionAvailable = permissionsArray?.includes(
    "client-status-update"
  );
  const isEditPermissionAvailable = permissionsArray?.includes("client-edit");
  const isAddPermissionAvailable = permissionsArray?.includes("client-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("client-delete");
  const isDetailsPermissionAvailable =
    permissionsArray?.includes("client-details");
  const isAssignPermissionAvailable =
    permissionsArray?.includes("client-assign");

  const columns = [
    {
      name: "#",
      selector: "index",
      sortable: true,
    },
    {
      name: "Column 1",
      selector: "column1",
      sortable: true,
    },
    {
      name: "Column 2",
      selector: "column2",
      sortable: true,
    },
    {
      name: "Column 3",
      selector: "column3",
      sortable: true,
    },
    {
      name: "Column 4",
      selector: "column4",
      sortable: true,
    },
  ];

  const tableDatas = {
    columns,
    data,
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <SideSearchbar
          title="Search"
          visible={sidebarVisible1}
         
          onSubmit={handleSubmit}
          searchListstatus={SearchList}
        />

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Manage Client</h3>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive deleted-table">
                  <DataTableExtensions {...tableDatas}>
                    <DataTable
                      columns={columns}
                      data={data}
                      noHeader
                      defaultSortField="id"
                      defaultSortAsc={false}
                      striped={true}
                      // center={true}
                      persistTableHead
                      pagination
                      highlightOnHover
                      searchable={false}
                    />
                  </DataTableExtensions>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default withApi(FuelSales);
