import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import Loaderimg from "../../../Utils/Loader";
import { MultiSelect } from "react-multi-select-component";
import { Breadcrumb, Card, Col, FormGroup, Row } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ErrorAlert } from "../../../Utils/ToastUtils";
import NewFilterTab from "../Filtermodal/NewFilterTab";


const ManageDsr = (props) => {
  const { isLoading, getData, postData } = props;
  const [SiteList, setSiteList] = useState([]);
  const [data, setData] = useState();

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



  const handleSubmit = async (values) => {
    setSiteList([])
    setSelected([])
    let { client_id, company_id, site_id, start_date } = values;

    // Check if the role is Client, then set the client_id and client_name from local storage
    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
    }

    const queryParams = new URLSearchParams();
    if (client_id) queryParams.append('client_id', client_id);
    if (company_id) queryParams.append('company_id', company_id);
    if (site_id) queryParams.append('site_id', site_id);
    if (start_date) queryParams.append('date', start_date);

    const queryString = queryParams.toString();

    if (values?.sites) {
      setSiteList(values?.sites)
    }

    try {
      const response = await getData(`site/fuel/purchase-price?${queryString}`);


      const { data } = response;
      if (data) {
        setData(data?.data);
        const formValues = data?.data?.map((item) => ({
          id: item.id,
          fuel_name: item.fuel_name,
          platts_price: item.platts_price,
          premium_price: item.premium_price,
          development_fuels_price: item.development_fuels_price,
          duty_price: item.duty_price,
          vat_percentage_rate: item.vat_percentage_rate,
          ex_vat_price: item.ex_vat_price,
          total: item.total,
        }));

        formik.setFieldValue("data", formValues);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
      // Handle error if the API call fails
    }
  };


  function calculateSum(index) {
    const plattsPrice =
      formik?.values?.data && formik.values.data[index]?.platts_price;
    const developmentfuels_price =
      formik?.values?.data &&
      formik.values.data[index]?.development_fuels_price;
    const dutyprice =
      formik?.values?.data && formik.values.data[index]?.duty_price;
    const premiumPrice =
      formik?.values?.data && formik.values.data[index]?.premium_price;

    if (
      plattsPrice !== undefined &&
      premiumPrice !== undefined &&
      developmentfuels_price !== undefined &&
      dutyprice !== undefined
    ) {
      const sum =
        (parseFloat(plattsPrice) +
          parseFloat(premiumPrice) +
          parseFloat(developmentfuels_price) +
          parseFloat(dutyprice)) /
        100;

      const roundedSum = sum.toFixed(2);
      formik.setFieldValue(`data[${index}].ex_vat_price`, roundedSum);
    }
  }
  const sendEventWithName1 = (event, name, index) => {
    const plattsValue =
      parseFloat(
        formik?.values?.data && formik.values.data[index]?.vat_percentage_rate
      ) || 0;

    const SumTotal = parseFloat(
      formik?.values?.data && formik.values.data[index]?.ex_vat_price
    );

    const sum = (SumTotal * plattsValue) / 100 + SumTotal;

    const roundedSum = Math.round(sum * 100) / 100; // Round to two decimal places
    const formattedSum = roundedSum.toFixed(2).padEnd(5, "0");

    formik.setFieldValue(`data[${index}].total`, formattedSum);
  };

  const columns = [
    {
      name: "FUEL NAME",
      selector: (row) => row.fuel_name,
      sortable: false,
      width: "12.5%",
      center: true,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.fuel_name !== undefined ? `${row.fuel_name}` : ""}
        </span>
      ),
    },
    {
      name: "PLATTS",
      selector: (row) => row.platts_price,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`platts_price-${index}`}
            name={`data[${index}].platts_price`}
            className="table-input"
            step="0.01"
            value={
              formik?.values?.data && formik.values.data[index]?.platts_price
            }
            onChange={formik.handleChange}
            onBlur={(e) => {
              formik.handleBlur(e);
              calculateSum(index);
            }}
          />
        </div>
      ),
    },
    {
      name: "PREMIUM",

      selector: (row) => row.premium_price,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.premium_price}</h4>
        ) : (
          <div>
            <input
              type="number"
              step="0.01"
              id={`premium_price-${index}`}
              name={`data[${index}].premium_price`}
              className="table-input"
              value={
                formik?.values?.data && formik.values.data[index]?.premium_price
              }
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                calculateSum(index);
              }}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "	DEVELOPMENT FUELS ",
      selector: (row) => row.development_fuels_price,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.development_fuels_price}</h4>
        ) : (
          <div>
            <input
              type="number"
              step="0.01"
              id={`development_fuels_price-${index}`}
              name={`data[${index}].development_fuels_price`}
              className="table-input"
              value={
                formik?.values?.data &&
                formik.values.data[index]?.development_fuels_price
              }
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                calculateSum(index);
              }}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "DUTY ",
      selector: (row) => row.duty_price,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.duty_price}</h4>
        ) : (
          <div>
            <input
              type="number"
              step="0.01"
              id={`duty_price-${index}`}
              name={`data[${index}].duty_price`}
              className="table-input"
              value={
                formik?.values?.data && formik.values.data[index]?.duty_price
              }
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                calculateSum(index);
              }}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    {
      name: "EX VAT",
      selector: (row) => row.ex_vat_price,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.ex_vat_price}</h4>
        ) : (
          <div>
            <input
              type="number"
              step="0.01"
              id={`ex_vat_price-${index}`}
              name={`data[${index}].ex_vat_price`}
              className="table-input readonly"
              value={
                formik?.values?.data && formik.values.data[index]?.ex_vat_price
              }
              onChange={formik.handleChange}
              readOnly={true}
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "VAT %",
      selector: (row) => row.vat_percentage_rate,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.vat_percentage_rate}</h4>
        ) : (
          <div>
            <input
              type="number"
              step="0.01"
              id={`vat_percentage_rate-${index}`}
              name={`data[${index}].vat_percentage_rate`}
              className="table-input"
              value={
                formik?.values?.data &&
                formik.values.data[index]?.vat_percentage_rate
              }
              onChange={formik.handleChange}
              onBlur={(event) => {
                formik.handleBlur(event);
                sendEventWithName1(event, "vat_percentage_rate", index); // Call sendEventWithName1 with the event, name, and index parameters
              }}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "TOTAL",
      selector: (row) => row.total,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.total}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`total-${index}`}
              name={`data[${index}].total`}
              className="table-input readonly"
              value={formik?.values?.data && formik.values.data[index]?.total}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={true}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];




  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",
      start_date: '',
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),

      start_date: Yup.date()
        .required("Start Date is required")
        .min(
          new Date("2023-01-01"),
          "Start Date cannot be before January 1, 2023"
        ),
    }),

    onSubmit: (values) => {
      localStorage.setItem('fuelPurchasePrice', JSON.stringify(values));
      handleSubmit(values);
    },
  });



  const handleSubmitForm1 = async (event) => {
    event.preventDefault();
    if (
      selected === undefined ||
      selected === null ||
      (Array.isArray(selected) && selected.length === 0)
    ) {
      ErrorAlert("Please select at least one site");
      return
    }

    try {
      const formData = new FormData();
      formik.values.data.forEach((obj) => {
        const id = obj.id;
        const platts_price = `platts_price[${id}]`;
        const premium_price = `premium_price[${id}]`;
        const development_fuels_price = `development_fuels_price[${id}]`;
        const duty_price = `duty_price[${id}]`;
        const vat_percentage_rate = `vat_percentage_rate[${id}]`;
        const total = `total[${id}]`;
        const ex_vat_price = `ex_vat_price[${id}]`;

        const platts_price_Value = obj.platts_price;
        const premium_price_discount = obj.premium_price;
        const development_fuels_price_nettValue = obj.development_fuels_price;
        const ex_vat_price_price = obj.ex_vat_price;
        const vat_percentage_rate_price = obj.vat_percentage_rate;

        const total_values = obj.total;
        const duty_price_salesValue = obj.duty_price;
        // const action = obj.action;

        formData.append(platts_price, platts_price_Value);
        formData.append(premium_price, premium_price_discount);
        formData.append(
          development_fuels_price,
          development_fuels_price_nettValue
        );
        formData.append(duty_price, duty_price_salesValue);
        formData.append(vat_percentage_rate, vat_percentage_rate_price);
        formData.append(ex_vat_price, ex_vat_price_price);
        formData.append(total, total_values);
      });

      const selectedSiteIds = selected?.map((site) => site.value);

      selectedSiteIds?.forEach((id, index) => {
        formData.append(`site_id[${index}]`, id);
      });

      if (storedData) {
        let parsedData = JSON.parse(storedData);
        formData.append("date", parsedData?.start_date);
      }


      const postDataUrl = "/site/fuel/purchase-price/update";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };

  const UserPermissions = useSelector((state) => state?.data?.data?.permissions || []);

  const isEditPermissionAvailable = UserPermissions?.includes("fuel-purchase-update");
  const isAddPermissionAvailable = UserPermissions?.includes("fuel-purchase-add");

  const [selected, setSelected] = useState([]);


  const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    site_id: Yup.string().required("Site is required"),
  });


  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);

  useEffect(() => {
    if (storedData) {
      let parsedData = JSON.parse(storedData);

      // Check if start_date exists in storedData
      if (!parsedData.start_date) {
        // If start_date does not exist, set it to the current date
        const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
        parsedData.start_date = currentDate;

        // Update the stored data with the new start_date
        localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
        handleApplyFilters(parsedData);
      } else {
        handleApplyFilters(parsedData);
      }

      GetSiteList(parsedData?.company_id)

      // Call the API with the updated or original data
    } else if (localStorage.getItem("superiorRole") === "Client") {
      const storedClientIdData = localStorage.getItem("superiorId");

      if (storedClientIdData) {
        const futurepriceLog = {
          client_id: storedClientIdData,
          start_date: new Date().toISOString().split('T')[0], // Set current date as start_date
        };

        // Optionally store this data back to localStorage
        localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));

        handleApplyFilters(futurepriceLog);
      }
    }
  }, [storedKeyName]); // Add any other dependencies needed here



  const handleClearForm = async () => {
    setData(null)
  };

  const handleApplyFilters = (values) => {
    if (values?.start_date && values?.company_id && values?.site_id) {
      handleSubmit(values)
    }
  }

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Fuel Purchase Price</h1>
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
                Fuel Purchase Price
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/Add-purchase-prices"
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Add Fuel Purchase
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Fuel Purchase Price </h3>
              </Card.Header>

              <NewFilterTab
                getData={getData}
                isLoading={isLoading}
                isStatic={true}
                onApplyFilters={handleApplyFilters}
                validationSchema={validationSchemaForCustomInput}
                storedKeyName={storedKeyName}
                lg="3"
                showStationValidation={true}
                showMonthInput={false}
                showDateInput={true}
                showStationInput={true}
                ClearForm={handleClearForm}
              />

            </Card>
          </Col>
        </Row>


        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Fuel Purchase Price</h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <form onSubmit={handleSubmitForm1}>
                      <Col lg={6} md={6} className="m-0 p-0">
                        <FormGroup className="my-4">
                          <label className="form-label ">
                            Select Sites
                            <span className="text-danger">*</span>
                          </label>
                          <MultiSelect
                            value={selected}
                            onChange={setSelected}
                            labelledBy="Select Sites"
                            disableSearch="true"
                            // options={options}
                            options={SiteList?.map((item) => ({ value: item.id, label: item.site_name }))}

                            showCheckbox="false"
                          />
                        </FormGroup>
                      </Col>
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
                      {isEditPermissionAvailable ? (
                        <div className="d-flex justify-content-end mt-3">
                          {data ? (
                            <>
                              <button className="btn btn-primary" type="submit">
                                Submit
                              </button>
                            </>
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageDsr);
