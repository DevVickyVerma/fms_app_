import { useEffect, useState } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import CoffeeAndValetUploadInvoice from "./CoffeeAndValetUploadInvoice";
import { ErrorAlert, handleError, SuccessAlert } from "../../../Utils/ToastUtils";

const CoffeeValet = (props) => {
  const {
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


  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editable, setis_editable] = useState();
  const [mySalesTotalValue, setMySalesTotalValue] = useState();
  const [invoiceCallData, setInvoiceCallData] = useState();
  const [myCommissionValueTotalValue, setMyCommissionValueTotalValue] =
    useState();
  const [myValuesTotalValue, setMyValuesTotalValue] = useState();
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    fetchData();
  }, [site_id, start_date]);
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
        setData(data?.data?.listing);
        setis_editable(data?.data);


        if (data?.data?.listing) {
          formik.setFieldValue("data", data?.data?.listing);
        }
      }
    } catch (error) {
      console.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
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
        com_rate,
        adj_value,
      } = obj;
      const openingKey = `opening[${id}]`;
      const discountKey = `closing[${id}]`;
      const nettValueKey = `tests[${id}]`;
      const salesValueKey = `adjust[${id}]`;
      const actionKey = `sale[${id}]`;
      const bookStockKey = `price[${id}]`;
      const valueKey = `value[${id}]`;
      const valueLtKey = `commission[${id}]`;
      const adj_valueKey = `adj_value[${id}]`;
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
      if (adj_valueKey && adj_value !== undefined) {
        formData.append(adj_valueKey, adj_value);
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
        SuccessAlert(responseData.message);
        handleButtonClick();
      } else {
        ErrorAlert(responseData.message);

        // Handle specific error cases if needed
      }
    } catch (error) {
      console.error("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  if (editable?.is_file || editable?.is_upload_file) {
  }


  const handleInvoiceModal = (row) => {
    setShowModal(true);
    const allPropsData = {
      company_id,
      client_id,
      site_id,
      start_date,
      selectedRow: row,
    };
    setInvoiceCallData(allPropsData)
  }

  const columns = [

    {
      name: "ITEM CATEGORY",
      selector: (row) => row.item_category,
      sortable: false,
      width: editable?.is_adjustable ? "7%" : "14%",
      center: false,
      cell: (row) => (
        <span className="text-muted  fw-semibold text-center coffe-item-category">
          {row.item_category !== undefined ? `${row.item_category}` : ""}
        </span>
      ),
    },
    {
      name: "OPENING",
      selector: (row) => row.opening,
      sortable: false,
      width: editable?.is_file || editable?.is_upload_file ? "8.5%" : "9.5%",
      center: false,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.opening}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`opening-${index}`}
              name={`data[${index}].opening`}
              value={formik.values.data[index]?.opening}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input  ${!row?.edit_opening ? 'readonly' : ''}`}
              readOnly={!row?.edit_opening}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "CLOSING ",
      selector: (row) => row.closing,
      sortable: false,
      width: editable?.is_file || editable?.is_upload_file ? "8.5%" : "9.5%",
      center: false,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.closing}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              // min={row.opening}
              min={formik?.values?.data?.[index]?.opening}
              id={`closing-${index}`}
              name={`data[${index}].closing`}
              value={formik.values.data[index]?.closing}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                calculateSum(index);
              }}
              className={`table-input  ${!row?.edit_closing ? 'readonly' : ''}`}
              readOnly={!row?.edit_closing}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "TESTS",
      selector: (row) => row.tests,
      sortable: false,
      width: editable?.is_file || editable?.is_upload_file ? "8.5%" : "9.5%",
      center: false,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.tests}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`tests-${index}`}
              name={`data[${index}].tests`}
              value={formik.values.data[index]?.tests}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                calculateSum(index);
              }}
              className={`table-input  ${!row?.edit_tests ? 'readonly' : ''}`}
              readOnly={!row?.edit_tests}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "ADJUST",
      selector: (row) => row.adjust,
      sortable: false,
      width: editable?.is_file || editable?.is_upload_file ? "8.5%" : "9.5%",
      center: false,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.adjust}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`adjust-${index}`}
              name={`data[${index}].adjust`}
              value={formik.values.data[index]?.adjust}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                calculateSum(index);
              }}
              className={`table-input  ${!row?.edit_adjust ? 'readonly' : ''}`}
              readOnly={!row?.edit_adjust}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "SALES",
      selector: (row) => row.sale,
      sortable: false,
      width: editable?.is_file || editable?.is_upload_file ? "8.5%" : "9.5%",
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              // value={row.sale}
              value={mySalesTotalValue ? mySalesTotalValue : row.sale}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`sale-${index}`}
              name={`data[${index}].sale`}
              className={"table-input readonly "}
              value={
                formik.values.data[index]?.sale
                  .toString()
                  .match(/^-?\d+(?:\.\d{0,2})?/)[0]
              }
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                calculateSum(index);
              }}
              readOnly={true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "PRICE",
      selector: (row) => row.price,
      sortable: false,
      width: editable?.is_file || editable?.is_upload_file ? "8.5%" : "9.5%",
      center: false,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.price}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`price-${index}`}
              name={`data[${index}].price`}
              className={"table-input readonly "}
              value={
                formik.values.data[index]?.price
                  ?.toString()
                  .match(/^-?\d+(?:\.\d{0,2})?/)[0]
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "VALUE",
      selector: (row) => row.value,
      sortable: false,
      width: editable?.is_file || editable?.is_upload_file ? "8.5%" : "9.5%",
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              // value={row.value}
              value={myValuesTotalValue ? myValuesTotalValue : row.value}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`value-${index}`}
              name={`data[${index}].value`}
              className={"table-input readonly "}
              value={
                formik.values.data[index]?.value
                  ?.toString()
                  .match(/^-?\d+(?:\.\d{0,2})?/)[0]
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "COMMISSION RATE",
      selector: (row) => row.com_rate,
      sortable: false,
      width: editable?.is_file || editable?.is_upload_file ? "8.5%" : "9.5%",

      center: false,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.com_rate}
              readOnly={true}
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
              readOnly={true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "COMMISSION VALUE",
      selector: (row) => row.commission,
      sortable: false,
      width: editable?.is_file || editable?.is_upload_file ? "8.5%" : "10%",
      center: false,
      cell: (row, index) =>
        row.item_category === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              // value={row.commission}
              value={
                myCommissionValueTotalValue
                  ? myCommissionValueTotalValue
                  : row.commission
              }
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`commission-${index}`}
              name={`data[${index}].commission`}
              className={"table-input readonly "}
              value={
                formik.values.data[index]?.commission
                  ?.toString()
                  .match(/^-?\d+(?:\.\d{0,2})?/)[0]
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={true}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    ...(editable?.is_file || editable?.is_upload_file
      ? [
        {
          name: "Invoices",
          selector: (row) => row.file,
          sortable: false,
          width: "9.5%",
          center: false,
          cell: (row,) => {
            if (row.item_category === "Total") {
              return null;
            }
            return (
              <div>
                {/* {is_uploadfile && ( */}
                <>
                  <div onClick={() => handleInvoiceModal(row)}>
                    <i
                      className="fa fa-upload btn btn-sm btn-primary"
                      aria-hidden="true"
                    />
                  </div>
                </>

              </div>
            );
          },
        },
      ]
      : []),
  ];



  // Conditionally push the "ADJUSTMENT VALUE" column if `editable?.is_adjustable` is true
  if (editable?.is_adjustable) {
    columns?.push({
      name: "ADJUSTMENT VALUE",
      selector: (row) => row.adj_value,
      sortable: false,
      width: "7",
      center: false,
      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row?.adj_value}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`adj_value-${index}`}
              name={`data[${index}].adj_value`}
              className={`table-input ${!row?.edit_adj_value ? 'readonly' : ''}`}
              value={formik.values?.data?.[index]?.adj_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={!row?.edit_adj_value}
            />
          </div>
        ),
    });
  }


  const formik = useFormik({
    initialValues: {
      data: data,
    },
    onSubmit: handleSubmit,
    // validationSchema: validationSchema,
  });

  const calculateTotalValues = () => {
    // Initialize total values
    let totalSale = 0;
    let totalCommission = 0;
    let totalValuesValue = 0;

    // Iterate through the data array and sum up sale and commission values
    for (let i = 0; i < formik?.values?.data?.length - 1; i++) {
      const item = formik?.values?.data[i];
      if (item.sale) {
        totalSale += parseFloat(item.sale);
      }
      if (item.commission) {
        totalCommission += parseFloat(item.commission);
      }
      if (item.value) {
        totalValuesValue += parseFloat(item.value);
      }
    }

    setMySalesTotalValue(
      totalSale?.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
    );
    // setMyCommissionValueTotalValue(totalCommission.toFixed(2));
    setMyCommissionValueTotalValue(
      totalCommission?.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
    );

    setMyValuesTotalValue(
      totalValuesValue.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
    );
  };

  useEffect(() => {
    calculateTotalValues();
  }, [formik.values]);

  const calculateSum = async (index) => {
    const closingAmount = Number(formik?.values?.data?.[index]?.closing);
    const openingAmount = Number(formik?.values?.data?.[index]?.opening);
    const saleAmount = Number(formik?.values?.data?.[index]?.sale);
    const priceAmount = Number(formik?.values?.data?.[index]?.price);
    const comrate = Number(formik?.values?.data?.[index]?.com_rate);
    const formiktests = Number(formik?.values?.data?.[index]?.tests);
    const formikadjust = Number(formik?.values?.data?.[index]?.adjust);

    if (
      !isNaN(closingAmount) &&
      !isNaN(saleAmount) &&
      !isNaN(priceAmount) &&
      !isNaN(comrate) &&
      !isNaN(formiktests) &&
      !isNaN(formikadjust) &&
      !isNaN(openingAmount)
    ) {
      const TotalAmountValue = openingAmount + formiktests + formikadjust;

      const SaleAmounts = closingAmount - TotalAmountValue;
      const ValueAmount = SaleAmounts * priceAmount;
      const comrateAmount = (ValueAmount * comrate) / 100;

      const sale = SaleAmounts.toFixed(2);
      const value = ValueAmount.toFixed(2);
      const commission = comrateAmount.toFixed(2);

      await Promise.all([
        formik.setFieldValue(`data[${index}].sale`, sale),
        formik.setFieldValue(`data[${index}].value`, value),
        formik.setFieldValue(`data[${index}].commission`, commission),
      ]);
    } else {
      console.error("Invalid or missing numeric values");
    }
  };

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        {

          <CoffeeAndValetUploadInvoice
            showModal={showModal}
            setShowModal={setShowModal}
            invoiceCallData={invoiceCallData}
          />
        }

        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Coffee & Valet Sales</h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <form onSubmit={formik.handleSubmit}>
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
                          searchable={false}
                        />
                      </div>

                      <div className="d-flex justify-content-end mt-3">
                        {editable?.is_editable && editable?.is_submittable ? (
                          <button className="btn btn-primary" type="submit">
                            Submit
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={true}
                          >
                            Submit
                          </button>
                        )}


                      </div>
                      {editable?.is_show_message ? (
                        <span className="text-error">
                          *Please Upload Invoices for All Items
                        </span>
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

export default CoffeeValet;
