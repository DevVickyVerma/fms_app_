import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import useErrorHandler from "../../CommonComponent/useErrorHandler";
import useToggleStatus from "../../../Utils/useToggleStatus";
import useCustomDelete from "../../../Utils/useCustomDelete";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import * as Yup from "yup";
import {
  handleFilterData,
  staticCompiPriceCommon2,
} from "../../../Utils/commonFunctions/commonFunction";
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from "formik";
import InputTime from "../Competitor/InputTime";

const FuelAutomation = ({ isLoading, getData, postData }) => {
  let storedKeyName = "localFilterModalData";
  const [data, setData] = useState(staticCompiPriceCommon2);
  const [permissionsArray, setPermissionsArray] = useState([]);
  const UserPermissions = useSelector((state) => state?.data?.data);
  const [siteName, setSiteName] = useState("");
  const { handleError } = useErrorHandler();
  const ReduxFullData = useSelector((state) => state?.data?.data);
  const { customDelete } = useCustomDelete();
  const { toggleStatus } = useToggleStatus();
  const [isEdited, setIsEdited] = useState(false); // Track if user has edited any input
  const [priceSuggestionEditable, setPriceSuggestionEditable] = useState(false);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  // useEffect(() => {
  //   fetchBankManagerList();
  // }, []);

  const isAddPermissionAvailable = permissionsArray?.includes(
    "fuel-automation-create"
  );
  const isDeletePermissionAvailable = permissionsArray?.includes(
    "fuel-automation-delete"
  );
  const isEditPermissionAvailable = permissionsArray?.includes(
    "fuel-automation-edit"
  );
  const isstatusPermissionAvailable = permissionsArray?.includes(
    "fuel-automation-edit"
  );

  const { id } = useParams();

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id.toString());
    formData.append("status", (row.status === 1 ? 0 : 1).toString());
    toggleStatus(
      postData,
      "/site/fuel-automation-setting/update-status",
      formData,
      handleSuccess
    );
  };

  const handleSuccess = () => {
    fetchBankManagerList();
  };

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(
      postData,
      "site/fuel-automation-setting/delete",
      formData,
      handleSuccess
    );
  };

  useEffect(() => {
    handleFilterData(handleApplyFilters, ReduxFullData, "localFilterModalData");
  }, []);

  const fetchBankManagerList = async (filters) => {
    let { client_id, company_id, site_id, client_name, company_name } = filters;

    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = ReduxFullData?.superiorId;
      client_name = ReduxFullData?.full_name;
    }

    if (ReduxFullData?.company_id && !company_id) {
      company_id = ReduxFullData?.company_id;
      company_name = ReduxFullData?.company_name;
    }

    const updatedFilters = {
      ...filters,
      client_id,
      client_name,
      company_id,
      company_name,
    };

    if (client_id) {
      try {
        const response = await getData(
          `/site/fuel-automation-setting/list?site_id=${site_id}`
        );
        if (response && response.data) {
          // setData(response?.data?.data?.settings);
          setSiteName(response?.data?.data?.site_name);
        } else {
          throw new Error("No data available in the response");
        }
      } catch (error) {
        console.error(error); // Set the submission state to false if an error occurs
      }
    }
  };

  // Tooltip for better UI
  const renderTooltip = (message) => (
    <Tooltip id="button-tooltip">{message}</Tooltip>
  );

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
      name: "Time",
      selector: (row) => [row.time],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.time}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => [row.value],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
          // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6
              className={`mb-0 fs-14 fw-semibold ${
                row?.action === 1
                  ? "work-flow-sucess-status"
                  : row?.action === 2
                  ? "work-flow-danger-status"
                  : ""
              }`}
            >
              {row.value}

              {row?.action === 1 ? (
                <>
                  <i className={`ph ph-arrow-up`}></i>
                </>
              ) : row?.action === 2 ? (
                <>
                  <i className={`ph ph-arrow-down`}></i>
                </>
              ) : (
                <></>
              )}
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Frequency",
      selector: (row) => [row.frequency],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
          // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">
              {row.frequency === 1 ? "Daily" : row.frequency}
            </h6>
          </div>
        </div>
      ),
    },

    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
          // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => [row.status],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold ">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.status === 1 ? (
              <button
                className="btn btn-success btn-sm"
                onClick={
                  isstatusPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Active
              </button>
            ) : row.status === 0 ? (
              <button
                className="btn btn-danger btn-sm"
                onClick={
                  isstatusPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Inactive
              </button>
            ) : (
              <button
                className="badge"
                onClick={
                  isstatusPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Unknown
              </button>
            )}
          </OverlayTrigger>
        </span>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/edit-fuel-automation/${row.id}`}
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

  const handleClearForm = async () => {
    setData(null);
  };

  const handleApplyFilters = (values) => {
    if (values?.site_id && values?.company_id) {
      // handleSubmit1(values);
      fetchBankManagerList(values);
    }
  };

  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    start_date: Yup.date()
      .required("Date is required")
      .min(new Date("2023-01-01"), "Date cannot be before January 1, 2023"),
  });

  const formik = useFormik({
    initialValues: {
      columns: [],
      rows: [],
      head_array: [],
      update_tlm_price: false,
      notify_operator: false,
      confirmation_required: true,
      pricedata: [],
    },
    enableReinitialize: true,
    onSubmit: () => {
      // Your submit logic here
    },
  });

  const standardizeName = (name) => name?.toLowerCase().replace(/\s+/g, "_");
  const validationSchema = Yup.object({
    fuels: Yup.array().of(
      Yup.array().of(
        Yup.object({
          date: Yup.string().required("Date is required"),
          time: Yup.string().required("Time is required"),
          price: Yup.number().required("Price is required"),
        })
      )
    ),
  });

  const fuels = [];
  const lsitingformik = useFormik({
    initialValues: { fuels },
    // validationSchema,
    onSubmit: (values) => {
      // handleSubmit(values);
      // setFormValues(values); // Store form values
      // setIsModalOpen(true); // Open the modal
    },
  });

  const { id: prarmSiteID } = useParams();

  useEffect(() => {
    if (data) {
      //   Standardize column names
      const columns = data?.head_arrayMain?.map((item) =>
        standardizeName(item.name)
      );
      const firstRow = data?.current[0] || [];
      const rows = firstRow?.reduce((acc, item) => {
        const standardizedName = standardizeName(item.name);
        acc.date = item.date;
        acc.time = item.time;
        acc[standardizedName] = item.price;
        acc.readonly = !item?.is_editable;
        acc.currentprice = item.status === "SAME";
        return acc;
      }, {});

      formik.setValues({
        columns: columns,
        rows: [rows], // Make sure rows is an array with one object
        update_tlm_price: data?.update_tlm_price,
        confirmation_required: data?.confirmation_required,
        notify_operator: data?.notify_operator,
        head_array: data?.head_array,
        pricedata: data,
      });
      lsitingformik.setValues({
        fuels: data?.fuels,
      });
    }
  }, [data]);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <div className="page-header d-flex">
          <div>
            <h1 className="page-title">Fuel Automation </h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/sites" }}
              >
                Sites
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Fuel Automation
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to={`/add-fuel-automation/${siteName}/${id}`}
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Add Fuel Automation
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Fuel Selling Price </h3>
              </Card.Header>

              <NewFilterTab
                getData={getData}
                isLoading={isLoading}
                isStatic={true}
                onApplyFilters={handleApplyFilters}
                validationSchema={validationSchemaForCustomInput}
                storedKeyName={storedKeyName}
                lg="4"
                showStationValidation={true}
                showMonthInput={false}
                showDateInput={false}
                showStationInput={true}
                ClearForm={handleClearForm}
              />
            </Card>
          </Col>
        </Row>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Fuel Automation </h3>
              </Card.Header>
              <Card.Body>
                <Card.Header>
                  <h3 className="card-title">Current Price </h3>
                </Card.Header>

                <FormikProvider value={lsitingformik}>
                  <Form>
                    <div className="table-container ">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="middy-table-head">Date</th>
                            <th className="middy-table-head">Time</th>
                            {formik.values?.head_array?.map((item) => (
                              <th key={item?.id} className="middy-table-head">
                                {item}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {formik?.values?.rows?.map((row, rowIndex) => (
                            <tr className="middayModal-tr" key={rowIndex}>
                              {formik?.values?.columns?.map(
                                (column, colIndex) => (
                                  <React.Fragment key={colIndex}>
                                    <td
                                      className={`time-input-fuel-sell ${
                                        column === "time"
                                          ? "middayModal-time-td "
                                          : "middayModal-td "
                                      }`}
                                      key={colIndex}
                                    >
                                      {column === "date" ? (
                                        <>
                                          <input
                                            type="date"
                                            className={`table-input  ${
                                              row.currentprice
                                                ? "fuel-readonly"
                                                : ""
                                            } ${
                                              row?.readonly
                                                ? "readonly update-price-readonly"
                                                : ""
                                            }`}
                                            value={
                                              formik?.values?.pricedata
                                                ?.currentDate
                                            }
                                            name={row?.[column]}
                                            onChange={(e) =>
                                              handleChange(e, rowIndex, column)
                                            }
                                            onClick={(e) =>
                                              handleShowDate(
                                                e,
                                                formik?.values?.pricedata
                                                  ?.currentDate
                                              )
                                            } // Passing currentDate to the onClick handler
                                            disabled={row?.readonly}
                                            placeholder="Enter price"
                                          />
                                        </>
                                      ) : column === "time" ? (
                                        <>
                                          <InputTime
                                            label="Time"
                                            value={
                                              formik?.values?.pricedata
                                                ?.currentTime
                                            }
                                            disabled={true} // Disable if not editable
                                            className={`time-input-fuel-sell ${
                                              !row?.[0]?.is_editable
                                                ? "fuel-readonly"
                                                : ""
                                            }`}
                                          />
                                        </>
                                      ) : (
                                        <input
                                          type="number"
                                          className={`table-input ${
                                            row.currentprice
                                              ? "fuel-readonly"
                                              : ""
                                          } ${row?.readonly ? "readonly" : ""}`}
                                          name={`rows[${rowIndex}].${column}`}
                                          value={row[column]}
                                          onChange={(e) =>
                                            handleChange(e, rowIndex, column)
                                          }
                                          disabled={row?.readonly}
                                          placeholder="Enter price"
                                        />
                                      )}
                                    </td>
                                  </React.Fragment>
                                )
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Form>
                </FormikProvider>

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
                        fixedHeader={true}
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
      </div>
    </>
  );
};

export default withApi(FuelAutomation);
