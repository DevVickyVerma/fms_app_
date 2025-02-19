import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import useCustomDelete from "../../../Utils/useCustomDelete";

const CashBanking = (props) => {
  const {
    apidata,
    isLoading,
    getData,
    postData,
    SiteID,
    ReportDate,
    sendDataToParent,
    company_id,
    client_id,
    site_id,
    start_date,
  } = props;
  const [data, setData] = useState();
  const [checkState] = useState(true);
  const [Editdata, setEditData] = useState(false);
  const [editable, setis_editable] = useState();

  const handleButtonClick = () => {
    const allPropsData = {
      company_id,
      client_id,
      site_id,
      start_date,
      checkState,
    };
    // Call the callback function with the object containing all the props
    sendDataToParent(allPropsData);
  };

  const UserPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const CashBankingPermission = UserPermissions?.includes(
    "drs-add-cash-banking"
  );

  const { customDelete } = useCustomDelete();

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(postData, "drs/cash-banking/delete", formData, handleSuccess);
  };

  const handleSuccess = () => {
    FetchTableData();
  };

  useEffect(() => {
    FetchTableData();
  }, []);

  const FetchTableData = async () => {
    try {
      const response = await getData(
        `/drs/cash-banking/?site_id=${SiteID}&drs_date=${ReportDate}`
      );

      if (response && response.data && response.data.data) {
        formik.setFieldValue("value", response?.data?.data?.cash_value);

        setis_editable(response?.data?.data);

        setData(response?.data?.data?.listing);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const validationSchema = Yup.object({
    reference: Yup.string().required("Refrence is required"),
    value: Yup.string()
      .required("Value is required")
      .test("is-number", "Invalid value. Please enter a number", (value) =>
        /^-?\d*\.?\d+$/.test(value)
      ),
  });

  const initialValues = {
    reference: "",
    value: "",
  };

  const handleEdit = (item) => {
    formik.setValues(item);
    setEditData(true);
  };

  //
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("reference", values.reference);
      formData.append("value", values.value);

      formData.append("site_id", SiteID);
      formData.append("drs_date", ReportDate);
      if (Editdata) {
        formData.append("id", values.id);
      }

      const postDataUrl = Editdata
        ? "/drs/cash-banking/update"
        : "/drs/cash-banking/add";

      // eslint-disable-next-line no-unused-vars
      const response = await postData(postDataUrl, formData);

      if (apidata.api_response === "success") {
        setEditData(false);
        FetchTableData();
        handleButtonClick();
        formik.resetForm();
      }
    } catch (error) {
      console.error(error);
      // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      //  width: "10%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Reference",
      selector: (row) => [row.reference],
      sortable: false,
      //  width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.reference}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Value",
      selector: (row) => [row.value],
      sortable: false,
      //  width: "10%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.value}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      //  width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Type",
      selector: (row) => [row.type],
      sortable: false,
      //  width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.type}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      center: true,
      //  width: "20%",
      cell: (row) => (
        <span className="text-center">
          {editable?.is_editable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                // Assuming `row.id` contains the ID
                className="btn btn-primary btn-sm rounded-11 mobile-btn p-2 me-2"
                onClick={() => handleEdit(row)}
              >
                <i className="ph ph-pencil" />
              </Link>
            </OverlayTrigger>
          ) : null}
          {editable?.is_editable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link
                to="#"
                className="btn btn-danger btn-sm rounded-11 mobile-btn p-2"
                onClick={() => handleDelete(row.id)}
              >
                <i className="ph ph-trash" />
              </Link>
            </OverlayTrigger>
          ) : null}
        </span>
      ),
    },
  ];

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        {editable?.is_editable ? (
          <Row>
            <Col md={12} xl={12}>
              <Card>
                <Card.Header>
                  <h3 className="card-title"> Add Cash Banking</h3>
                </Card.Header>
                <Card.Body>
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} xl={6} md={6} sm={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="reference"
                          >
                            Reference<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${
                              formik.errors.reference &&
                              formik.touched.reference
                                ? "is-invalid"
                                : ""
                            }`}
                            id="reference"
                            name="reference"
                            placeholder="Refrence"
                            onChange={formik.handleChange}
                            value={formik.values.reference}
                          />
                          {formik.errors.reference &&
                            formik.touched.reference && (
                              <div className="invalid-feedback">
                                {formik.errors.reference}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} xl={6} md={6} sm={6}>
                        <div className="form-group">
                          <label className="form-label mt-4" htmlFor="value">
                            Value<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${
                              formik.errors.value && formik.touched.value
                                ? "is-invalid"
                                : ""
                            }`}
                            id="value"
                            name="value"
                            placeholder="Value"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.value}
                          />
                          {formik.errors.value && formik.touched.value && (
                            <div className="invalid-feedback">
                              {formik.errors.value}
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      {CashBankingPermission && (
                        <>
                          {Editdata ? (
                            <button type="submit" className="btn btn-primary">
                              Update
                            </button>
                          ) : (
                            <button type="submit" className="btn btn-primary">
                              Add
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          ""
        )}
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Cash Banking</h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <div className="table-responsive deleted-table mobile-first-table">
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader={true}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead={true}
                        highlightOnHover={true}
                        className="dsrCpt"
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
export default withApi(CashBanking);
