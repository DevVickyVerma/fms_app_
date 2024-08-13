import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomClient from "../../../Utils/CustomClient";
import CustomCompany from "../../../Utils/CustomCompany";
import CustomSite from "../../../Utils/CustomSite";
import useCustomDelete from "../../../Utils/useCustomDelete";

const ManageSiteTank = (props) => {
  const { isLoading, getData, postData } = props;
  const [data, setData] = useState();
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [submitSiteID, setsubmitSiteID] = useState();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [SiteId, setSiteId] = useState();
  const { customDelete } = useCustomDelete();




  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(postData, 'site-ppl/delete', formData, handleSuccess);
  };


  const handleSuccess = () => {
    const localPPLRate = JSON.parse(localStorage.getItem('localPPLRate'));
    if (localPPLRate) {
      handleSubmit1(localPPLRate)
    }
  };





  const handleSubmit1 = async (values) => {
    try {
      setsubmitSiteID(values?.site_id);
      const response = await getData(
        `/site-ppl/list?site_id=${values.site_id}`
      );

      if (response && response.data && response.data.data) {
        setData(response.data.data);
        const tank = {
          site_id: values?.site_id,
          client_id: values?.client_id,
          company_id: values?.company_id,
          sitename: response?.data?.data[0].site,
        };

        localStorage.setItem("SitePump", JSON.stringify(tank));
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };




  const UserPermissions = useSelector((state) => state?.data?.data?.permissions || []);
  const isEditPermissionAvailable = UserPermissions?.includes("ppl-edit");
  const isAddPermissionAvailable = UserPermissions?.includes("ppl-create");
  const isDeletePermissionAvailable = UserPermissions?.includes("ppl-delete");

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "6%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Site Name",
      selector: (row) => [row.site],
      sortable: false,
      width: "14.2%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.site}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Client  Name",
      selector: (row) => [row.client],
      sortable: false,
      width: "14.2%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.client}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Company Name",
      selector: (row) => [row.company],
      sortable: false,
      width: "14.2%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.company}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      width: "8.2%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Pence Per Liter",
      selector: (row) => [row.pence_per_liter],
      sortable: false,
      width: "14.2%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.pence_per_liter}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Sales Volume",
      selector: (row) => [row.sales_volume],
      sortable: false,
      width: "14.2%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.sales_volume}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "14.2%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/editppl/${row.id}`} // Assuming `row.id` contains the ID
                className="btn btn-primary btn-sm rounded-11 me-2"
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
                className="btn btn-danger btn-sm rounded-11"
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



  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",


    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
      site_id: Yup.string().required("Site is required"),
    }),

    onSubmit: (values) => {
      localStorage.setItem('localPPLRate', JSON.stringify(values));
      handleSubmit1(values);
    },
  });

  useEffect(() => {
    const localPPLRate = JSON.parse(localStorage.getItem('localPPLRate'));
    if (localPPLRate) {
      formik.setFieldValue('client_id', localPPLRate?.client_id);
      formik.setFieldValue('company_id', localPPLRate?.company_id);
      formik.setFieldValue('site_id', localPPLRate?.site_id);
      formik.setFieldValue('start_date', localPPLRate?.start_date);

      GetCompanyList(localPPLRate?.client_id);
      GetSiteList(localPPLRate?.company_id)
      handleSubmit1(localPPLRate);
    }
  }, []);

  const handleClearForm = async (resetForm) => {
    formik.setFieldValue("site_id", "")
    formik.setFieldValue("start_date", "")
    formik.setFieldValue("client_id", "")
    formik.setFieldValue("company_id", "")
    formik.setFieldValue("endDate", "")
    formik.setFieldValue("startDate", "")
    formik.resetForm()
    setSelectedCompanyList([]);
    setSelectedClientId("");
    setCompanyList([])
    setData(null)
    localStorage.removeItem("localPPLRate")
    const clientId = localStorage.getItem("superiorId");
    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData();
      formik.setFieldValue("client_id", "")
      setCompanyList([])
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId);
      formik.setFieldValue("client_id", clientId)
    }
  };

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

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData()
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId)
    }
  }, []);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Manage Site PPL Rate</h1>
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
                Site PPL Rate
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/addppl"
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Add Site PPL Rate
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>



                    <CustomClient
                      formik={formik}
                      lg={4}
                      md={6}
                      ClientList={ClientList}
                      setSelectedClientId={setSelectedClientId}
                      setSiteList={setSiteList}
                      setCompanyList={setCompanyList}
                      GetCompanyList={GetCompanyList}
                    />

                    <CustomCompany
                      formik={formik}
                      lg={4}
                      md={6}
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
                    />
                  </Row>
                  <Card.Footer className="text-end">
                    <button
                      className="btn btn-danger me-2"
                      type="button" // Set the type to "button" to prevent form submission
                      onClick={() => handleClearForm()} // Call a function to clear the form
                    >
                      Clear
                    </button>
                    <button className="btn btn-primary me-2" type="submit">
                      Submit
                    </button>
                  </Card.Footer>
                </form>

              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">
                  Site PPL Rate{" "}
                </h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <div className="table-responsive deleted-table">
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead
                        highlightOnHover

                      />
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={require("../../../assets/images/commonimages/no_data.png")}
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
    </>
  );
};
export default withApi(ManageSiteTank);
