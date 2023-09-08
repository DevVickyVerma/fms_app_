import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Link, Navigate } from "react-router-dom";
import DataTableExtensions from "react-data-table-component-extensions";

import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import withApi from "../../../Utils/ApiHelper";
import { ErrorMessage, Field, Formik, useFormik } from "formik";
import { Collapse, Table } from "antd";

const { Panel } = Collapse;

const CompetitorFuelPrices = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate, isLoading } =
    props;

  const [editable, setis_editable] = useState();
  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedDrsDate, setSelectedDrsDate] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);

  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );

  const navigate = useNavigate();

  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
    handleFetchData();
    console.clear();
  }, []);

  const handleFetchData = async () => {
    try {
      const response = await getData("/client/commonlist");

      const { data } = response;
      if (data) {
        setAddSiteData(response.data);
        if (
          response?.data &&
          localStorage.getItem("superiorRole") === "Client"
        ) {
          const clientId = localStorage.getItem("superiorId");
          if (clientId) {
            setSelectedClientId(clientId);

            setSelectedCompanyList([]);

            if (response?.data) {
              const selectedClient = response?.data?.data?.find(
                (client) => client.id === clientId
              );
              if (selectedClient) {
                setSelectedCompanyList(selectedClient?.companies);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const [data, setData] = useState(null);
  const handleSubmit1 = async (values) => {
    setSelectedCompanyId(values.company_id);
    setSelectedDrsDate(values.start_date);

    try {
      const formData = new FormData();
      formData.append("start_date", values.start_date);
      formData.append("client_id", values.client_id);
      formData.append("company_id", values.company_id);

      let clientIDCondition = "";
      if (localStorage.getItem("superiorRole") !== "Client") {
        clientIDCondition = `client_id=${values.client_id}&`;
      } else {
        clientIDCondition = `client_id=${clientIDLocalStorage}&`;
      }
      const response1 = await getData(
        `site/competitor-price?${clientIDCondition}company_id=${values.company_id}&drs_date=${values.start_date}`
      );

      const { data } = response1;
      if (data) {
        setData(data?.data);
        setis_editable(data?.data?.btn_clickable);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const hadndleShowDate = () => {
    const inputDateElement = document.querySelector('input[type="date"]');
    inputDateElement.showPicker();
  };
  const extractFuelData = (site) => {
    if (site.competitors && site.competitors.length > 0) {
      const competitor = site.competitors[0];
      const fuels = competitor.fuels[0] || {}; // Use the first element, or an empty object if not available

      const time = fuels.time || "N/A";
      const unleaded = fuels.price || "N/A";
      const superUnleaded =
        (competitor.fuels[1] && competitor.fuels[1].price) || "N/A";
      const diesel =
        (competitor.fuels[2] && competitor.fuels[2].price) || "N/A";
      const superDiesel =
        (competitor.fuels[3] && competitor.fuels[3].price) || "N/A";
      const other = (competitor.fuels[4] && competitor.fuels[4].price) || "N/A";

      return {
        time,
        unleaded,
        superUnleaded,
        diesel,
        superDiesel,
        other,
      };
    }

    // If no competitor data available, return default values
    return {
      time: "N/A",
      unleaded: "N/A",
      superUnleaded: "N/A",
      diesel: "N/A",
      superDiesel: "N/A",
      other: "N/A",
    };
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Competitor Fuel Price</h1>
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
                Competitor Fuel Price
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Body>
                <Formik
                  initialValues={{
                    client_id: "",
                    company_id: "",
                    site_id: "",
                    start_date: "",
                  }}
                  validationSchema={Yup.object({
                    company_id: Yup.string().required("Company is required"),

                    start_date: Yup.date()
                      .required("Start Date is required")
                      .min(
                        new Date("2023-01-01"),
                        "Start Date cannot be before January 1, 2023"
                      ),
                  })}
                  onSubmit={(values) => {
                    handleSubmit1(values);
                  }}
                >
                  {({ handleSubmit, errors, touched, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                          {localStorage.getItem("superiorRole") !==
                            "Client" && (
                            <Col lg={3} md={6}>
                              <FormGroup>
                                <label
                                  htmlFor="client_id"
                                  className=" form-label mt-4"
                                >
                                  Client
                                  <span className="text-danger">*</span>
                                </label>
                                <Field
                                  as="select"
                                  className={`input101 ${
                                    errors.client_id && touched.client_id
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="client_id"
                                  name="client_id"
                                  onChange={(e) => {
                                    const selectedType = e.target.value;
                                    setFieldValue("client_id", selectedType);
                                    setSelectedClientId(selectedType);

                                    // Reset the selected company and site
                                    setSelectedCompanyList([]);
                                    setFieldValue("company_id", "");
                                    setFieldValue("site_id", "");

                                    const selectedClient =
                                      AddSiteData.data.find(
                                        (client) => client.id === selectedType
                                      );

                                    if (selectedClient) {
                                      setSelectedCompanyList(
                                        selectedClient.companies
                                      );
                                      // console.log(
                                      //   selectedClient,
                                      //   "selectedClient"
                                      // );
                                      // console.log(
                                      //   selectedClient.companies,
                                      //   "selectedClient"
                                      // );
                                    }
                                  }}
                                >
                                  <option value="">Select a Client</option>
                                  {AddSiteData.data &&
                                  AddSiteData.data.length > 0 ? (
                                    AddSiteData.data.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.client_name}
                                      </option>
                                    ))
                                  ) : (
                                    <option disabled>No Client</option>
                                  )}
                                </Field>

                                <ErrorMessage
                                  component="div"
                                  className="invalid-feedback"
                                  name="client_id"
                                />
                              </FormGroup>
                            </Col>
                          )}
                          <Col lg={3} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="company_id"
                                className="form-label mt-4"
                              >
                                Company
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.company_id && touched.company_id
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="company_id"
                                name="company_id"
                                onChange={(e) => {
                                  const selectedCompany = e.target.value;
                                  setFieldValue("company_id", selectedCompany);
                                  setSelectedSiteList([]);
                                  const selectedCompanyData =
                                    selectedCompanyList.find(
                                      (company) =>
                                        company.id === selectedCompany
                                    );
                                  if (selectedCompanyData) {
                                    setSelectedSiteList(
                                      selectedCompanyData.sites
                                    );
                                    // console.log(
                                    //   selectedCompanyData,
                                    //   "company_id"
                                    // );
                                    // console.log(
                                    //   selectedCompanyData.sites,
                                    //   "company_id"
                                    // );
                                  }
                                }}
                              >
                                <option value="">Select a Company</option>
                                {selectedCompanyList.length > 0 ? (
                                  selectedCompanyList.map((company) => (
                                    <option key={company.id} value={company.id}>
                                      {company.company_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Company</option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="company_id"
                                onChange={(e) => {
                                  const selectedCompany = e.target.value;
                                }}
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={3} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="start_date"
                                className="form-label mt-4"
                              >
                                Date
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="date"
                                min={"2023-01-01"}
                                onClick={hadndleShowDate}
                                className={`input101 ${
                                  errors.start_date && touched.start_date
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="start_date"
                                name="start_date"
                              ></Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="start_date"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/dashboard/`}
                        >
                          Reset
                        </Link>
                        <button className="btn btn-primary me-2" type="submit">
                          Submit
                        </button>
                      </Card.Footer>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Body>
                <div>
                  {data &&
                    data.listing.map((site) => (
                      <div key={site.id}>
                        <Collapse accordion>
                          <Panel header={site.site_name} key={site.id}>
                            <Table
                              dataSource={[extractFuelData(site)]}
                              columns={[
                                {
                                  title: "Time",
                                  dataIndex: "time",
                                  key: "time",
                                },
                                {
                                  title: "Unleaded",
                                  dataIndex: "unleaded",
                                  key: "unleaded",
                                },
                                {
                                  title: "Super Unleaded",
                                  dataIndex: "superUnleaded",
                                  key: "superUnleaded",
                                },
                                {
                                  title: "Diesel",
                                  dataIndex: "diesel",
                                  key: "diesel",
                                },
                                {
                                  title: "Super Diesel",
                                  dataIndex: "superDiesel",
                                  key: "superDiesel",
                                },
                                {
                                  title: "Other",
                                  dataIndex: "other",
                                  key: "other",
                                },
                              ]}
                              pagination={false}
                            />
                          </Panel>
                        </Collapse>
                      </div>
                    ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default withApi(CompetitorFuelPrices);
