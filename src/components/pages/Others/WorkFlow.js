import React from "react";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import * as Yup from "yup";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import { handleError } from "../../../Utils/ToastUtils";

const ManageSite = (props) => {
  const { isLoading, getData, } = props;
  const [data, setData] = useState();
  const navigate = useNavigate()


  const handleSubmit1 = async (values) => {

    let { client_id, company_id, } = values;
    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
    }

    try {
      const queryParams = new URLSearchParams();
      if (client_id) queryParams.append("client_id", client_id);
      if (company_id) queryParams.append("company_id", company_id);

      const queryString = queryParams.toString();
      const response = await getData(`workflow?${queryString}`);

      const { data } = response;
      if (data) {
        setData(data?.data);
      }
    } catch (error) {
      handleError(error)
      console.error("API error:", error);
    } // Set the submission state to false after the API call is completed
  };




  const PerformAction = (row) => {

    let storedKeyName = "localFilterModalData";
    const storedData = localStorage.getItem(storedKeyName);

    if (storedData) {
      let updatedStoredData = JSON.parse(storedData);

      updatedStoredData.site_id = row?.id; // Update the site_id here
      updatedStoredData.site_name = row?.site_name; // Update the site_id here

      localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData));
      navigate(`/data-entry`);
    }

  };



  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "15%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Site",
      selector: (row) => [row.site_name],
      sortable: false,
      width: "40%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.site_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "WorkFlow",
      selector: (row) => [row.work_flow],
      sortable: false,
      width: "25%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0  d-block">
            {row.work_flow === "Not Done" ? (
              <>
                <h6
                  style={{
                    cursor: "pointer",
                  }}
                  className="mb-0 fs-14 fw-semibold badge bg-danger"
                  onClick={() => PerformAction(row)}
                >

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{`Go to ${row.site_name}'s Daily Work Flow`}</Tooltip>}
                  >
                    <span>
                      {row.work_flow}
                    </span>
                  </OverlayTrigger>
                </h6>
              </>
            ) : row.work_flow === "Done" ? (
              <h6 className="mb-0 fs-14 fw-semibold work-flow-sucess-status">
                {row.work_flow}
              </h6>
            ) : (
              ""
            )}
          </div>
        </div>
      ),
    },

    {
      name: " Approval Required",
      selector: (row) => [row.approval],
      sortable: false,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            {row.approval === "No" ? (
              <h6 className="mb-0 fs-14 fw-semibold badge bg-success  ">
                {row.approval}
              </h6>
            ) : row.approval === "Yes" ? (
              <h6 className="mb-0 fs-14 fw-semibold badge bg-danger  ">
                {row.approval}
              </h6>
            ) : (
              ""
            )}
          </div>
        </div>
      ),
    },
  ];



  const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
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
    if (values?.company_id) {
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
            <h1 className="page-title">Workflow Status</h1>

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
                Workflow Status
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
                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                lg="4"
                showStationValidation={false}
                showMonthInput={false}
                showDateInput={false}
                showStationInput={false}
                ClearForm={handleClearForm}
              />

            </Card>
          </Col>
        </Row>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Workflow Status</h3>
              </Card.Header>

              <Card.Body>
                {data?.length > 0 ? (
                  <>
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
                        responsive={true}
                      />
                    </div>
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

export default withApi(ManageSite);
