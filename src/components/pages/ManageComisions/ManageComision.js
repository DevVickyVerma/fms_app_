import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import Loaderimg from "../../../Utils/Loader";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import NewFilterTab from "../Filtermodal/NewFilterTab";





const ManageComision = (props) => {
  const { isLoading, getData, postData } = props;
  const [SelectedsiteID, setsiteID] = useState();
  const [editable, setis_editable] = useState();
  const [data, setData] = useState([]);

  const handleSubmit1 = async (values) => {
    try {

      setsiteID(values.site_id);

      try {
        const response2 = await getData(
          `/shop-commission?site_id=${values.site_id}`
        );

        const { data } = response2;
        if (data) {
          setData(data?.data?.items);
          setis_editable(data?.data);

          // Create an array of form values based on the response data
          const formValues = data.data.items.map((item) => {
            return {
              id: item?.department_item_id,
              commission: item?.commission,
              name: item?.name,
            };
          });

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      name: " CATEGORY NAME",
      selector: (row) => row.name,
      sortable: false,
      width: "40%",
      center: true,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.name !== undefined ? `${row?.name}` : ""}
        </span>
      ),
    },
    {
      name: "COMMISSION",
      selector: (row) => row?.commission,
      sortable: false,
      width: "60%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row?.commission}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`commission-${index}`}
              name={`data[${index}].commission`}
              className=" table-input"
              value={formik?.values?.data?.[index]?.commission}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];



  const handleSubmit = async (values) => {
    try {
      // Create a new FormData object
      const formData = new FormData();

      values?.data?.forEach((obj) => {
        const id = obj?.id;
        const grossValueKey = `commission[${id}]`;

        const grossValue = obj.commission;

        // const action = obj.action;

        formData.append(grossValueKey, grossValue);
      });

      formData.append("site_id", SelectedsiteID);

      const postDataUrl = "/shop-commission/update";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      data: data,
    },
    onSubmit: handleSubmit,
    // validationSchema: validationSchema,
  });


  const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    site_id: Yup.string().required("Site is required"),
  });


  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);

  useEffect(() => {
    if (storedData) {
      let parsedData = JSON.parse(storedData);

      // Check if start_date exists in storedData
      if (!parsedData.start_date) {
        // If start_date does not exist, set it to the current date
        const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
        parsedData.start_date = currentDate;

        // Update the stored data with the new start_date
        localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
        handleApplyFilters(parsedData);
      } else {
        handleApplyFilters(parsedData);
      }

      // Call the API with the updated or original data
    } else if (localStorage.getItem("superiorRole") === "Client") {
      const storedClientIdData = localStorage.getItem("superiorId");

      if (storedClientIdData) {
        const futurepriceLog = {
          client_id: storedClientIdData,
          start_date: new Date().toISOString().split('T')[0], // Set current date as start_date
        };

        // Optionally store this data back to localStorage
        localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));

        handleApplyFilters(futurepriceLog);
      }
    }
  }, [storedKeyName]); // Add any other dependencies needed here

  const handleApplyFilters = (values) => {
    if (values?.company_id && values?.site_id) {
      handleSubmit1(values)
    }
  }

  const handleClearForm = async (resetForm) => {
    setData(null)
  };


  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Shop Commission</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Shop Commission
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Filter Data</h3>
              </Card.Header>

              <NewFilterTab
                getData={getData}
                isLoading={isLoading}
                isStatic={true}
                onApplyFilters={handleApplyFilters}
                validationSchema={validationSchemaForCustomInput}
                storedKeyName={storedKeyName}
                lg="4"
                showStationValidation={true}
                showMonthInput={false}
                showDateInput={false}
                showStationInput={true}
                ClearForm={handleClearForm}
              />

            </Card>
          </Col>
        </Row>

        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Shop Commission</h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <form onSubmit={formik.handleSubmit}>
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
                      <div className="d-flex justify-content-end mt-3">
                        {editable ? (
                          <button className="btn btn-primary" type="submit">
                            Submit
                          </button>
                        ) : (
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
export default withApi(ManageComision);
