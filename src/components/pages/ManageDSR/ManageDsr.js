import React, { useEffect, useState } from "react";

import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Breadcrumb, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Button } from "bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { FormModal } from "../../../data/Modal/Modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";

const ManageDsr = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;




  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);







const isStatusPermissionAvailable = permissionsArray?.includes("supplier-status-update");
const isEditPermissionAvailable = permissionsArray?.includes("supplier-edit");
const isAddPermissionAvailable = permissionsArray?.includes("supplier-create");
const isDeletePermissionAvailable = permissionsArray?.includes("supplier-delete");
const isDetailsPermissionAvailable = permissionsArray?.includes("supplier-details");
const isAssignPermissionAvailable = permissionsArray?.includes("supplier-assign");





  
  const [searchText, setSearchText] = useState("");
  const [searchvalue, setSearchvalue] = useState();

//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearchText(value);

//     const filteredData = searchvalue.filter((item) =>
//       item.supplier_name.toLowerCase().includes(value.toLowerCase())
//     );
//     setData(filteredData);
//   };

  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Manage Suppliers</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard" }}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Manage Suppliers
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <div className="input-group">
           
            {isAddPermissionAvailable ? (
            <Link
              to="/addSuppliers"
              className="btn btn-primary ms-2"
              style={{ borderRadius: "4px" }}
            >
              Add Suppliers
            </Link>
            ) : null}
          </div>
         
        </div>
      </div>

    </>
  );
};
export default withApi(ManageDsr);
