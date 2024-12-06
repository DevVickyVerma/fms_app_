import React, { useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import LoaderImg from "../../Utils/Loader";
import { Link } from "react-router-dom";
import NewDashboardFilterModal from "../pages/Filtermodal/NewDashboardFilterModal";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import NewFilterTab from "../pages/Filtermodal/NewFilterTab";
import {
  getCurrentDate,
  staticCompiCEOValues,
} from "../../Utils/commonFunctions/commonFunction";
import CEODashboardCompetitor from "./CEODashboardCompetitor";
import CEODashboardCompetitorChart from "./CEODashboardCompetitorChart";

export default function CEOCompitiorview(props) {
  const { isLoading, getData, postData } = props;
  const [getCompetitorsPrice, setGetCompetitorsPrice] =
    useState(staticCompiCEOValues);
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    site_id: Yup.string().required("Site is required"),
    start_date: Yup.date()
      .required("Start Date is required")
      .min(
        new Date("2023-01-01"),
        "Start Date cannot be before January 1, 2023"
      )
      .max(new Date(), "Start Date cannot be after the current date"),
  });
  let storedKeyName = "localFilterModalData";

  const handleApplyFilters = (values) => {
    if (!values?.start_date) {
      const currentDate = new Date().toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
      values.start_date = currentDate;
      localStorage.setItem(storedKeyName, JSON.stringify(values));
    }
    console.log(values, "values");
  };

  const handleClearForm = async (values) => {
    console.log(values, "values");
  };

  return (
    <>
      {isLoading ? <LoaderImg /> : null}

      <>
        <div className="page-header d-flex flex-wrap">
          <div className="mb-2 mb-sm-0">
            <h1 className="page-title">Competitors View</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/ceodashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Competitors View
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Filter</h3>
              </Card.Header>
              <NewFilterTab
                getData={getData}
                isLoading={isLoading}
                isStatic={true}
                onApplyFilters={handleApplyFilters}
                validationSchema={validationSchemaForCustomInput}
                storedKeyName={storedKeyName}
                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                lg="3"
                showStationValidation={true}
                showMonthInput={false}
                showDateInput={true}
                showStationInput={true}
                ClearForm={handleClearForm}
                parentMaxDate={getCurrentDate()}
              />
            </Card>
          </Col>
        </Row>

        <Row
          style={{
            marginBottom: "10px",
            marginTop: "20px",
          }}
        >
          <Col lg={12} md={12} className="">
            <Card className="">
              <Card.Header>
                <div className="w-100">
                  <div className="spacebetweenend">
                    <h4 className="card-title">Competitors Stats</h4>
                  </div>
                </div>
              </Card.Header>

              <Card.Body className="overflow-auto ">
                <CEODashboardCompetitor
                  getCompetitorsPrice={getCompetitorsPrice}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={12} md={12} className="">
            <Card className="">
              <Card.Header>
                <div className="w-100">
                  <div className="spacebetweenend">
                    <h4 className="card-title">Competitors Chart</h4>
                  </div>
                </div>
              </Card.Header>

              <Card.Body className="overflow-auto ">
                <CEODashboardCompetitorChart
                  getCompetitorsPrice={getCompetitorsPrice}
                  setGetCompetitorsPrice={setGetCompetitorsPrice}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
}
