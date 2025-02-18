import { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import { Collapse, Table } from "antd";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import FuelSellingSuggestionsLogModal from "./FuelSellingSuggestionsLogModal";
import FuelPricesSuggestionModal from "./FuelPricesSuggestionModal";

const { Panel } = Collapse;

const FuelSellingPricesSuggestion = (props) => {
  const { getData, isLoading, postData } = props;

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDrsDate, setSelectedDrsDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [logsModal, setLogsModal] = useState(false);
  const [accordionSiteID, setaccordionSiteID] = useState();

  const handleModalOpen = (item) => {
    setModalOpen(true);
    setSelectedItem(item);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setLogsModal(false);
  };

  const [data, setData] = useState(null);

  const handleSubmit1 = async (values) => {
    setSelectedDrsDate(values.start_date);

    try {
      // const formData = new FormData();
      // formData.append("start_date", values.start_date);
      // formData.append("client_id", values.client_id);
      // formData.append("company_id", values.company_id);

      let { client_id, company_id, start_date } = values;
      if (localStorage.getItem("superiorRole") === "Client") {
        client_id = localStorage.getItem("superiorId");
      }

      const queryParams = new URLSearchParams();
      if (client_id) queryParams.append("client_id", client_id);
      if (company_id) queryParams.append("company_id", company_id);
      if (start_date) queryParams.append("drs_date", start_date);

      const queryString = queryParams.toString();
      const response1 = await getData(`site/competitor-price?${queryString}`);

      const { data } = response1;
      if (data) {
        setData(data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const extractFuelData = (site) => {
    if (site.competitors && site?.competitors?.length > 0) {
      const competitorData = site?.competitors?.map((competitor) => {
        const competitorname = competitor?.competitor_name;
        const competitorID = competitor?.id;
        const competitorimage = competitor?.supplier;
        const fuels = competitor?.fuels?.[0] || {};
        const time = fuels?.time || "N/A";

        // Create an array of objects for each heading in the head_array with price data
        const priceData = data?.head_array?.map((heading) => {
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
      if (storedData) {
        let updatedStoredData = JSON.parse(storedData);
        handleSubmit1(updatedStoredData);
      }
    } catch (error) {
      console.error("Error handling data from child:", error);
    }
  };

  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    start_date: Yup.date()
      .required("Start Date is required")
      .min(
        new Date("2023-01-01"),
        "Start Date cannot be before January 1, 2023"
      ),
  });

  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);

  useEffect(() => {
    if (storedData) {
      let parsedData = JSON.parse(storedData);

      // Check if start_date exists in storedData
      if (!parsedData.start_date) {
        // If start_date does not exist, set it to the current date
        const currentDate = new Date().toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
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
          start_date: new Date().toISOString().split("T")[0], // Set current date as start_date
        };

        // Optionally store this data back to localStorage
        localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));

        handleApplyFilters(futurepriceLog);
      }
    }
  }, [storedKeyName]); // Add any other dependencies needed here

  const handleApplyFilters = (values) => {
    if (values?.company_id && values?.start_date) {
      handleSubmit1(values);
    }
  };
  const handleModalLogs = (site) => {
    setLogsModal(true);
    setSelectedItem(site);
  };

  const handleClearForm = async (resetForm) => {
    setData(null);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        {modalOpen && (
          <>
            <FuelPricesSuggestionModal
              open={modalOpen}
              onClose={handleModalClose}
              selectedItem={selectedItem}
              accordionSiteID={accordionSiteID}
              selectedDrsDate={selectedDrsDate}
              onDataFromChild={handleDataFromChild}
              postData={postData}
            />
          </>
        )}

        {logsModal && (
          <>
            <FuelSellingSuggestionsLogModal
              open={logsModal}
              onClose={handleModalClose}
              selectedItem={selectedItem}
              accordionSiteID={accordionSiteID}
              selectedDrsDate={selectedDrsDate}
              onDataFromChild={handleDataFromChild}
              postData={postData}
            />
          </>
        )}

        <div className="page-header ">
          <div>
            <h1 className="page-title">Fuel Selling Prices Suggestion</h1>
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
                Fuel Selling Prices Suggestion
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
                showDateInput={true}
                showDateValidation={true}
                showStationInput={false}
                ClearForm={handleClearForm}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Fuel Selling Prices Suggestion</h3>
              </Card.Header>
              <Card.Body>
                {data ? (
                  <div>
                    {data &&
                      data?.listing?.map((site) => (
                        <div key={site.id} className="mt-2">
                          <Collapse accordion>
                            <Panel
                              style={{ overflowX: "auto" }}
                              header={
                                <>
                                  <div className=" d-flex justify-content-between ">
                                    <div>{site?.site_name}</div>
                                    <div
                                      className=" fw-bolder"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent the parent click from triggering
                                        handleModalLogs(site); // Call the logs modal handler
                                      }}
                                    >
                                      <i className="ph ph-table c-top-3 me-1"></i>
                                      Logs
                                    </div>
                                  </div>
                                </>
                              }
                              key={site.id}
                            >
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
                                            className="text-muted fs-15 ms-2 fw-semibold text-center fuel-site-name "
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
                                    ...data?.head_array?.map(
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

export default withApi(FuelSellingPricesSuggestion);
