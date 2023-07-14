import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";

const FuelInventry = (props) => {
  const { SiteID, ReportDate } = props;

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [editable, setis_editable] = useState();
  const [CombinedVarianceData, setCombinedVarianceData] = useState([]);
  const [VarianceDataa, setVarianceDataa] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      SuccessToast("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorToast(errorMessage);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        const response = await axiosInstance.get(
          `/fuel-inventory/list?site_id=${SiteID}&drs_date=${ReportDate}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data?.listing ? data.data.listing : []);
          setCombinedVarianceData(
            data?.data ? data.data.combined_variance_data : []
          );
          setVarianceDataa(data?.data ? data.data.variance_data : []);
          setis_editable(data?.data ? data.data : {});

          const formValues = data?.data?.listing
            ? data.data.listing.map((item) => {
                return {
                  id: item.id,
                  fuel_price: item.fuel_price,
                  metered_sale: item.metered_sale,
                  metered_sale_value: item.metered_sale_value,
                  adjustment: item.adjustment,
                  adjustment_euro: item.adjustment_euro,
                  adjusted_sale: item.adjusted_sale,
                  adjusted_sale_value: item.adjusted_sale_value,
                  tests: item.tests,
                  actual_sales: item.actual_sales,
                  due_sales: item.due_sales,
                  bunkered_sale: item.bunkered_sale,
                  // Add other properties as needed
                };
              })
            : [];

          const Combinedvariancedata = data?.data?.combined_variance_data
            ? data.data.combined_variance_data.map((item) => ({
                description: item.description,
                variance: item.variance,
                // Add other properties as needed
              }))
            : [];
          formik.setFieldValue("Combinedvariance", Combinedvariancedata);

          const Variancedata = data?.data?.variance_data
            ? data.data.variance_data.map((item) => ({
                description: item.description,
                variance: item.variance,
                due_sales: item.due_sales,
                sale_value: item.sale_value,
                // Add other properties as needed
              }))
            : [];
          formik.setFieldValue("Variancedataformik", Variancedata);

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [SiteID, ReportDate]);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    console.log(values.data);

    // Create a new FormData object
    const formData = new FormData();

    for (const obj of values.data) {
      const {
        id,
        fuel_price,
        metered_sale,
        metered_sale_value,
        adjustment,
        adjustment_euro,
        adjusted_sale,
        adjusted_sale_value,
        actual_sales,
        due_sales,
        tests,
        bunkered_sale,
      } = obj;
      const fuel_priceKey = `fuel_price[${id}]`;
      const discountKey = `metered_sale[${id}]`;
      const nettValueKey = `metered_sale_value[${id}]`;
      const salesValueKey = `adjustment[${id}]`;
      const actionKey = `adjustment_euro[${id}]`;
      const bookStockKey = `adjusted_sale[${id}]`;
      const adjusted_sale_valueKey = `adjusted_sale_value[${id}]`;
      const adjusted_sale_valueLtKey = `actual_sales[${id}]`;
      const adjusted_sale_valuePerKey = `due_sales[${id}]`;
      const testsKey = `tests[${id}]`;
      const bunkered_saleKey = `bunkered_sale[${id}]`;

      formData.append(fuel_priceKey, fuel_price);
      formData.append(discountKey, metered_sale);
      formData.append(nettValueKey, metered_sale_value);
      formData.append(salesValueKey, adjustment);
      formData.append(actionKey, adjustment_euro);
      formData.append(bookStockKey, adjusted_sale);
      formData.append(adjusted_sale_valueKey, adjusted_sale_value);
      formData.append(adjusted_sale_valueLtKey, actual_sales);
      formData.append(adjusted_sale_valuePerKey, due_sales);
      formData.append(testsKey, tests);
      formData.append(bunkered_saleKey, bunkered_sale);
    }

    formData.append("site_id", SiteID);
    formData.append("drs_date", ReportDate);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/fuel-inventory/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json(); // Read the response once

      if (response.ok) {
        console.log("Done");
        SuccessToast(responseData.message);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        ErrorToast(responseData.message);

        console.log("API Error:", responseData);
        // Handle specific error cases if needed
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };
  const columns = [
    // ... existing columns

    {
      name: "DESCRIPTION",
      selector: (row) => row.description,
      sortable: false,
      width: "12%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.description !== undefined ? `${row.description}` : ""}
        </span>
      ),
    },
    {
      name: "PRICE",
      selector: (row) => row.fuel_price,
      sortable: false,
      width: "8%",
      center: true,
      cell: (row, index) =>
        row.description === "Total" ? (
          <input
            type="number"
            className="table-input readonly total-input"
            value={row.fuel_price}
            readOnly
          />
        ) : (
          <div>
            <input
              type="number"
              id={`fuel_price-${index}`}
              name={`data[${index}].fuel_price`}
              className={
                  "table-input readonly"
              }
              value={formik.values.data[index]?.fuel_price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },

    {
      name: "	CASH METERED SALES VOL.(ℓ)",
      selector: (row) => row.metered_sale,
      sortable: false,
      width: "8%",
      center: true,
      // Title: "CASH METERED SALES",

      cell: (row, index) =>
        row.description === "Total" ? (
          <input
            type="number"
            className="table-input readonly total-input"
            value={row.metered_sale}
            readOnly
          />
        ) : (
          <div>
            <input
              type="number"
              id={`metered_sale-${index}`}
              name={`data[${index}].metered_sale`}
              className={
                  "table-input readonly"
              }
              
              value={formik.values.data[index]?.metered_sale}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "CASH METERED SALES VALUE(£)",
      selector: (row) => row.metered_sale_value,
      sortable: false,
      width: "8%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <input
            type="number"
            className="table-input readonly total-input"
            value={row.metered_sale_value}
            readOnly
          />
        ) : (
          <div>
            <input
              type="number"
              id={`metered_sale_value-${index}`}
              name={`data[${index}].metered_sale_value`}
              className={
                  "table-input readonly"
              }
              value={formik.values.data[index]?.metered_sale_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "ADJ(ℓ)",
      selector: (row) => row.adjustment,
      sortable: false,
      width: "8%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <input
            type="number"
            className="table-input readonly total-input"
            value={row.adjustment}
            readOnly
          />
        ) : (
          <div>
            <input
              type="number"
              id={`adjustment-${index}`}
              name={`data[${index}].adjustment`}
              className={
                editable?.is_editable ? "table-input " : "table-input readonly "
              }
              value={formik.values.data[index]?.adjustment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "ADJ(£)",
      selector: (row) => row.adjustment_euro,
      sortable: false,
      width: "8%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <input
            type="number"
            className="table-input readonly total-input"
            value={row.adjustment_euro}
            readOnly
          />
        ) : (
          <div>
            <input
              type="number"
              id={`adjustment_euro-${index}`}
              name={`data[${index}].adjustment_euro`}
              className={
                editable?.is_editable ? "table-input " : "table-input readonly "
              }
              value={formik.values.data[index]?.adjustment_euro}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "ADJUSTED SALES VOL.(ℓ)",
      selector: (row) => row.adjusted_sale,
      sortable: false,
      width: "8%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <input
            type="number"
            className="table-input readonly total-input"
            value={row.metered_sale_value}
            readOnly
          />
        ) : (
          <div>
            <input
              type="number"
              id={`metered_sale_value-${index}`}
              name={`data[${index}].metered_sale_value`}
              className={
                "table-input readonly "
              }
              value={formik.values.data[index]?.metered_sale_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "BUNKERED SALES VOL.(ℓ)",
      selector: (row) => row.bunkered_sale,
      sortable: false,
      width: "8%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <input
          type="number"
          className="table-input readonly total-input"
          value={row.adjustment_euro}
          readOnly
        />
        ) : (
          <div>
            <input
              type="number"
              id={`bunkered_sale-${index}`}
              name={`data[${index}].bunkered_sale`}
              className={
                editable?.is_editable ? "table-input " : "table-input readonly "
              }
              value={formik.values.data[index]?.bunkered_sale}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "ADJUSTED SALES `${<br>}` VALUE(£)",
      selector: (row) => row.adjusted_sale_value,
      sortable: false,
      width: "8%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <input
          type="number"
          className="table-input readonly total-input"
          value={row.adjusted_sale_value}
          readOnly
        />
        ) : (
          <div>
            <input
              type="number"
              id={`adjusted_sale_value-${index}`}
              name={`data[${index}].adjusted_sale_value`}
              className={
                "table-input readonly "
              }
              value={formik.values.data[index]?.adjusted_sale_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "TEST(ℓ)",
      selector: (row) => row.tests,
      sortable: false,
      width: "8%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <input
          type="number"
          className="table-input readonly total-input"
          value={row.tests}
          readOnly
        />
        ) : (
          <div>
            <input
              type="number"
              id={`tests-${index}`}
              name={`data[${index}].tests`}
              className={
                editable?.is_editable ? "table-input " : "table-input readonly "
              }
              value={formik.values.data[index]?.tests}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "ACTUAL SALES VOL.(ℓ)",
      selector: (row) => row.actual_sales,
      sortable: false,
      width: "8%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <input
          type="number"
          className="table-input readonly total-input"
          value={row.actual_sales}
          readOnly
        />
        ) : (
          <div>
            <input
              type="number"
              id={`actual_sales-${index}`}
              name={`data[${index}].actual_sales`}
              className={
                  "table-input readonly"
              }
              value={formik.values.data[index]?.actual_sales}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "DUE SALES (£)(ACTUAL SALES VOL. X PRICE)",
      selector: (row) => row.due_sales,
      sortable: false,
      width: "8%",
      center: true,

      cell: (row, index) =>
        row.description === "Total" ? (
          <input
          type="number"
          className="table-input readonly total-input"
          value={row.due_sales}
          readOnly
        />
        ) : (
          <div>
            <input
              type="number"
              id={`due_sales-${index}`}
              name={`data[${index}].due_sales`}
              className={
                  "table-input readonly"
              }
              value={formik.values.data[index]?.due_sales}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];
  const CombinedVarianceColumns = [
    {
      name: "DESCRIPTION",
      selector: (row) => row.description, // Update the selector to use a function
      sortable: true,
      center: false,
      width: "50%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.description}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "VARIANCE",
      selector: (row) => row.variance,
      sortable: false,
      width: "50%",
      center: true,
      // Title: "CASH METERED SALES",
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`variance-${index}`}
            name={`Combinedvariance[${index}].variance`}
            className={" table-input readonly"}
            value={formik.values?.Combinedvariance?.[index]?.variance || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly
          />
          {/* Error handling code */}
        </div>
      ),
    },
  ];
  const VarianceColumns = [
    {
      name: "DESCRIPTION",
      selector: (row) => row.description, // Update the selector to use a function
      sortable: true,
      center: false,
      width: "25%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.description}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "DUE SALES",
      selector: (row) => row.due_sales,
      sortable: false,
      width: "25%",
      center: true,
      // Title: "CASH METERED SALES",
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`due_sales-${index}`}
            name={`Variancedataformik[${index}].due_sales`}
            className={"table-input readonly "}
            value={formik.values?.Variancedataformik?.[index]?.due_sales || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly
            // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "SALE VALUE",
      selector: (row) => row.sale_value,
      sortable: false,
      width: "25%",
      center: true,
      // Title: "CASH METERED SALES",
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`sale_value-${index}`}
            name={`Variancedataformik[${index}].sale_value`}
            className={"table-input readonly "}
            value={formik.values?.Variancedataformik?.[index]?.sale_value || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly
            // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "VARIANCE",
      selector: (row) => row.variance,
      sortable: false,
      width: "25%",
      center: true,
      // Title: "CASH METERED SALES",
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`variance-${index}`}
            name={`Variancedataformik[${index}].variance`}
            className={"table-input readonly "}
            value={formik.values?.Variancedataformik?.[index]?.variance || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly
            // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
  };

  const formik = useFormik({
    initialValues: {
      data: data,
    },
    onSubmit: handleSubmit,
    // validationSchema: validationSchema,
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Fuel-Inventory</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <div className="table-responsive deleted-table">
                    <Row>
                      <Col lg={12} md={12}>
                        <DataTable
                          columns={columns}
                          data={data}
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Card>
                        <Card.Header>
                          <h3 className="card-title">Variance for Report</h3>
                        </Card.Header>
                        <Card.Body>
                          <Col lg={12} md={12}>
                            <DataTable
                              columns={VarianceColumns}
                              data={VarianceDataa}
                              noHeader
                              defaultSortField="id"
                              defaultSortAsc={false}
                              striped={true}
                              persistTableHead
                              highlightOnHover
                              searchable={false}
                              responsive
                            />
                          </Col>
                        </Card.Body>
                      </Card>
                    </Row>
                    <Row>
                      <Card>
                        <Card.Header>
                          <h3 className="card-title">Combined Variance</h3>
                        </Card.Header>
                        <Card.Body>
                          <Col lg={12} md={12}>
                            <DataTable
                              columns={CombinedVarianceColumns}
                              data={CombinedVarianceData}
                              noHeader
                              defaultSortField="id"
                              defaultSortAsc={false}
                              striped={true}
                              persistTableHead
                              highlightOnHover
                              searchable={false}
                              responsive
                            />
                          </Col>
                        </Card.Body>
                      </Card>
                    </Row>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    {data.length > 0 ? (
                      <button className="btn btn-primary" type="submit">
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
      </>
    </>
  );
};

export default FuelInventry;
