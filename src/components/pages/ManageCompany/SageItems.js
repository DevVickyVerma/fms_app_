import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { Slide, toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

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


  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  const columns = [
    {
      name: "ITEMS",
      selector: (row) => row.name,
      sortable: false,
      width: "33.2%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.name !== undefined ? `${row.name}` : ""}
        </span>
      ),
    },

    {
      name: "Sage Sale Code",

      selector: (row) => row.sage_sale_code,
      sortable: false,
      width: "33.2%",
      center: true,

      cell: (row, index) =>
        row.name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row.sage_sale_code}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`sage_sale_code-${index}`}
              name={`data[${index}].sage_sale_code`}
              className={"table-input "}
              value={formik.values.data[index]?.sage_sale_code}
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
      width: "33.8%",
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
    // {
    //     name: "Positive Nominal Type",
    //     selector: (row) => row.positive_nominal_type_id,
    //     sortable: false,
    //     width: "14.4%",
    //     center: true,

    //     cell: (row, index) =>
    //         row.name === "Total" ? (
    //             <div>
    //                 <input
    //                     type="number"
    //                     className={"table-input readonly"}

    //                     value={row.positive_nominal_type_id}
    //                     readOnly
    //                 />
    //             </div>
    //         ) : (
    //             <div>
    //                 <select
    //                     name={`data[${index}].positive_nominal_type_id`}
    //                     value={formik.values.data[index]?.positive_nominal_type_id}
    //                     onChange={(e) => handlePositiveNominalData(index, e.target.value)}
    //                     onBlur={formik.handleBlur}
    //                     className="w-100"
    //                     style={{ height: "36px" }}
    //                 >
    //                     <option value="" className="table-input ">
    //                         Select Positive Nominal Type Data
    //                     </option>
    //                     {typesData?.map((SingleType) => (
    //                         <option
    //                             key={SingleType.id}
    //                             value={SingleType.id}
    //                             className="table-input "
    //                         >
    //                             {SingleType.name}
    //                         </option>
    //                     ))}
    //                 </select>
    //             </div>
    //         ),
    // },
    // {
    //     name: "Negative Nominal Type",
    //     selector: (row) => row.negative_nominal_type_id,
    //     sortable: false,
    //     width: "14.4%",
    //     center: true,

    //     cell: (row, index) =>
    //         row.name === "Total" ? (
    //             <div>
    //                 <input
    //                     type="number"
    //                     className={"table-input readonly"}
    //                     value={row.negative_nominal_type_id}
    //                     readOnly
    //                 />
    //             </div>
    //         ) : (
    //             <div>
    //                 <select

    //                     name={`data[${index}].negative_nominal_type_id`}
    //                     value={formik.values.data[index]?.negative_nominal_type_id}
    //                     onChange={(e) => handleNegativeNominalData(index, e.target.value)}
    //                     onBlur={formik.handleBlur}
    //                     className="w-100"
    //                     style={{ height: "36px" }}
    //                 >
    //                     <option value="" className="table-input ">
    //                         Select Negative Nominal Type
    //                     </option>
    //                     {typesData?.map((SingleType) => (
    //                         <option
    //                             key={SingleType.id}
    //                             value={SingleType.id}
    //                             className="table-input "
    //                         >
    //                             {SingleType.name}
    //                         </option>
    //                     ))}
    //                 </select>
    //                 {/* Error handling code */}
    //             </div>
    //         ),
    // },
    // {
    //     name: "Nominal Tax Code",
    //     selector: (row) => row.nominal_tax_code_id,
    //     sortable: false,
    //     width: "14.6%",
    //     center: true,

    //     cell: (row, index) =>
    //         row.name === "Total" ? (
    //             <div>
    //                 <input
    //                     type="number"
    //                     className={"table-input readonly"}
    //                     value={row.nominal_tax_code_id}
    //                     readOnly
    //                 />
    //             </div>
    //         ) : (
    //             <div className=" w-100">
    //                 <select

    //                     name={`data[${index}].nominal_tax_code_id`}
    //                     value={formik.values.data[index]?.nominal_tax_code_id}
    //                     onChange={(e) => handleTaxCodeData(index, e.target.value)}
    //                     onBlur={formik.handleBlur}
    //                     className="w-100"
    //                     style={{ height: "36px" }}
    //                 >
    //                     <option value="" className="table-input ">
    //                         Select Nominal Tax Code
    //                     </option>
    //                     {taxCodes?.map((SingleType) => (
    //                         <option
    //                             key={SingleType.id}
    //                             value={SingleType.id}
    //                             className="table-input "
    //                         >
    //                             {SingleType.name}
    //                         </option>
    //                     ))}
    //                 </select>

    //                 {/* Error handling code */}
    //             </div>
    //         ),
    // },

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
    },
  });

  const handleSubmit1 = async (values) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    for (const obj of values.data) {
      const {
        id,

        sage_sale_code,
        sage_purchage_code,
      } = obj;
      const sage_sale_codeKey = `sage_sale_code[${id}]`;
      const sage_purchage_codeKey = `sage_purchage_code[${id}]`;

      formData.append(sage_sale_codeKey, sage_sale_code);
      formData.append(sage_purchage_codeKey, sage_purchage_code);
    }
    formData.append("company_id", id?.id);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/company/update-sage-items`,
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
        navigate("/managecompany");
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

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Manage Sage Items</h1>
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
                linkProps={{ to: "/managecompany" }}
              >
                Manage Company
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Manage Sage Items
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Manage Sage Items</h3>
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
                      src={require("../../../assets/images/noDataFoundImage/noDataFound.png")}
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
