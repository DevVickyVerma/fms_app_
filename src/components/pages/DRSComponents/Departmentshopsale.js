import { useEffect, useState } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, handleError, SuccessAlert } from "../../../Utils/ToastUtils";

const Departmentshopsale = (props) => {
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
        const response = await axiosInstance.get(
          `/department-shop-sale/list?site_id=${site_id}&drs_date=${start_date}`
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
        setIsLoading(false);
      }
    };

    fetchData();
  }, [site_id, start_date]);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });
  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    for (const obj of values.data) {
      const {
        id,
        gross_value,
        disc_value,
        nett_value,
        adj_value,
      } = obj;
      const gross_valueKey = `gross_value[${id}]`;
      const discountKey = `disc_value[${id}]`;
      const nettValueKey = `nett_value[${id}]`;
      const adjValueKey = `adj_value[${id}]`;


      if (id) {
        formData.append(gross_valueKey, gross_value);
        formData.append(discountKey, disc_value);
        formData.append(nettValueKey, nett_value);
        formData.append(adjValueKey, adj_value);
      }
    }

    formData.append("site_id", site_id);
    formData.append("drs_date", start_date);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/department-shop-sale/update`,
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
        handleButtonClick();
        SuccessAlert(responseData.message);
      } else {
        ErrorAlert(responseData.message);
      }
    } catch (error) {
      handleError(error)
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };
  const columns = [

    {
      name: "ITEM NAME",
      selector: (row) => row.category_name,
      sortable: false,
      width: editable?.is_adjustable ? "20%" : "25%",
      center: false,
      cell: (row) => (
        <span className="text-muted coffe-item-category fw-semibold text-center">
          {row.category_name !== undefined ? `${row.category_name}` : ""}
        </span>
      ),
    },
    {
      name: "	GROSS VALUE",
      selector: (row) => row.gross_value,
      sortable: false,
      width: editable?.is_adjustable ? "20%" : "25%",
      center: true,

      cell: (row, index) =>
        row.category_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.gross_value}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`gross_value-${index}`}
              name={`data[${index}].gross_value`}
              value={formik.values.data[index]?.gross_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input ${row.update_gross_value ? 'UpdateValueInput' : ''} ${!row?.edit_gross_value ? 'readonly' : ''}`}
              readOnly={!row?.edit_gross_value}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "	DISC VALUE ",
      selector: (row) => row.disc_value,
      sortable: false,
      width: editable?.is_adjustable ? "20%" : "25%",
      center: true,

      cell: (row, index) =>
        row.category_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.disc_value}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`disc_value-${index}`}
              name={`data[${index}].disc_value`}
              value={formik.values.data[index]?.disc_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input ${row.update_disc_value ? 'UpdateValueInput' : ''} ${!row?.edit_disc_value ? 'readonly' : ''}`}
              readOnly={!row?.edit_disc_value}
            />
          </div>
        ),
    },
    {
      name: "	NETT VALUE",
      selector: (row) => row.nett_value,
      sortable: false,
      width: editable?.is_adjustable ? "20%" : "25%",
      center: true,

      cell: (row, index) =>
        row.category_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.nett_value}
              readOnly={true}
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`nett_value-${index}`}
              name={`data[${index}].nett_value`}
              value={formik.values.data[index]?.nett_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input ${row.update_nett_value ? 'UpdateValueInput' : ''} ${!row?.edit_nett_value ? 'readonly' : ''}`}
              readOnly={!row?.edit_nett_value}
            />
          </div>
        ),
    },
  ];



  // Conditionally push the "ADJUSTMENT VALUE" column if `editable?.is_adjustable` is true
  if (editable?.is_adjustable) {
    columns?.push({
      name: "ADJUSTMENT VALUE",
      selector: (row) => row.adj_value,
      sortable: false,
      width: "20%",
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
  });



  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Department Shop Sales</h3>
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

                      {data?.length > 0 ? (
                        <div className="d-flex justify-content-end mt-3">

                          {editable?.is_editable && (
                            <button className="btn btn-primary" type="submit">
                              Submit
                            </button>
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

export default Departmentshopsale;
