import { useEffect, useState } from 'react';
import withApi from "../../../Utils/ApiHelper";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { handleError } from "../../../Utils/ToastUtils";



const UploadCompetitor = (props) => {
  const { getData, isLoading, postData } = props;
  const [selectedClientId, setSelectedClientId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [data, setData] = useState();
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const isImportPermissionAvailable =
    permissionsArray?.includes("nominalcode-import");

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",

      image: null,
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
    }),

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const handleSubmit = async (values) => {
    try {
      const response = await getData(
        `/sage/nominal-code/list?client_id=${selectedClientId}&company_id=${values.company_id}`
      );

      const { data } = response;
      if (data) {
        setData(data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
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

          if (response?.data) {
            const selectedClient = response?.data?.data?.find(
              (client) => client.id === clientId
            );
            if (selectedClient) {
            }
          }
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData();
    } else {
      formik.setFieldValue("client_id", clientId);
      setSelectedClientId(clientId);
      GetCompanyList(clientId);
    }
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("image", file);
    formik.setFieldTouched("image", true);
    formik.setFieldError("image", "");
  };

  const handleDrop = (event) => {
    event.preventDefault();
  };
  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "8%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Code",
      selector: (row) => [row?.code],
      sortable: false,
      width: "23%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.code}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => [row.name],
      sortable: false,
      width: "23%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created By",
      selector: (row) => [row.created_by],
      sortable: false,
      width: "23%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_by}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      width: "23%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
  ];


  const isButtonDisabled = formik?.values?.client_id && formik?.values?.company_id;
  const isShowButtonDisabled =
    formik.values.client_id &&
    formik.values.company_id &&
    formik.values.image !== null &&
    formik.values.image;
  const ShowLogs = async (values) => {
    try {
      const response = await getData(
        `/sage/nominal-code/list?client_id=${selectedClientId}&company_id=${values?.company_id}`
      );

      const { data } = response;
      if (data) {
        setData(data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const Onupload = async () => {
    try {
      const formData = new FormData();

      formData.append("company_id", formik.values.company_id);
      formData.append("codes", formik.values.image);
      formData.append("client_id", selectedClientId);
      const postDataUrl = "/sage/nominal-code/import";

      const postResponse = await postData(postDataUrl, formData);
      if (postResponse?.status_code == 200) {
        ShowLogs(formik.values);
      }
    } catch (error) {
      handleError(error);
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
  const openURL = () => {
    const url = `${process.env.REACT_APP_SAMPLE_FILE_BASE_URL}/sample-files/NominalCodesSampleData.xlsx`;
    window.open(url, "_blank");
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Nominal Activity Codes</h1>
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
                Nominal Activity Codes
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* here I will start Body of competitor */}
        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header className="d-flex justify-content-space-between">
                <h3 className="card-title">Nominal Activity Codes</h3>
                <>
                  <Link className="btn btn-danger me-2" onClick={openURL}>
                    Download Sample{" "}
                    <i className="fa fa-download" aria-hidden="true" />
                  </Link>
                </>
              </Card.Header>
              {/* here my body will start */}
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    {localStorage.getItem("superiorRole") !== "Client" && (
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="client_id"
                            className="form-label mt-4"
                          >
                            Client
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.client_id &&
                              formik.touched.client_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="client_id"
                            name="client_id"
                            value={formik.values.client_id}
                            onChange={(e) => {
                              const selectedType = e.target.value;


                              if (selectedType) {
                                GetCompanyList(selectedType);
                                formik.setFieldValue("client_id", selectedType);
                                setSelectedClientId(selectedType);

                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("site_id", "");
                              } else {
                                formik.setFieldValue("client_id", "");
                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("site_id", "");


                                setCompanyList([]);
                              }
                            }}
                          >
                            <option value="">Select a Client</option>
                            {ClientList.data && ClientList.data.length > 0 ? (
                              ClientList.data.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.client_name}
                                </option>
                              ))
                            ) : (
                              <option disabled={true}>No Client</option>
                            )}
                          </select>

                          {formik.errors.client_id &&
                            formik.touched.client_id && (
                              <div className="invalid-feedback">
                                {formik.errors.client_id}
                              </div>
                            )}
                        </div>
                      </Col>
                    )}
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label htmlFor="company_id" className="form-label mt-4">
                          Company
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`input101 ${formik.errors.company_id &&
                            formik.touched.company_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="company_id"
                          name="company_id"
                          value={formik.values.company_id}
                          onChange={(e) => {
                            const selectcompany = e.target.value;

                            if (selectcompany) {
                              formik.setFieldValue("site_id", "");
                              formik.setFieldValue("company_id", selectcompany);
                            } else {
                              formik.setFieldValue("company_id", "");
                              formik.setFieldValue("site_id", "");


                            }
                          }}
                        >
                          <option value="">Select a Company</option>
                          {selectedClientId && CompanyList.length > 0 ? (
                            <>
                              setSelectedCompanyId([])
                              {CompanyList.map((company) => (
                                <option key={company.id} value={company.id}>
                                  {company.company_name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <option disabled={true}>No Company</option>
                          )}
                        </select>
                        {formik.errors.company_id &&
                          formik.touched.company_id && (
                            <div className="invalid-feedback">
                              {formik.errors.company_id}
                            </div>
                          )}
                      </div>
                    </Col>
                    {isImportPermissionAvailable ? (
                      <Col lg={4} md={4}>
                        <div className="form-group">
                          <label htmlFor="image" className="form-label mt-4">
                            File
                          </label>
                          <div
                            className={`dropzone ${formik.errors.image && formik.touched.image
                              ? "is-invalid"
                              : ""
                              }`}
                            onDrop={(event) => handleDrop(event)}
                            onDragOver={(event) => event.preventDefault()}
                          >
                            <input
                              type="file"
                              id="image"
                              name="image"
                              accept=".xlsx, .xls"
                              onChange={(event) => handleImageChange(event)}
                              className="form-control"
                            />
                          </div>
                          {formik.errors.image && formik.touched.image && (
                            <div className="invalid-feedback">
                              {formik.errors.image}
                            </div>
                          )}
                        </div>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>
                  <div className="text-end">
                    <button
                      type="button" // Change the type to "button" to prevent form submission
                      className="btn btn-danger me-2"
                      disabled={!isButtonDisabled}
                      onClick={() => {
                        handleSubmit(formik.values); // Call handleSubmit when the button is clicked
                      }}
                    >
                      Show Logs
                    </button>

                    {isImportPermissionAvailable ? (
                      <button
                        type="button" // Change the type to "button" to prevent form submission
                        className="btn btn-primary me-2"
                        disabled={!isShowButtonDisabled}
                        onClick={() => {
                          Onupload();
                        }}
                      >
                        Submit
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            {data?.length > 0 ? (
              <>
                <div className="table-responsive deleted-table">
                  <DataTable
                    columns={columns}
                    data={data}
                    noHeader={true}
                    defaultSortField="id"
                    defaultSortAsc={false}
                    striped={true}
                    persistTableHead={true}
                    highlightOnHover={true}
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
      </>
    </>
  );
};

export default withApi(UploadCompetitor);
