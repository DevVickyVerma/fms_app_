import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import {
  ErrorAlert,
  SuccessAlert,
  handleError,
} from "../../../Utils/ToastUtils";

const ShopSales = (props) => {
  const { company_id, client_id, site_id, start_date, sendDataToParent } =
    props;

  const handleButtonClick = () => {
    const allPropsData = { company_id, client_id, site_id, start_date };
    sendDataToParent(allPropsData);
  };

  const [data, setData] = useState([]);
  const [DeductionData, setDeductionData] = useState([]);
  const [editable, setis_editable] = useState();
  const [isLoading, setIsLoading] = useState(true);

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
        `/shop-sale/list?site_id=${site_id}&drs_date=${start_date}`
      );

      const { data } = response;
      if (data) {
        setData(data?.data ? data.data.charges : []);
        setDeductionData(data?.data ? data.data.deductions : []);
        setis_editable(data?.data ? data.data : {});

        // Create an array of form values based on the response data
        const formValues = data?.data?.charges
          ? data.data.charges.map((item) => ({
              id: item.id,
              charge_value: item.charge_value,
            }))
          : [];

        // Set the formik values using setFieldValue
        formik.setFieldValue("data", formValues);

        const deductionFormValues = data?.data?.deductions
          ? data.data.deductions.map((item) => ({
              id: item.id,
              deduction_value: item.deduction_value,
            }))
          : [];

        // Set the formik values for deductions using setFieldValue
        formik.setFieldValue("deductions", deductionFormValues);
      }
    } catch (error) {
      console.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [site_id, start_date]);

  const handleSubmit = async (values, deductionFormValues) => {
    const token = localStorage.getItem("token");

    // Create a new FormData object
    const formData = new FormData();

    for (const obj of values.data) {
      const { id, charge_value } = obj;
      const charge_valueKey = `charge[${id}]`;

      formData.append(charge_valueKey, charge_value);
    }

    for (const deductionObj of values.deductions) {
      const { id, deduction_value } = deductionObj;
      const deductionValueKey = `deduction[${id}]`;

      formData.append(deductionValueKey, deduction_value);
    }

    formData.append("site_id", site_id);
    formData.append("drs_date", start_date);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/shop-sale/update`,
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
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        ErrorAlert(responseData.message);

        // Handle specific error cases if needed
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event, index, row, type) => {
    const file = event.target.files[0];
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("site_id", site_id);
    formData.append("drs_date", start_date);
    formData.append("type", row.type);
    formData.append("id", row.id);
    formData.append("file", file);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/shop-sale/upload-file`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        SuccessAlert(responseData.message);
        if (type === "charge") {
          const updatedData = [...data];
          updatedData[index] = {
            ...updatedData[index],
            file: responseData?.data?.file,
          };
          setData(updatedData);
        } else {
          const updatedData = [...DeductionData];
          updatedData[index] = {
            ...updatedData[index],
            file: responseData?.data?.file,
          };
          setDeductionData(updatedData);
        }
      } else {
        ErrorAlert(responseData.message);
      }
    } catch (error) {
      console.log("Request Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      data: [],
      deductions: [],
    },
    onSubmit: handleSubmit,
  });

  const chargesColumns = [
    {
      name: "CHARGE GROUPS",
      width: "40%",
      selector: (row) => row.charge_name,
      sortable: true,
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.charge_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "SALES AMOUNT",
      selector: (row) => row.charge_value,
      sortable: false,
      width: "40%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`charge_value-${index}`}
            name={`data[${index}].charge_value`}
            className={
              row.is_field_editable
                ? row.is_record_modified === 1
                  ? "table-input table-inputRed"
                  : "table-input"
                : "table-input readonly"
            }
            value={formik.values?.data[index]?.charge_value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={!row.is_field_editable}
          />
        </div>
      ),
    },
    editable?.is_charge_file || editable?.is_upload_file
      ? {
          name: "Invoices",
          selector: (row) => row.file,
          sortable: false,
          width: "20%",
          center: true,
          cell: (row, index) => {
            if (row.item_category === "Total") {
              return null;
            }
            const hasFile = row.file && row.file.trim() !== "";
            const is_uploadfile = editable?.is_upload_file;
            return (
              <div>
                {is_uploadfile && (
                  <label
                    htmlFor={`file-charge-${index}`}
                    className="file-upload-icon"
                  >
                    <i
                      className="fa fa-upload btn btn-sm btn-primary"
                      aria-hidden="true"
                    ></i>
                    <input
                      type="file"
                      id={`file-charge-${index}`}
                      name={`data[${index}].file`}
                      className="table-input visually-hidden"
                      onChange={(e) =>
                        handleFileChange(e, index, row, "charge")
                      }
                      title="Choose a file to upload"
                    />
                  </label>
                )}
                {hasFile && (
                  <a
                    href={row.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View image"
                  >
                    <span>
                      <i
                        className="fa fa-file-image-o btn btn-sm btn-info ms-2"
                        aria-hidden="true"
                      ></i>
                    </span>
                  </a>
                )}
              </div>
            );
          },
        }
      : {},
  ];

  const deductionsColumns = [
    {
      name: "DEDUCTION GROUPS",
      selector: (row) => row.deduction_name,
      sortable: true,
      center: false,
      width: "40%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.deduction_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "SALES AMOUNT",
      selector: (row) => row.deduction_value,
      sortable: false,
      width: "40%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`deduction_value-${index}`}
            name={`deductions[${index}].deduction_value`}
            className={
              row.is_field_editable
                ? row.is_record_modified === 1
                  ? "table-input table-inputRed"
                  : "table-input"
                : "table-input readonly"
            }
            value={formik.values?.deductions[index]?.deduction_value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={!row.is_field_editable}
          />
        </div>
      ),
    },
    editable?.is_charge_file || editable?.is_upload_file
      ? {
          name: "Invoices",
          selector: (row) => row.file,
          sortable: false,
          width: "20%",
          center: true,
          cell: (row, index) => {
            const hasFile = row.file && row.file.trim() !== "";
            const is_uploadfile = editable?.is_upload_file;
            return (
              <div>
                {is_uploadfile && (
                  <label
                    htmlFor={`file-deduction-${index}`}
                    className="file-upload-icon"
                  >
                    <i
                      className="fa fa-upload btn btn-sm btn-primary"
                      aria-hidden="true"
                    ></i>
                    <input
                      type="file"
                      id={`file-deduction-${index}`}
                      name={`deductions[${index}].file`}
                      className="table-input visually-hidden"
                      onChange={(e) =>
                        handleFileChange(e, index, row, "deduction")
                      }
                      title="Choose a file to upload"
                    />
                  </label>
                )}
                {hasFile && (
                  <a
                    href={row.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View image"
                  >
                    <span>
                      <i
                        className="fa fa-file-image-o btn btn-sm btn-info ms-2"
                        aria-hidden="true"
                      ></i>
                    </span>
                  </a>
                )}
              </div>
            );
          },
        }
      : {},
  ];

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Charges</Card.Title>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="table-responsive deleted-table">
                        <Row>
                          <Col lg={6} md={6}>
                            <DataTable
                              columns={chargesColumns}
                              data={data}
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
                          <Col lg={6} md={6}>
                            <DataTable
                              columns={deductionsColumns}
                              data={DeductionData}
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
                        </Row>
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

export default ShopSales;
