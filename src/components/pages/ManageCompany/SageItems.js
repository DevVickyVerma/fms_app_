import React from "react";
import { useEffect, useState } from 'react';
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
import LoaderImg from "../../../Utils/Loader";
import { useSelector } from "react-redux";

const CompanySageFuels = ({ getData }) => {
  const id = useParams();

  const UserPermissions = useSelector(
    (state) => state?.data?.data?.permissions || [],
  );
  const isUpdatePermissionAvailable = UserPermissions?.includes('company-sage-config');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  useEffect(() => {
    FetchSubCategoryList()
  }, [])


  const FetchSubCategoryList = async () => {
    try {
      const response = await getData(`/company/sage-items/${id?.id}`);


      if (response && response.data) {
        formik.setFieldValue("data", response?.data?.data?.items)
        setData(response?.data?.data?.items);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const columns = [
    {
      name: "ITEMS",
      selector: (row) => row.name,
      sortable: false,
      width: "40%",
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
      width: "30%",
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
      width: "30%",
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
        SuccessAlert(responseData.message);
        navigate("/managecompany");
      } else {
        ErrorAlert(responseData.message);
      }
    } catch (error) {
      console.error("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {isLoading ? <LoaderImg /> : null}
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
                      </div>

                      <Card.Footer className="text-end">
                        {isUpdatePermissionAvailable && (<>
                          <button className="btn btn-primary me-2" type="submit">
                            Save
                          </button>
                        </>)}

                      </Card.Footer>
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

export default withApi(CompanySageFuels);
