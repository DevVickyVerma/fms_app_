import { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
import useErrorHandler from "../../CommonComponent/useErrorHandler";
import withApi from "../../../Utils/ApiHelper";

const CompanySageOtherCodes = ({ getData }) => {
  const urlId = useParams();
  const [data, setData] = useState([]);
  const [nominalCodesData, setNominalCodesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { handleError } = useErrorHandler();
  const formik = useFormik({
    initialValues: {
      data: data,
    },
    onSubmit: (values) => {
      handleSubmit1(values);
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true); // Set loading state to true before fetching data

      const response = await getData(`company/sage-other-codes/${urlId?.id}`);

      const { data } = response;
      if (data) {
        setData(data?.data?.codes);
        setNominalCodesData(data?.data?.nominal_codes);
        // setis_editable(data.data);

        // Create an array of form values based on the response data
        const formValues = data?.data?.codes?.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          nominal_code: item.nominal_code,
        }));
        // Set the formik values using setFieldValue
        formik.setFieldValue("data", formValues);
      }
    } catch (error) {
      console?.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false); // Set loading state to false after data fetching is complete
    }
  };

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  const options = nominalCodesData?.map((nominalCode) => ({
    label: nominalCode.name,
    value: nominalCode.id,
  }));

  const columns = [
    {
      name: "Sage Name",
      selector: (row) => row.name,
      sortable: false,
      width: "50%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.name !== undefined ? `${row.name}` : ""}
        </span>
      ),
    },
    {
      name: "Nominal Codes",
      selector: (row) => row.nominal_codes,
      sortable: false,
      width: "50%",
      center: false,

      cell: (row, index) => (
        <div className="company-sage-other-code-table-container">
          <MultiSelect
            value={options.filter((option) =>
              formik.values.data[index]?.nominal_code?.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              handleNominalCodeChange(index, selectedOptions)
            }
            labelledBy="Select Sites"
            // disableSearch="true"
            options={options}
            showCheckbox="false"
          />
        </div>
      ),
    },
  ];

  const handleNominalCodeChange = (index, selectedOptions) => {
    // Create a copy of the formik values
    const updatedData = [...formik.values.data];

    // Update the nominal_code for the specific row (index)
    updatedData[index].nominal_code = selectedOptions.map(
      (option) => option.value
    );

    // Set the updated data back to formik values
    formik.setFieldValue("data", updatedData);
  };

  const handleSubmit1 = async (values) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    for (const obj of values.data) {
      const { slug, nominal_code } = obj;
      const slugKey = `${slug}`;
      for (let i = 0; i < nominal_code.length; i++) {
        const singleNominalCode = nominal_code[i];
        formData.append(`${slugKey}[${i}]`, singleNominalCode);
      }
    }

    formData.append("company_id", urlId.id);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/company/update-other-codes`,
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
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Sage Other Code</h1>
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
                Manage Companies
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Sage Other Code
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Sage Other Code</h3>
              </Card.Header>
              {data?.length > 0 ? (
                <>
                  <form onSubmit={(event) => formik.handleSubmit(event)}>
                    <Card.Body>
                      <Row>
                        <div className="table-responsive deleted-table mobile-first-table">
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
                      </Row>
                    </Card.Body>
                    <Row>
                      <Card.Footer>
                        <div className="d-flex justify-content-end">
                          <button className="btn btn-primary" type="submit">
                            Update
                          </button>
                        </div>
                      </Card.Footer>
                    </Row>
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
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default withApi(CompanySageOtherCodes);
