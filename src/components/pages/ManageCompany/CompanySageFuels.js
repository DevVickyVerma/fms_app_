import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { Slide, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const CompanySageFuels = (props) => {
  const id = useParams();

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [taxCodes, setTaxCodes] = useState([]);
  const [typesData, setTypesData] = useState([]);

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

      const response = await axiosInstance.get(`/company/sage-fuels/${id?.id}`);

      const { data } = response;
      if (data) {
        setData(data.data.fuels);
        setTaxCodes(data.data.taxCodes);
        setTypesData(data.data.types);
        setis_editable(data.data);

        // Create an array of form values based on the response data
        const formValues = data.data.fuels.map((item) => {
          return {
            id: item.id || "",
            name: item.name || "",
            negative_nominal_type_id: item.negative_nominal_type_id || "",
            nominal_tax_code_id: item.nominal_tax_code_id || "",
            positive_nominal_type_id: item.positive_nominal_type_id || "",
            sage_account_code: item.sage_account_code || "",
            sage_nominal_code: item.sage_nominal_code || "",
            sage_purchage_code: item.sage_purchage_code || "",
          };
        });
        // Set the formik values using setFieldValue
        formik.setFieldValue("data", formValues);
      }
    } catch (error) {
      console.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false); // Set loading state to false after data fetching is complete
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  const handlePositiveNominalData = (index, newValue) => {
    // Update the positive_nominal_type_id of the object at the specified index
    const updatedData = [...formik.values.data]; // Create a copy of the data array
    updatedData[index].positive_nominal_type_id = newValue; // Update the specific value
    formik.setFieldValue("data", updatedData); // Update the data array in Formik
  };
  const handleNegativeNominalData = (index, newValue) => {
    // Update the negative_nominal_type_id of the object at the specified index
    const updatedData = [...formik.values.data]; // Create a copy of the data array
    updatedData[index].negative_nominal_type_id = newValue; // Update the specific value
    formik.setFieldValue("data", updatedData); // Update the data array in Formik
  };
  const handleTaxCodeData = (index, newValue) => {
    // Update the nominal_tax_code_id of the object at the specified index
    const updatedData = [...formik.values.data]; // Create a copy of the data array
    updatedData[index].nominal_tax_code_id = newValue; // Update the specific value
    formik.setFieldValue("data", updatedData); // Update the data array in Formik
  };

  const columns = [
    {
      name: "FUEL",
      selector: (row) => row.name,
      sortable: false,
      width: "14.2%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.name !== undefined ? `${row.name}` : ""}
        </span>
      ),
    },
    {
      name: "Sage Account Code",
      selector: (row) => row.sage_account_code,
      sortable: false,
      width: "14.2%",
      center: true,

      cell: (row, index) =>
        row.name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row.sage_account_code}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`sage_account_code-${index}`}
              name={`data[${index}].sage_account_code`}
              className={"table-input "}
              value={formik.values.data[index]?.sage_account_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "Sage Nominal Code",

      selector: (row) => row.sage_nominal_code,
      sortable: false,
      width: "14.2%",
      center: true,

      cell: (row, index) =>
        row.name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row.sage_nominal_code}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`sage_nominal_code-${index}`}
              name={`data[${index}].sage_nominal_code`}
              className={"table-input "}
              value={formik.values.data[index]?.sage_nominal_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "Sage Purchage Code",
      selector: (row) => row.sage_purchage_code,
      sortable: false,
      width: "14.2%",
      center: true,

      cell: (row, index) =>
        row.name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row.sage_purchage_code}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`sage_purchage_code-${index}`}
              name={`data[${index}].sage_purchage_code`}
              className={"table-input"}
              value={formik.values.data[index]?.sage_purchage_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "Positive Nominal Type",
      selector: (row) => row.positive_nominal_type_id,
      sortable: false,
      width: "14.4%",
      center: true,

      cell: (row, index) =>
        row.name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              
              value={row.positive_nominal_type_id}
              readOnly
            />
          </div>
        ) : (
          <div>
            <select
              name={`data[${index}].positive_nominal_type_id`}
              value={formik.values.data[index]?.positive_nominal_type_id}
              onChange={(e) => handlePositiveNominalData(index, e.target.value)}
              onBlur={formik.handleBlur}
              className="w-100"
              style={{ height: "36px" }}
            >
              <option value="" className="table-input ">
                Select Positive Nominal Type Data
              </option>
              {typesData?.map((SingleType) => (
                <option
                  key={SingleType.id}
                  value={SingleType.id}
                  className="table-input "
                >
                  {SingleType.name}
                </option>
              ))}
            </select>
          </div>
        ),
    },
    {
      name: "Negative Nominal Type",
      selector: (row) => row.negative_nominal_type_id,
      sortable: false,
      width: "14.4%",
      center: true,

      cell: (row, index) =>
        row.name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row.negative_nominal_type_id}
              readOnly
            />
          </div>
        ) : (
          <div>
            <select
          
              name={`data[${index}].negative_nominal_type_id`}
              value={formik.values.data[index]?.negative_nominal_type_id}
              onChange={(e) => handleNegativeNominalData(index, e.target.value)}
              onBlur={formik.handleBlur}
              className="w-100"
              style={{ height: "36px" }}
            >
              <option value="" className="table-input ">
                Select Negative Nominal Type
              </option>
              {typesData?.map((SingleType) => (
                <option
                  key={SingleType.id}
                  value={SingleType.id}
                  className="table-input "
                >
                  {SingleType.name}
                </option>
              ))}
            </select>
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "Nominal Tax Code",
      selector: (row) => row.nominal_tax_code_id,
      sortable: false,
      width: "14.6%",
      center: true,

      cell: (row, index) =>
        row.name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row.nominal_tax_code_id}
              readOnly
            />
          </div>
        ) : (
          <div className=" w-100">
            <select
          
              name={`data[${index}].nominal_tax_code_id`}
              value={formik.values.data[index]?.nominal_tax_code_id}
              onChange={(e) => handleTaxCodeData(index, e.target.value)}
              onBlur={formik.handleBlur}
              className="w-100"
              style={{ height: "36px" }}
            >
              <option value="" className="table-input ">
                Select Nominal Tax Code
              </option>
              {taxCodes?.map((SingleType) => (
                <option
                  key={SingleType.id}
                  value={SingleType.id}
                  className="table-input "
                >
                  {SingleType.name}
                </option>
              ))}
            </select>

            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];

  const tableDatas = {
    columns,
    data,
  };

  const formik = useFormik({
    initialValues: {
      data: data,
    },
    onSubmit: (values) => {
      handleSubmit1(values);
      // console.log(values, "zxczxc");
    },
    // onSubmit: (SubmitFuelSalesForm),
    // validationSchema: validationSchema,
  });

  const handleSubmit1 = async (values) => {
    console.log(values, "handleSubmit1");
    const token = localStorage.getItem("token");

    const formData = new FormData();

    for (const obj of values.data) {
      const {
        id,
        negative_nominal_type_id,
        nominal_tax_code_id,
        positive_nominal_type_id,
        sage_account_code,
        sage_nominal_code,
        sage_purchage_code,
      } = obj;
      const gross_valueKey = `negative_nominal_type_id[${id}]`;
      const discountKey = `nominal_tax_code_id[${id}]`;
      const nettValueKey = `positive_nominal_type_id[${id}]`;
      const sage_account_codenettValueKey = `sage_account_code[${id}]`;
      const sage_nominal_codenettValueKey = `sage_nominal_code[${id}]`;
      const sage_purchage_codeValueKey = `sage_purchage_code[${id}]`;

      formData.append(gross_valueKey, negative_nominal_type_id);
      formData.append(discountKey, nominal_tax_code_id);
      formData.append(nettValueKey, positive_nominal_type_id);
      formData.append(sage_account_codenettValueKey, sage_account_code);
      formData.append(sage_nominal_codenettValueKey, sage_nominal_code);
      formData.append(sage_purchage_codeValueKey, sage_purchage_code);
    }
    formData.append("company_id", id?.id);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/company/update-config`,
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
        SuccessToast(responseData.message);
      } else {
        ErrorToast(responseData.message);
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("formikvakuye", formik?.values)

  return (
    <>
      {/* {isLoading ? <Loaderimg /> : null} */}
      <>
        <div className="page-header d-flex">
          <div>
            <h1 className="page-title ">Manage Sage</h1>

            <Breadcrumb className="breadcrumb breadcrumb-subheader">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item  breadcrumds"
                aria-current="page"
              >
                Manage Companies
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Manage Sage
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Sage</h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <form
                      onSubmit={(event) => formik.handleSubmit(event)}
                      // onSubmit={formik.SubmitFuelSalesForm}
                    >
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

                      <Card.Footer className="text-end">
                        <button className="btn btn-primary me-2" type="submit">
                          Save
                        </button>
                      </Card.Footer>
                    </form>
                  </>
                ) : (
                  <>
                    <img
                      src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
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

export default CompanySageFuels;
