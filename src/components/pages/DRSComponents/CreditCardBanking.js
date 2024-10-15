import { useEffect, useState } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, handleError, SuccessAlert } from "../../../Utils/ToastUtils";

const CreditCardBanking = (props) => {
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
  const [editable, setis_editable] = useState();
  const [isLoading, setIsLoading] = useState(true);


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
        setIsLoading(true); // Set loading state to true before fetching data

        const response = await axiosInstance.get(
          `/card-banking/list?site_id=${site_id}&drs_date=${start_date}`
        );

        const { data } = response;

        if (data) {
          setData(data?.data?.listing);
          setis_editable(data?.data);


          if (data?.data?.listing) {
            // formik.setValues(data?.data?.listing)
            formik.setFieldValue("data", data?.data?.listing);
          }

        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false); // Set loading state to false after data fetching is complete
      }
    };

    if (start_date) {
      fetchData();
    }
  }, [site_id, start_date]);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    // Create a new FormData object
    const formData = new FormData();

    values.data.forEach((obj) => {
      const id = obj?.id;
      const grossValueKey = `opt_value[${id}]`;
      const account_valueKey = `account_value[${id}]`;
      const nettValueKey = `no_of_transactions[${id}]`;
      const koisk_value = `koisk_value[${id}]`;
      const adj_valueKey = `adj_value[${id}]`;
      // const actionKey = `action[${id}]`;

      const grossValue = obj.opt_value;
      const account_value = obj.account_value;
      const nettValue = obj.no_of_transactions;
      const adj_value = obj.adj_value;
      const salesValue = obj.koisk_value;
      // const action = obj.action;

      if (id) {
        formData.append(grossValueKey, grossValue);
        formData.append(account_valueKey, account_value);
        formData.append(nettValueKey, nettValue);
        formData.append(adj_valueKey, adj_value);
        formData.append(koisk_value, salesValue);
      }
    });

    formData.append("site_id", site_id);
    formData.append("drs_date", start_date);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/card-banking/update`,
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
        window.scrollTo({ top: 0, behavior: "smooth" });
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

  const columns = [
    // ... existing columns

    {
      name: "Card Name",
      selector: (row) => row.card_name,
      sortable: false,
      width: "20%",
      center: false,
      cell: (row) => (
        <span className="text-muted coffe-item-category fw-semibold text-center">
          {row.card_name !== undefined ? `${row.card_name}` : ""}
        </span>
      ),
    },
    {
      name: "KOISK VALUE",
      selector: (row) => row.koisk_value,
      sortable: false,
      width: editable?.is_adjustable ? "16%" : "20%",
      center: true,

      cell: (row, index) =>
        row.card_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.koisk_value}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`koisk_value-${index}`}
              name={`data[${index}].koisk_value`}
              value={formik.values.data[index]?.koisk_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input ${row?.update_koisk_value ? 'UpdateValueInput' : ''} ${!row?.edit_koisk_value ? 'readonly' : ''}`}
              readOnly={!row?.edit_koisk_value}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "OPT VALUE",

      selector: (row) => row.opt_value,
      sortable: false,
      width: editable?.is_adjustable ? "16%" : "20%",
      center: true,

      cell: (row, index) =>
        row.card_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.opt_value}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`opt_value-${index}`}
              name={`data[${index}].opt_value`}

              value={formik.values.data[index]?.opt_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input ${row?.update_opt_value ? 'UpdateValueInput' : ''} ${!row?.edit_opt_value ? 'readonly' : ''}`}
              readOnly={!row?.edit_opt_value}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "ACCOUNT VALUE	",
      selector: (row) => row.account_value,
      sortable: false,
      width: editable?.is_adjustable ? "16%" : "20%",
      center: true,

      cell: (row, index) =>
        row.card_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.account_value}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`account_value-${index}`}
              name={`data[${index}].account_value`}

              value={formik.values.data[index]?.account_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input ${row.update_account_value ? 'UpdateValueInput' : ''} ${!row?.edit_account_value ? 'readonly' : ''}`}
              readOnly={!row?.edit_account_value}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "NO. OF TRANSACTIONS",
      selector: (row) => row.no_of_transactions,
      sortable: false,
      width: editable?.is_adjustable ? "16%" : "20%",
      center: true,

      cell: (row, index) =>
        row.card_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.no_of_transactions}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`no_of_transactions-${index}`}
              name={`data[${index}].no_of_transactions`}
              value={formik.values.data[index]?.no_of_transactions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input ${row.update_no_of_transactions ? 'UpdateValueInput' : ''} ${!row?.update_no_of_transactions ? 'readonly' : ''}`}
              readOnly={!row?.update_no_of_transactions}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];


  // Conditionally push the "ADJUSTMENT VALUE" column if `editable?.is_adjustable` is true
  if (editable?.is_adjustable) {
    columns?.push({
      name: "ADJUSTMENT VALUE",
      selector: (row) => row.adj_value,
      sortable: false,
      width: "16%",
      center: true,
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

  document.addEventListener("keydown", (event) => {
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
                <h3 className="card-title"> Credit Card Banking</h3>
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
                        {editable?.is_editable && (
                          <button className="btn btn-primary" type="submit">
                            Submit
                          </button>
                        )}
                      </div>
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

export default CreditCardBanking;
