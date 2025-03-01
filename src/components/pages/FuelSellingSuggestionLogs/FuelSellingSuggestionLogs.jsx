import { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import { Collapse, Table } from "antd";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import TabDesign from "./TabDesign";

const { Panel } = Collapse;

const FuelSellingSuggestionLogs = (props) => {
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
    range_start_date: Yup.date().required("Start Date is required"),
    range_end_date: Yup.date().required("End Date is required"),
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

  // const dummyData = [
  //   {
  //     site_name: "Site A",
  //     data: [
  //       {
  //         date: "2024-12-01",
  //         time: "08:00 AM",
  //         fuels: {
  //           Unleaded: "500 L",
  //           "Super Unleaded": "600 L",
  //           Diesel: "450 L",
  //           "Super Diesel": "300 L",
  //           Adblue: "100 L",
  //           "Manual Fuel": "200 L",
  //           Other: "50 L",
  //           LPG: "80 L",
  //           LRP: "90 L",
  //         },
  //       },
  //       {
  //         date: "2024-12-01",
  //         time: "09:00 AM",
  //         fuels: {
  //           Unleaded: "50 L",
  //           "Super Unleaded": "620 L",
  //           Diesel: "470 L",
  //           "Super Diesel": "310 L",
  //           Adblue: "110 L",
  //           "Manual Fuel": "210 L",
  //           Other: "60 L",
  //           LPG: "90 L",
  //           LRP: "100 L",
  //         },
  //       },
  //       {
  //         date: "2024-12-01",
  //         time: "10:00 AM",
  //         fuels: {
  //           Unleaded: "530 L",
  //           "Super Unleaded": "610 L",
  //           Diesel: "460 L",
  //           "Super Diesel": "305 L",
  //           Adblue: "105 L",
  //           "Manual Fuel": "205 L",
  //           Other: "55 L",
  //           LPG: "85 L",
  //           LRP: "95 L",
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     site_name: "Site B",
  //     data: [
  //       {
  //         date: "2024-12-01",
  //         time: "08:00 AM",
  //         fuels: {
  //           Unleaded: "450 L",
  //           "Super Unleaded": "580 L",
  //           Diesel: "420 L",
  //           "Super Diesel": "280 L",
  //           Adblue: "120 L",
  //           "Manual Fuel": "190 L",
  //           Other: "40 L",
  //           LPG: "70 L",
  //           LRP: "80 L",
  //         },
  //       },
  //       {
  //         date: "2024-12-01",
  //         time: "09:00 AM",
  //         fuels: {
  //           Unleaded: "480 L",
  //           "Super Unleaded": "600 L",
  //           Diesel: "440 L",
  //           "Super Diesel": "290 L",
  //           Adblue: "130 L",
  //           "Manual Fuel": "200 L",
  //           Other: "50 L",
  //           LPG: "75 L",
  //           LRP: "85 L",
  //         },
  //       },
  //     ],
  //   },
  // ];

  const dummyData = [
    {
      site_name: "Site A",
      data: [
        {
          date: "2024-12-01",
          time: "10:00 AM",
          fuels: [
            {
              fuelType: "Unleaded",
              oldPrice: "1.543",
              newPrice: "1.593",
              status: "text-success", // Price increased
            },
            {
              fuelType: "Diesel",
              oldPrice: "1.423",
              newPrice: "1.379",
              status: "text-danger", // Price decreased
            },
            {
              fuelType: "Super Unleaded",
              oldPrice: "1.623",
              newPrice: "No Change",
              status: "", // No change
            },
          ],
        },
        {
          date: "2024-12-02",
          time: "12:00 PM",
          fuels: [
            {
              fuelType: "Adblue",
              oldPrice: "1.249",
              newPrice: "No Change",
              status: "", // No change
            },
            {
              fuelType: "LPG",
              oldPrice: "1.312",
              newPrice: "1.452",
              status: "text-success", // Price increased
            },
          ],
        },
      ],
    },
    {
      site_name: "Site B",
      data: [
        {
          date: "2024-12-03",
          time: "9:30 AM",
          fuels: [
            {
              fuelType: "Unleaded",
              oldPrice: "1.564",
              newPrice: "1.489",
              status: "text-danger", // Price decreased
            },
            {
              fuelType: "Diesel",
              oldPrice: "1.532",
              newPrice: "No Change",
              status: "", // No change
            },
          ],
        },
      ],
    },
  ];

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        {/* {modalOpen && (
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
        )} */}

        <div className="page-header ">
          <div>
            <h1 className="page-title">Fuel Selling Prices Suggestion Logs</h1>
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
                Fuel Selling Prices Suggestion Logs
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
                showMonthInput={true}
                showDateRangeInput={false}
                showDateInput={false}
                showDateValidation={true}
                showStationInput={false}
                ClearForm={handleClearForm}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12} xl={12}>
            {" "}
            <TabDesign />
          </Col>
        </Row>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">
                  {" "}
                  Fuel Selling Prices Suggestion Logs
                </h3>
              </Card.Header>
              <Card.Body>
                {dummyData?.map((site, siteIndex) => (
                  <div key={siteIndex} className="mt-2">
                    <Collapse accordion>
                      <Panel
                        style={{ overflowX: "auto" }}
                        header={
                          <div className="d-flex justify-content-between">
                            <div>
                              {site.site_name}

                              <span className=" fw-bold ms-2">
                                ({site?.data?.length})
                              </span>
                            </div>
                          </div>
                        }
                        key={siteIndex}
                      >
                        {site.data.length > 0 ? (
                          site.data.map((entry, entryIndex) => (
                            <div key={entryIndex} className="mb-5">
                              <h6 className=" fw-bold">{`Date: ${entry.date}, Time: ${entry.time}`}</h6>
                              <table className="table table-modern tracking-in-expand">
                                <thead>
                                  <tr>
                                    <th>Fuel Type</th>
                                    <th>Old Price</th>
                                    <th>New Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {entry.fuels.map((fuel, fuelIndex) => (
                                    <tr key={fuelIndex}>
                                      <td className="c-w-per-25">
                                        {fuel.fuelType}
                                      </td>
                                      <td className="c-w-per-25">
                                        {fuel.oldPrice}
                                      </td>
                                      <td
                                        className={`${fuel.status} c-w-per-25`}
                                      >
                                        {fuel.newPrice}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))
                        ) : (
                          <p>No Fuel Prices Available</p>
                        )}
                      </Panel>
                    </Collapse>
                  </div>
                ))}

                {/* {data ? (
                  <div>
                    <div>
                      {dummyData.map((site) => (
                        <div key={site.site_name} className="mt-2">
                          <Collapse accordion>
                            <Panel
                              header={
                                <div>
                                  {site.site_name}
                                  <span className=" fw-600 ms-2">
                                    ({site?.data?.length})
                                  </span>
                                </div>
                              }
                              key={site.site_name}
                            >
                              {site.data.length > 0 ? (
                                <table className="table table-modern tracking-in-expand">
                                  <thead>
                                    <tr>
                                      <th>Date</th>
                                      <th>Time</th>
                                      {Object.keys(site.data[0].fuels).map(
                                        (fuel, index) => (
                                          <th key={index}>{fuel}</th>
                                        )
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {site.data.map((entry, index) => (
                                      <tr key={index}>
                                        <td>{entry.date}</td>
                                        <td>{entry.time}</td>
                                        {Object.keys(entry.fuels).map(
                                          (fuel, i) => (
                                            <td key={i}>{entry.fuels[fuel]}</td>
                                          )
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p>No data available</p>
                              )}
                            </Panel>
                          </Collapse>
                        </div>
                      ))}
                    </div>

                  </div>
                ) : (
                  <>
                    <img
                      src={require("../../../assets/images/commonimages/no_data.png")}
                      alt="MyChartImage"
                      className="all-center-flex nodata-image"
                    />
                  </>
                )} */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default withApi(FuelSellingSuggestionLogs);

{
  /* <Table
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
                                /> */
}
