import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { BsDownload } from "react-icons/bs";

import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";

import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import useCustomDelete from "../../../Utils/useCustomDelete";

const BankDeposit = (props) => {
  const {
    apidata,
    isLoading,
    getData,
    postData,
    SiteID,
    ReportDate,
    client_id,
    company_id,
    site_id,
    start_date,
    sendDataToParent,
  } = props;
  const [Editdata, setEditData] = useState(false);
  const [bankAmount, setBankAmount] = useState();
  const UserPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const CashBankDepositPermission = UserPermissions?.includes(
    "drs-add-bank-deposit"
  );

  const [checkStateForBankDeposit] = useState(true);
  const [data, setData] = useState();
  const handleButtonClick = () => {
    const allPropsData = {
      company_id,
      client_id,
      site_id,
      start_date,
      checkStateForBankDeposit,
    };
    sendDataToParent(allPropsData);
  };

  const { customDelete } = useCustomDelete();
  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(postData, "drs/bank-deposite/delete", formData, handleSuccess);
  };

  const handleSuccess = () => {
    FetchTableData();
  };

  useEffect(() => {
    FetchTableData();
  }, []);
  const [editable, setis_editable] = useState();
  const FetchTableData = async () => {
    try {
      const response = await getData(
        `/drs/bank-deposite/?site_id=${SiteID}&drs_date=${ReportDate}`
      );

      if (response && response.data && response.data.data) {
        setBankAmount(response?.data?.data?.amount);
        setData(
          response?.data?.data?.listing ? response?.data.data.listing : []
        );
        setis_editable(response?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.string()
      .required("Amount is required")
      .test("is-number", "Invalid Amount. Please enter a number", (amount) =>
        /^-?\d*\.?\d+$/.test(amount)
      ),
    reason: Yup.string().required("Reason is required"),
  });
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("reason", values.reason);
      formData.append("amount", values.amount);
      formData.append("slip", values.image);

      formData.append("site_id", SiteID);
      formData.append("drs_date", ReportDate);
      if (Editdata) {
        formData.append("id", values.id);
      }

      const postDataUrl = Editdata
        ? "/drs/bank-deposite/update"
        : "/drs/bank-deposite/add";

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

  const handleEdit = (item) => {
    formik.setValues(item);
    setEditData(true);
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      reason: "",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle form submission
      handleSubmit(values);
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("image", file);
    formik.setFieldTouched("image", true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    formik.setFieldValue("image", file);
    formik.setFieldTouched("image", true);
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "10%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Amount",
      selector: (row) => [row.amount],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.amount}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Reason",
      selector: (row) => [row.reason],
      sortable: false,
      width: "10%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.reason}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "slip",
      selector: (row) => [row.slip],
      sortable: false,
      width: "20%",

      cell: (row) => (
        <div className="d-flex align-items-center card-img">
          {}

          <div style={{ cursor: "pointer" }}>
            {row.slip_type === "pdf" ? (
              <>
                <a
                  href={row?.slip}
                  target="_blank"
                  download="my-pdf-filename.pdf"
                  rel="noreferrer"
                >
                  <BsDownload size={24} />
                </a>
              </>
            ) : (
              <a
                href={row?.slip}
                target="_blank"
                download={row?.slip}
                className="mr-2"
                rel="noreferrer"
              >
                <img
                  src={row.slip}
                  alt={row.slip}
                  style={{ width: "50px", height: "50px" }}
                />
              </a>
            )}
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <span className="text-center">
          {editable?.is_editable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                // Assuming `row.id` contains the ID
                className="btn btn-primary btn-sm rounded-11 me-2"
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
                className="btn btn-danger btn-sm rounded-11"
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
        {" "}
        {editable?.is_editable ? (
          <Row>
            <Col md={12} xl={12}>
              <Card>
                <Card.Header>
                  <h3 className="card-title"> Bank Deposit</h3>
                </Card.Header>
                <Card.Body>
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} xl={6} md={6} sm={6}>
                        <div className="form-group">
                          <label className="form-label mt-4" htmlFor="amount">
                            Amount<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${
                              formik.errors.amount && formik.touched.amount
                                ? "is-invalid"
                                : ""
                            }`}
                            id="amount"
                            name="amount"
                            placeholder="Amount"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.amount}
                          />
                          {formik.errors.amount && formik.touched.amount && (
                            <div className="invalid-feedback">
                              {formik.errors.amount}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6} md={12}>
                        <div className="form-group">
                          <label className="form-label mt-4" htmlFor="reason">
                            Choose Reason<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${
                              formik.errors.reason && formik.touched.reason
                                ? "is-invalid"
                                : ""
                            }`}
                            id="reason"
                            name="reason"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.reason}
                          >
                            <option value="">---Select Any---</option>
                            <option value="0">
                              Loomis didn't come for collection
                            </option>
                            <option value="1">
                              Site operator missed the Loomis
                            </option>
                            <option value="2">Completely updated</option>
                          </select>
                          {formik.errors.reason && formik.touched.reason && (
                            <div className="invalid-feedback">
                              {formik.errors.reason}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6} md={12}>
                        <div className="form-group">
                          <label htmlFor="image">Image</label>
                          <div
                            className={`dropzone ${
                              formik.errors.image && formik.touched.image
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
                              onChange={(event) => handleImageChange(event)}
                              className="form-control"
                            />
                            <p>
                              Drag and drop your image here, or click to browse
                            </p>
                          </div>
                          {formik.errors.image && formik.touched.image && (
                            <div className="invalid-feedback">
                              {formik.errors.image}
                            </div>
                          )}
                        </div>
                      </Col>
                      <div className="text-end">
                        {CashBankDepositPermission && (
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
                    </Row>
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
              <Card.Header style={{ gap: "70px" }}>
                <h3 className="card-title">Bank Deposit</h3>
                {bankAmount ? (
                  <h3
                    style={{
                      textAlign: "left",
                      margin: " 13px 0",
                      fontSize: "15px",
                      color: "white",
                      background: "#b52d2d",
                      padding: "10px",
                      borderRadius: "7px",
                    }}
                  >
                    Amount need to be deposit: £{bankAmount}
                  </h3>
                ) : (
                  ""
                )}
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
export default withApi(BankDeposit);
