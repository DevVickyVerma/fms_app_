import { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import { Collapse, Table } from "antd";

import Compititormodal from "../../../data/Modal/Midaymodalcompititor";

const { Panel } = Collapse;

const CompetitorFuelPrices = (props) => {
  const { getData, isLoading } =
    props;

  const [editable, setis_editable] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDrsDate, setSelectedDrsDate] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [accordionSiteID, setaccordionSiteID] = useState();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const handleModalOpen = (item) => {
    setModalOpen(true);
    setSelectedItem(item);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );

  const navigate = useNavigate();

  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
    console.clear();
  }, []);


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
      const competitorData = site.competitors.map((competitor) => {
        const competitorname = competitor?.competitor_name;
        const competitorID = competitor?.id;
        const competitorimage = competitor?.supplier;
        const fuels = competitor.fuels[0] || {};
        const time = fuels.time || "N/A";

        // Create an array of objects for each heading in the head_array with price data
        const priceData = data.head_array.map((heading) => {
          const categoryPrice =
            fuels[heading] !== undefined ? fuels[heading] : "N/A";
          return { heading, price: categoryPrice };
        });

        return {
          competitorID,
          competitorname,
          competitorimage,
          time,
          priceData,
        };
      });

      return competitorData;
    } else {
      return [
        // Return an array with an object containing "N/A" values for all fields
        {
          competitorname: "N/A",
          competitorimage: "N/A",
          time: "N/A",
          priceData: data.head_array.map((heading) => ({
            heading,
            price: "N/A",
          })),
        },
      ];
    }
  };
  const handleDataFromChild = async (dataFromChild) => {
    try {
      // Assuming you have the 'values' object constructed from 'dataFromChild'
      const values = {
        start_date: selectedDrsDate,
        client_id: selectedClientId,
        company_id: selectedCompanyId,
      };

      await handleSubmit1(values);
    } catch (error) {
      console.error("Error handling data from child:", error);
    }
  };


  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",
      start_date: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
      start_date: Yup.date()
        .required("Start Date is required")
        .min(
          new Date("2023-01-01"),
          "Start Date cannot be before January 1, 2023"
        ),
    }),

    onSubmit: (values) => {


      localStorage.setItem('competitorFuelPrice', JSON.stringify(values));
      handleSubmit1(values);
    },
  });

  useEffect(() => {
    const competitorFuelPrice = JSON.parse(localStorage.getItem('competitorFuelPrice'));
    if (competitorFuelPrice) {
      formik.setFieldValue('client_id', competitorFuelPrice.client_id);
      formik.setFieldValue('company_id', competitorFuelPrice.company_id);
      formik.setFieldValue('start_date', competitorFuelPrice.start_date);


      GetCompanyList(competitorFuelPrice.client_id);
      GetSiteList(competitorFuelPrice.company_id)
      handleSubmit1(competitorFuelPrice);
    }
  }, []);

  const handleClearForm = async (resetForm) => {
    formik.setFieldValue("site_id", "")
    formik.setFieldValue("start_date", "")
    formik.setFieldValue("client_id", "")
    formik.setFieldValue("company_id", "")
    formik.setFieldValue("endDate", "")
    formik.setFieldValue("startDate", "")
    formik.resetForm()
    setSelectedCompanyList([]);
    setSelectedClientId("");
    setCompanyList([])
    setData(null)
    localStorage.removeItem("competitorFuelPrice")
    const clientId = localStorage.getItem("superiorId");
    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData();
      formik.setFieldValue("client_id", "")
      setCompanyList([])
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId);
      formik.setFieldValue("client_id", clientId)
    }
  };


  const fetchCommonListData = async () => {
    try {
      const response = await getData("/common/client-list");

      const { data } = response;
      if (data) {
        setClientList(response.data);

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
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const GetCompanyList = async (values) => {
    try {
      if (values) {
        const response = await getData(
          `common/company-list?client_id=${values}`
        );

        if (response) {

          setCompanyList(response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const GetSiteList = async (values) => {
    try {
      if (values) {
        const response = await getData(`common/site-list?company_id=${values}`);

        if (response) {

          setSiteList(response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData()
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId)
    }
  }, []);
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Compititormodal
          open={modalOpen}
          onClose={handleModalClose}
          selectedItem={selectedItem}
          accordionSiteID={accordionSiteID}
          selectedDrsDate={selectedDrsDate}
          onDataFromChild={handleDataFromChild}
        />
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


                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Card.Body>

                      <Row>
                        {localStorage.getItem("superiorRole") !== "Client" && (
                          <Col lg={4} md={4}>
                            <div className="form-group">
                              <label
                                htmlFor="client_id"
                                className="form-label mt-4"
                              >
                                Client
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                className={`input101 ${formik.errors.client_id &&
                                  formik.touched.client_id
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="client_id"
                                name="client_id"
                                value={formik.values.client_id}
                                onChange={(e) => {
                                  const selectedType = e.target.value;

                                  if (selectedType) {
                                    GetCompanyList(selectedType);
                                    formik.setFieldValue("client_id", selectedType);
                                    setSelectedClientId(selectedType);
                                    setSiteList([]);
                                    formik.setFieldValue("company_id", "");
                                    formik.setFieldValue("site_id", "");


                                    const selectedClient =
                                      ClientList?.data?.find(
                                        (client) =>
                                          client.id === selectedType
                                      );
                                    if (selectedClient) {
                                      formik.setFieldValue("client_name", selectedClient?.client_name);
                                    }
                                  } else {

                                    formik.setFieldValue("client_id", "");
                                    formik.setFieldValue("company_id", "");
                                    formik.setFieldValue("site_id", "");

                                    setSiteList([]);
                                    setCompanyList([]);
                                  }
                                }}
                              >
                                <option value="">Select a Client</option>
                                {ClientList.data && ClientList.data.length > 0 ? (
                                  ClientList.data.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.client_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Client</option>
                                )}
                              </select>

                              {formik.errors.client_id &&
                                formik.touched.client_id && (
                                  <div className="invalid-feedback">
                                    {formik.errors.client_id}
                                  </div>
                                )}
                            </div>
                          </Col>
                        )}

                        <Col Col lg={4} md={4}>
                          <div className="form-group">
                            <label htmlFor="company_id" className="form-label mt-4">
                              Company
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`input101 ${formik.errors.company_id &&
                                formik.touched.company_id
                                ? "is-invalid"
                                : ""
                                }`}
                              id="company_id"
                              name="company_id"
                              value={formik.values.company_id}
                              onChange={(e) => {
                                const selectcompany = e.target.value;

                                if (selectcompany) {

                                  formik.setFieldValue("company_id", selectcompany);
                                  GetSiteList(selectcompany);

                                  formik.setFieldValue("site_id", "");
                                  setSelectedCompanyId(selectcompany);

                                  const selectedCompanyData =
                                    CompanyList?.find(
                                      (company) =>
                                        company?.id ===
                                        selectcompany
                                    );
                                  if (selectedCompanyData) {
                                    formik.setFieldValue("company_name", selectedCompanyData?.company_name);
                                    formik.setFieldValue("company_id", selectedCompanyData?.id);
                                    // setSelectedCompanyFullData(selectedCompanyData)
                                  }

                                } else {
                                  formik.setFieldValue("company_id", "");
                                  formik.setFieldValue("site_id", "");

                                  setSiteList([]);
                                }
                              }}
                            >
                              <option value="">Select a Company</option>
                              {selectedClientId && CompanyList.length > 0 ? (
                                <>
                                  setSelectedCompanyId([])
                                  {CompanyList.map((company) => (
                                    <option key={company.id} value={company.id}>
                                      {company.company_name}
                                    </option>
                                  ))}
                                </>
                              ) : (
                                <option disabled>No Company</option>
                              )}
                            </select>
                            {formik.errors.company_id &&
                              formik.touched.company_id && (
                                <div className="invalid-feedback">
                                  {formik.errors.company_id}
                                </div>
                              )}
                          </div>
                        </Col>

                        <Col lg={4} md={4}>
                          <div className="form-group">
                            <label htmlFor="start_date" className="form-label mt-4">
                              Start Date
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              className={`input101 ${formik.errors.start_date && formik.touched.start_date
                                ? "is-invalid"
                                : ""
                                }`}
                              type="date"
                              min="2023-01-01"
                              onChange={(e) => {
                                const selectedstart_date = e.target.value;
                                formik.setFieldValue("start_date", selectedstart_date);
                                // You can keep the logic for setting the field value here if needed
                              }}
                              id="start_date"
                              name="start_date"
                              onClick={hadndleShowDate}
                              value={formik.values.start_date}
                            />
                            {formik.errors.start_date && formik.touched.start_date && (
                              <div className="invalid-feedback">
                                {formik.errors.start_date}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <hr />
                    </Card.Body>
                    <Card.Footer className="text-end" style={{ border: "none" }}>
                      <button className="btn btn-primary me-2" type="submit">
                        Submit
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        type="button" // Set the type to "button" to prevent form submission
                        onClick={() => handleClearForm()} // Call a function to clear the form
                      >
                        Clear
                      </button>
                    </Card.Footer>
                  </Row>

                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Competitor Fuel Price</h3>
              </Card.Header>
              <Card.Body>
                {data ? (
                  <div>
                    {data &&
                      data.listing.map((site) => (
                        <div key={site.id} className="mt-2">
                          <Collapse accordion>
                            <Panel header={site.site_name} key={site.id}>
                              {site?.competitors.length > 0 ? (
                                // Render the table
                                <Table
                                  dataSource={extractFuelData(site)}
                                  columns={[
                                    {
                                      title: "Competitor",
                                      dataIndex: "competitorinfo",
                                      key: "competitorinfo",
                                      render: (text, record, index) => (
                                        <div>
                                          <img
                                            src={record.competitorimage}
                                            alt="Competitor"
                                            width={30}
                                            className="ml-2"
                                          />
                                          <span
                                            className="text-muted fs-15 ms-2 fw-semibold text-center fuel-site-name"
                                            onClick={() => {
                                              setaccordionSiteID(site.id);
                                              handleModalOpen(record);
                                            }}
                                            style={{ cursor: "pointer" }}
                                          >
                                            {record.competitorname}
                                          </span>
                                        </div>
                                      ),
                                    },

                                    {
                                      title: "Time",
                                      dataIndex: "time",
                                      key: "time",
                                      render: (text, record, index) => (
                                        <span>
                                          <p>{text}</p>
                                        </span>
                                      ),
                                    },
                                    ...data.head_array.map(
                                      (heading, headingIndex) => ({
                                        title: heading,
                                        dataIndex: "priceData",
                                        key: `priceData_${headingIndex}`,
                                        render: (priceData, record, index) => {
                                          // Get the current competitor's fuels from the record
                                          const competitorFuels =
                                            site.competitors[index]?.fuels;

                                          // Find the fuel object that matches the current heading
                                          const matchedFuel =
                                            competitorFuels.find(
                                              (fuel) =>
                                                fuel.category_name === heading
                                            );

                                          // Get the price data from the matched fuel or display "N/A"
                                          const competitorPrice = matchedFuel
                                            ? matchedFuel.price
                                            : "N/A";

                                          return <p>{competitorPrice}</p>;
                                        },
                                      })
                                    ),
                                  ]}
                                  pagination={false}
                                />
                              ) : (
                                <p>No Price available</p>
                              )}
                            </Panel>
                          </Collapse>
                        </div>
                      ))}
                  </div>
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

export default withApi(CompetitorFuelPrices);
