import React, { useEffect, useState } from "react";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Dropdown,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomCompany from "../../../Utils/CustomCompany";
import CustomClient from "../../../Utils/CustomClient";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import CardGroupCenterModal from "./CardGroupCenterModal";
import CustomSite from "../../../Utils/CustomSite";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { handleError } from "../../../Utils/ToastUtils";
import Swal from "sweetalert2";
const CardGroup = ({ isLoading, getData,postData,apidata }) => {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [data, setData] = useState();
  const [permissionsArray, setPermissionsArray] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hideStarIcon, sethideStarIcon] = useState(true);
  const [showAddButton, setShowAddButton] = useState(false);
  const [detailApiData, setDetailApiData] = useState();
  const UserPermissions = useSelector((state) => state?.data?.data);

  const [SiteId, setSiteId] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
    }),

    onSubmit: (values) => {
      handleSubmit1(values);
    },
  });

  const handleSubmit1 = async (values) => {
    try {
      const response = await getData(
        `/sage/card-group/list?company_id=${values.company_id}&site_id=${values.site_id}`
      );
      setData(response?.data?.data?.cardGroups);
      setShowAddButton(true);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData();
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId);
    }
  }, []);

  const fetchCommonListData = async () => {
    try {
      const response = await getData("/common/client-list");

      const { data } = response;
      if (data) {
        setClientList(response.data);

        const clientId = localStorage.getItem("superiorId");
        if (clientId) {
          setSelectedClientId(clientId);
          setSelectedCompanyList([]);

          if (response?.data) {
            const selectedClient = response?.data?.data?.find(
              (client) => client.id === clientId
            );
            if (selectedClient) {
              setSelectedCompanyList(selectedClient?.companies);
            }
          }
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const GetCompanyList = async (values) => {
    try {
      if (values) {
        const response = await getData(
          `common/company-list?client_id=${values}`
        );

        if (response) {
          setCompanyList(response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const GetSiteList = async (values) => {
    try {
      if (values) {
        const response = await getData(`common/site-list?company_id=${values}`);

        if (response) {
          setSiteList(response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const toggleActive = (row) => {
    navigate(`${row.id}`);
  };

  const fetchUpdateCardDetail = async (rowId) => {
    try {
      const response = await getData(`/sage/card-group/detail/${rowId}`);

      const { data } = response;
      if (data) {
        setDetailApiData(data?.data ? data.data : []);
        setShowModal(true);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  // "cardgroup-delete",
  // "cardgroup-list",
  // "cardgroup-update",
  // "cardgroupHead-delete",
  // "chargehead-delete",
  // "chargehead-list",
  // "chargehead-update",


  const isEditPermissionAvailable =
  permissionsArray?.includes("cardgroup-update");
const isAddPermissionAvailable =
  permissionsArray?.includes("cardgroup-update");
  const isDeletePermissionAvailable = permissionsArray?.includes("cardgroup-delete");
  const anyPermissionAvailable =
    isEditPermissionAvailable ||
    isDeletePermissionAvailable;
    const handleDelete = (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this item!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const formData = new FormData();
          formData.append("id", id);
          DeleteClient(formData);
        }
      });
    };
    const DeleteClient = async (formData) => {
      try {
        const response = await postData("sage/card-group/delete", formData);
        // Console log the response
        if (apidata.api_response === "success") {
          console.log(formik.values, "formik.values");
          handleSubmit1(formik.values);
        }
      } catch (error) {
        handleError(error);
      }
    };


  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "10%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Card Group",
      selector: (row) => [row.name],
      sortable: true,
      width: "30%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block ">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Cards",
      selector: (row) => [row.name],
      sortable: true,
      width: "30%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6
              className="mb-0 fs-14 fw-semibold "
              style={{ cursor: "pointer" }}
              onClick={() => fetchUpdateCardDetail(row.id)}
            >
              <AiOutlineEye size={24} />
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: true,
      width: "30%",
      cell: (row) => (
        <span className="text-center d-flex justify-content-center gap-1 flex-wrap">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link  
                to={`/card-group/${row.id}`}
                className="btn btn-primary btn-sm rounded-11 me-2 responsive-btn"
              >
                <i>
                  <svg
                    className="table-edit"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" />
                  </svg>
                </i>
              </Link>
            </OverlayTrigger>
          ) : null}
          {isDeletePermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link
                to="#"
                className="btn btn-danger btn-sm rounded-11 responsive-btn"
                onClick={() => handleDelete(row.id)}
              >
                <i>
                  <svg
                    className="table-delete"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                  </svg>
                </i>
              </Link>
            </OverlayTrigger>
          ) : null}
    
        </span>
      ),
    },
 
  ];

  const tableDatas = {
    columns,
    data,
  };

  localStorage.setItem("cardsCompanyId", selectedCompanyId);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div className="page-header ">
        <div>
          <h1 className="page-title">Card Group</h1>
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
              Card Group
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <CardGroupCenterModal
        showModal={showModal}
        setShowModal={setShowModal}
        detailApiData={detailApiData}
      />

      <>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <form onSubmit={formik.handleSubmit}>
                <Card.Header>
                  <h3 className="card-title">Card Group</h3>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <CustomClient
                      formik={formik}
                      lg={4}
                      md={4}
                      ClientList={ClientList}
                      setSelectedClientId={setSelectedClientId}
                      setSiteList={setSiteList}
                      setCompanyList={setCompanyList}
                      GetCompanyList={GetCompanyList}
                    />

                    <CustomCompany
                      formik={formik}
                      lg={4}
                      md={4}
                      CompanyList={CompanyList}
                      setSelectedCompanyId={setSelectedCompanyId}
                      setSiteList={setSiteList}
                      selectedClientId={selectedClientId}
                      GetSiteList={GetSiteList}
                    />

                    <CustomSite
                      formik={formik}
                      lg={4}
                      md={6}
                      SiteList={SiteList}
                      setSelectedSiteId={setSelectedSiteId}
                      CompanyList={CompanyList}
                      setSiteId={setSiteId}
                      hideStarIcon={hideStarIcon}
                    />
                  </Row>
                </Card.Body>

                <Card.Footer className="text-end">
                  <Link
                    type="submit"
                    className="btn btn-danger me-2 "
                    to={`/dashboard`}
                  >
                    Cancel
                  </Link>
                  <button className="btn btn-primary m-2 " type="submit">
                    Submit
                  </button>
                </Card.Footer>
              </form>
            </Card>
          </Col>
        </Row>
      </>

      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Card Group</h3>

              <div className="ms-auto pageheader-btn  d-flex align-items-center">
                <div className="input-group">
                  {isAddPermissionAvailable && showAddButton ? (
                    <Link
                      to={`/add-group`}
                      className="btn btn-primary ms-2"
                      style={{ borderRadius: "4px" }}
                    >
                      Add Cards
                    </Link>
                  ) : null}
                </div>
              </div>
            </Card.Header>

            <Card.Body>
              {data?.length > 0 ? (
                <>
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
                        paginationPerPage={20}
                        highlightOnHover
                        searchable={true}
                      />
                    </DataTableExtensions>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default withApi(CardGroup);
