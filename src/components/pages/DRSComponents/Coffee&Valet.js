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

const CoffeeValet = (props) => {
  const {
    apidata,
    error,
    company_id,
    client_id,
    site_id,
    start_date,
    sendDataToParent,
  } = props;

  const handleButtonClick = () => {
    const allPropsData = {
      company_id,
      client_id,
      site_id,
      start_date,
    };

    // Call the callback function with the object containing all the props
    sendDataToParent(allPropsData);
  };

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [editable, setis_editable] = useState();

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
          `/valet-coffee/list?site_id=${site_id}&drs_date=${start_date}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data?.listing ? data.data.listing : []);
          setis_editable(data?.data ? data.data : {});

          const formValues = data?.data?.listing
            ? data.data.listing.map((item) => {
                return {
                  id: item.id,
                  opening: item.opening,
                  closing: item.closing,
                  tests: item.tests,
                  adjust: item.adjust,
                  sale: item.sale,
                  price: item.price,
                  value: item.value,
                  com_rate: item.com_rate,
                  commission: item.commission,
                  // value_per: item.value_per ,
                  // Add other properties as needed
                };
              })
            : [];

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);
          console.log(formValues, "formValues");
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [site_id, start_date]);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    console.log(values.data);

    // Create a new FormData object
    const formData = new FormData();

    const processedIds = [];
    for (let index = 0; index < values.data.length; index++) {
      const obj = values.data[index];
      const {
        id,
        opening,
        closing,
        tests,
        adjust,
        sale,
        price,
        value,
        commission,
        value_per,
        com_rate,
      } = obj;
      const openingKey = `opening[${id}]`;
      const discountKey = `closing[${id}]`;
      const nettValueKey = `tests[${id}]`;
      const salesValueKey = `adjust[${id}]`;
      const actionKey = `sale[${id}]`;
      const bookStockKey = `price[${id}]`;
      const valueKey = `value[${id}]`;
      const valueLtKey = `commission[${id}]`;
      //   const valuePerKey = `value_per[${id}]`;
      const com_rateKey = `com_rate[${id}]`;
      if (!processedIds.includes(id) && id !== undefined) {
        formData.append(`valet_sale_id[${index}]`, id);
        processedIds.push(id); // Add ID to the processedIds array
      }

      if (openingKey && opening !== undefined) {
        formData.append(openingKey, opening);
      }
      if (discountKey && closing !== undefined) {
        formData.append(discountKey, closing);
      }
      if (nettValueKey && tests !== undefined) {
        formData.append(nettValueKey, tests);
      }
      if (salesValueKey && adjust !== undefined) {
        formData.append(salesValueKey, adjust);
      }
      if (actionKey && opening !== undefined) {
        formData.append(actionKey, sale);
      }
      if (bookStockKey && price !== undefined) {
        formData.append(bookStockKey, price);
      }
      if (valueKey && opening !== undefined) {
        formData.append(valueKey, value);
      }
      if (valueLtKey && opening !== undefined) {
        formData.append(valueLtKey, commission);
      }
      if (com_rateKey && com_rate !== undefined) {
        formData.append(com_rateKey, com_rate);
      }
    }

    formData.append("site_id", site_id);

    formData.append("drs_date", start_date);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/valet-coffee/update`,
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
        handleButtonClick();
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
      name: "ITEM CATEGORY",
      selector: (row) => row.item_category,
      sortable: false,
      width: "15%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.item_category !== undefined ? `${row.item_category}` : ""}
        </span>
      ),
    },
    {
      name: "OPENING",
      selector: (row) => row.opening,
      sortable: false,
      width: "9.5%",
      center: true,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.opening}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`opening-${index}`}
              name={`data[${index}].opening`}
              className="table-input readonly"
              value={formik.values.data[index]?.opening}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "CLOSING ",
      selector: (row) => row.closing,
      sortable: false,
      width: "9.5%",
      center: true,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.closing}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              min={row.opening}
              id={`closing-${index}`}
              name={`data[${index}].closing`}
              className={
                editable?.is_editable ? "table-input " : "table-input readonly "
              }
              value={formik.values.data[index]?.closing}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                calculateSum(index);
              }}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "TESTS",
      selector: (row) => row.tests,
      sortable: false,
      width: "9.5%",
      center: true,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.tests}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`tests-${index}`}
              name={`data[${index}].tests`}
              className={"table-input readonly "}
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
      name: "ADJUST",
      selector: (row) => row.adjust,
      sortable: false,
      width: "9.5%",
      center: true,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.adjust}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`adjust-${index}`}
              name={`data[${index}].adjust`}
              className={
                editable?.is_editable ? "table-input " : "table-input readonly "
              }
              value={formik.values.data[index]?.adjust}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={editable?.is_editable ? false : true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "SALES",
      selector: (row) => row.sale,
      sortable: false,
      width: "9.5%",
      center: true,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.sale}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`sale-${index}`}
              name={`data[${index}].sale`}
              className={"table-input readonly "}
              value={formik.values.data[index]?.sale}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "PRICE",
      selector: (row) => row.price,
      sortable: false,
      width: "9.5%",
      center: true,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.price}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`price-${index}`}
              name={`data[${index}].price`}
              className={"table-input readonly "}
              value={formik.values.data[index]?.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "VALUE",
      selector: (row) => row.value,
      sortable: false,
      width: "9.5%",
      center: true,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.value}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`value-${index}`}
              name={`data[${index}].value`}
              className={"table-input readonly "}
              value={formik.values.data[index]?.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "COMMISSION RATE",
      selector: (row) => row.com_rate,
      sortable: false,
      width: "9.5%",
      center: true,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.com_rate}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`com_rate-${index}`}
              name={`data[${index}].com_rate`}
              className={"table-input readonly "}
              value={formik.values.data[index]?.com_rate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "COMMISSION VALUE",
      selector: (row) => row.commission,
      sortable: false,
      width: "9.5%",
      center: true,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.commission}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`commission-${index}`}
              name={`data[${index}].commission`}
              className={"table-input readonly "}
              value={formik.values.data[index]?.commission}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
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

  function calculateSum(index) {
    const closingAmount = Number(formik?.values?.data?.[index]?.closing);
    const openingAmount = Number(formik?.values?.data?.[index]?.opening);
    const saleAmount = Number(formik?.values?.data?.[index]?.sale);
    const priceAmount = Number(formik?.values?.data?.[index]?.price);
    const comrate = Number(formik?.values?.data?.[index]?.com_rate);

    for (let index = 0; index < formik?.values?.data?.length; index++) {
      console.log(`Sale at index ${index}:`, formik?.values?.data[index]?.sale);
    }

    if (
      !isNaN(closingAmount) &&
      !isNaN(saleAmount) &&
      !isNaN(priceAmount) &&
      !isNaN(comrate) &&
      !isNaN(openingAmount)
    ) {
      const SalesAmount = closingAmount - openingAmount;
      const ValueAmount = SalesAmount * priceAmount;
      const comrateAmount = (ValueAmount * comrate) / 100;

      const sale = SalesAmount.toFixed(2);
      const value = ValueAmount.toFixed(2);
      const commission = comrateAmount.toFixed(2);
      formik.setFieldValue(`data[${index}].sale`, sale);
      formik.setFieldValue(`data[${index}].value`, value);
      formik.setFieldValue(`data[${index}].commission`, commission);

      console.log(SalesAmount, "SalesAmount");
      console.log(ValueAmount, "ValueAmount");
      console.log(comrateAmount, "comrateAmount");
    } else {
      console.log("Invalid or missing numeric values");
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Coffee & Valet Sales</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <div className="table-responsive deleted-table">
                    <DataTableExtensions {...tableDatas}>
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
                    </DataTableExtensions>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    {editable?.is_editable ? (
                      <button className="btn btn-primary" type="submit">
                        Submit
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled
                      >
                        Submit
                      </button>
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

export default CoffeeValet;
