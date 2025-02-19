import { useEffect, useState } from "react";
import { Col, Row, Card, Breadcrumb } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const SiteSettings = (props) => {
  const { isLoading, getData, postData } = props;
  const [data, setData] = useState();
  const { handleError } = useErrorHandler();
  const UserPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const isEditPermissionAvailable = UserPermissions?.includes(
    "shop-update-facility-fees"
  );

  const handleSubmit = async (values) => {
    let { client_id, company_id } = values;
    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
    }

    const queryParams = new URLSearchParams();
    if (client_id) queryParams.append("client_id", client_id);
    if (company_id) queryParams.append("company_id", company_id);

    try {
      const queryString = queryParams.toString();
      const response = await getData(`daily-facility-fees?${queryString}`);

      const { data } = response;
      if (data) {
        setData(data?.data);
        const formValues = data?.data.map((item) => ({
          charge_id: item?.charge_id,
          date: item?.date,
          site_id: item?.site_id,
          site_name: item?.site_name,
          value: item?.value,
        }));

        formik.setFieldValue("data", formValues);

        // Process the API response and update your state or perform other actions
      }
    } catch (error) {
      console.error("API error:", error);
      // Handle error if the API call fails
    }
  };

  const formik = useFormik({
    initialValues: {
      company_id: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
    }),
    onSubmit: (values) => {
      localStorage.setItem("localDailyFacilityFees", JSON.stringify(values));
      handleSubmit(values);
    },
  });

  const columns = [
    {
      name: "SITE NAME",
      selector: (row) => row?.site_name,
      sortable: false,
      //  width: "33%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row?.site_name !== undefined ? `${row?.site_name}` : ""}
        </span>
      ),
    },
    {
      name: "CREATED DATE",
      selector: (row) => row?.date,
      sortable: false,
      //  width: "33%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row?.date !== undefined ? `${row?.date}` : ""}
        </span>
      ),
    },

    {
      name: "VALUE",
      selector: (row) => row?.value,
      sortable: false,
      //  width: "33%",
      center: false,

      cell: (row, index) =>
        row?.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row?.value}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`value-${index}`}
              name={`data[${index}].value`}
              className="table-input"
              value={formik?.values?.data && formik.values.data[index]?.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];

  const handleSubmitForm1 = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formik?.values?.data?.forEach((obj) => {
        const id = obj?.site_id;
        const values = obj?.value;
        const charges_price = `charges[${id}]`;

        const platts_price_Value = values;

        // const action = obj.action;

        formData.append(charges_price, platts_price_Value);
      });

      const postDataUrl = "/daily-facility-fees/update";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error);
      // Set the submission state to false if an error occurs
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
  });

  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);

  useEffect(() => {
    if (storedData) {
      let parsedData = JSON.parse(storedData);

      // Check if start_date exists in storedData
      if (!parsedData.start_date) {
        // If start_date does not exist, set it to the current date
        const currentDate = new Date().toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
        parsedData.start_date = currentDate;

        // Update the stored data with the new start_date
        localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
        handleApplyFilters(parsedData);
      } else {
        handleApplyFilters(parsedData);
      }

      // Call the API with the updated or original data
    } else if (localStorage.getItem("superiorRole") === "Client") {
      const storedClientIdData = localStorage.getItem("superiorId");

      if (storedClientIdData) {
        const futurepriceLog = {
          client_id: storedClientIdData,
          start_date: new Date().toISOString().split("T")[0], // Set current date as start_date
        };

        // Optionally store this data back to localStorage
        localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));

        handleApplyFilters(futurepriceLog);
      }
    }
  }, [storedKeyName]); // Add any other dependencies needed here

  const handleApplyFilters = (values) => {
    if (values?.company_id) {
      handleSubmit(values);
    }
  };

  const handleClearForm = async () => {
    setData(null);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Daily Facility Fees</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item  breadcrumds"
                aria-current="page"
                linkAs={Link}
                linkProps={{ to: "/sites" }}
              >
                Daily Facility Fees
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Filter </h3>
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
                showStationInput={false}
                ClearForm={handleClearForm}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Daily Facility Fees</Card.Title>
              </Card.Header>

              <div className="card-body">
                {data?.length > 0 ? (
                  <>
                    <form onSubmit={handleSubmitForm1}>
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
                      {isEditPermissionAvailable ? (
                        <div className="d-flex justify-content-end mt-3">
                          {data ? (
                            <button className="btn btn-primary" type="submit">
                              Submit
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </form>
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
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default withApi(SiteSettings);
