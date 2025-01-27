import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import { Collapse } from "antd";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import moment from "moment";
import DataTable from "react-data-table-component";
import CustomPagination from "../../../Utils/CustomPagination";
import FuelSuggestionHistoryLogModal from "./FuelSuggestionHistoryLogModal";

const { Panel } = Collapse;

const FuelSuggestionHistoryLog = (props) => {
  const { getData, isLoading, postData } = props;

  const [SuggestedModalId, setSuggestedModalId] = useState();
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
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSubmit1 = async (values) => {
    setSelectedDrsDate(values.start_date);

    try {
      let { client_id, company_id, start_date, site_id, start_month } = values;
      if (localStorage.getItem("superiorRole") === "Client") {
        client_id = localStorage.getItem("superiorId");
      }

      const firstDayOfMonth = moment(start_month, "YYYY-MM")
        .startOf("month")
        .format("YYYY-MM-DD");

      const queryParams = new URLSearchParams();
      if (site_id) queryParams.append("site_id", site_id);
      if (start_month) queryParams.append("drs_date", firstDayOfMonth);
      if (currentPage) queryParams.append("page", currentPage);

      const queryString = queryParams.toString();
      const response = await getData(
        `site/fuel-price/suggestion/history?${queryString}`
      );

      if (response && response.data && response.data.data) {
        setData(response.data.data?.logs || []);

        setCurrentPage(response.data.data?.currentPage || 1);
        setLastPage(response.data.data?.lastPage || 1);
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
    site_id: Yup.string().required("Site is required"),
    start_month: Yup.string().required("Month is required"),
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
  }, [storedKeyName, currentPage]); // Add any other dependencies needed here

  const handleApplyFilters = (values) => {
    if (values?.company_id && values?.start_date) {
      handleSubmit1(values);
    }
  };
  const handleModalLogs = (site) => {
    setLogsModal(true);
    setSelectedItem(site);
    setSuggestedModalId(site?.id);
  };

  const handleClearForm = async (resetForm) => {
    setData(null);
  };

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

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "8%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Creator",
      selector: (row) => [row.creator],
      sortable: false,
      width: "14%",
      cell: (row) => (
        <div
          className="d-flex pointer hyper-link"
          onClick={() => handleModalLogs(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-flex">
            <h6 className="mb-0 fs-14 fw-semibold wrap-text hyper-link">
              {row.creator}
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Level",
      selector: (row) => [row.date],
      sortable: false,
      width: "8%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{"4"}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Fuel Suggested Date",
      selector: (row) => [row.date],
      sortable: false,
      width: "14%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Fuel Suggested Time",
      selector: (row) => [row.time],
      sortable: false,
      width: "14%",
      cell: (row) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.time}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created At",
      selector: (row) => [row.created_at],
      sortable: false,
      width: "13%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_at}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Status",
      selector: (row) => [row.time],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <div className="d-flex pointer" onClick={() => handleModalLogs(row)}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">
              <span>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      <span>
                        {row.status === 1 ? (
                          <span>Pending</span>
                        ) : row.status === 2 ? (
                          <span>Rejected</span>
                        ) : row.status === 3 ? (
                          <span>Approved</span>
                        ) : row.status === 4 ? (
                          <span>Modified</span>
                        ) : (
                          "-"
                        )}{" "}
                      </span>
                      <span>by - Name Will Come</span>
                    </Tooltip>
                  }
                >
                  <span style={{ cursor: "pointer" }}>
                    {row.status === 1 ? (
                      <span className="btn btn-warning btn-sm">
                        <i className="ph ph-hourglass-low  c-fs-12 mx-1"></i>
                        <span>Pending</span>
                      </span>
                    ) : row.status === 2 ? (
                      <span className="btn btn-danger btn-sm">
                        <i className="ph ph-x  c-fs-12 mx-1"></i>
                        <span>Rejected</span>
                      </span>
                    ) : row.status === 3 ? (
                      <span className="btn btn-success btn-sm">
                        <i className="ph ph-check  c-fs-12 mx-1"></i>
                        <span>Approved</span>
                      </span>
                    ) : row.status === 4 ? (
                      <span className="btn btn-info btn-sm">
                        <i className="ph ph-checks  c-fs-12 mx-1"></i>
                        <span>Modified</span>
                      </span>
                    ) : (
                      "-"
                    )}
                  </span>
                </OverlayTrigger>
              </span>
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => [row.time],
      sortable: false,
      width: "14%",
      cell: (row) => (
        <div
          className="d-flex pointer hyper-link"
          onClick={() => handleModalLogs(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">
              <i className="ph ph-eye me-2 pointer " />
            </h6>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Fuel Suggestion History Logs</h1>
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
                Fuel Suggestion History Logs
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
                lg="3"
                showStationValidation={true}
                showMonthInput={true}
                showDateRangeInput={false}
                showDateInput={false}
                showDateValidation={true}
                showStationInput={true}
                ClearForm={handleClearForm}
              />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Fuel Suggestion History Logs</h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <div className="table-responsive deleted-table">
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader={true}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead={true}
                        highlightOnHover={true}
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
                {/* {dummyData?.map((site, siteIndex) => (
                  <div key={siteIndex} className="mt-2">
                    <Collapse accordion>
                      <Panel
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
                ))} */}
              </Card.Body>
              {data?.length > 0 && lastPage > 1 && (
                <CustomPagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  handlePageChange={handlePageChange}
                />
              )}
            </Card>
          </Col>
        </Row>
      </>
      {logsModal && (
        <>
          <FuelSuggestionHistoryLogModal
            open={logsModal}
            onClose={handleModalClose}
            selectedItem={selectedItem}
            accordionSiteID={SuggestedModalId}
            postData={postData}
          />
        </>
      )}
    </>
  );
};

export default withApi(FuelSuggestionHistoryLog);
