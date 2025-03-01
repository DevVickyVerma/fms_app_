import { useEffect, useState } from "react";

import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import CustomModal from "../../../data/Modal/MiddayModal";
import moment from "moment";
import MobNewFilterTab from "../Filtermodal/MobNewFilterTab";
import CommonMobileFilters from "../../../Utils/commonFunctions/CommonMobileFilters";
import { useMyContext } from "../../../Utils/MyContext";
import { useSelector } from "react-redux";

const FuelPrices = (props) => {
  const { apidata, getData, postData, isLoading } = props;
  const navigate = useNavigate();
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const ReduxFullData = useSelector((state) => state?.data?.data);
  const { isMobile } = useMyContext();
  const [filters, setFilters] = useState({
    client_id: "",
    company_id: "",
    site_id: "",
  });

  const handleMobileModalOpen = async () => {
    setIsMobileModalOpen(true);
  };
  const handleResetFilters = async () => {
    localStorage.removeItem(storedKeyName);
    setFilters(null);
    handleClearForm();
  };
  const [selectedDrsDate, setSelectedDrsDate] = useState("");
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [notificationTypes] = useState({
    mobileSMS: false,
    email: false,
  });

  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
  }, []);

  const handleSubmit1 = async (values) => {
    let { client_id, company_id, site_id, client_name, company_name } = values;

    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = ReduxFullData?.superiorId;
      client_name = ReduxFullData?.full_name;
    }

    if (ReduxFullData?.company_id && !company_id) {
      company_id = ReduxFullData?.company_id;
      company_name = ReduxFullData?.company_name;
    }

    const updatedFilters = {
      ...values,
      client_id,
      client_name,
      company_id,
      company_name,
    };

    setSelectedCompanyId(values.company_id);
    setSelectedDrsDate(values.start_date);

    try {
      const formData = new FormData();
      formData.append("start_date", values.start_date);
      formData.append("client_id", values.client_id);
      formData.append("company_id", values.company_id);

      // ...

      setSelectedClientId(values?.client_id);
      let clientIDCondition = "";
      if (localStorage.getItem("superiorRole") !== "Client") {
        clientIDCondition = `client_id=${values.client_id}&`;
      } else {
        clientIDCondition = `client_id=${clientIDLocalStorage}&`;
        // formik.setFieldValue("client_id", clientIDLocalStorage)
        // GetCompanyList(clientIDLocalStorage);
      }
      const response1 = await getData(
        `site/fuel-price?${clientIDCondition}company_id=${values?.company_id}&drs_date=${values.start_date}`
      );

      const { data } = response1;

      if (data) {
        if (data.api_response === "success") {
          setData(data.data || {});

          setIsMobileModalOpen(false);
          setFilters(updatedFilters);
          setIsMobileModalOpen(false);
          setFilters(updatedFilters);
        } else {
          // Handle the error case
          // You can display an error message or take appropriate action
          console.error(data?.message);
        }
      } else {
        // Handle the case where data is null
        // You may want to set default values or handle it differently
        setData({});
      }
    } catch (error) {
      console.error("API error:", error);
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
      .required("Date is required")
      .min(new Date("2023-01-01"), "Date cannot be before January 1, 2023"),
  });

  const handleClearForm = async () => {
    setData(null);
  };

  const [data, setData] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem] = useState(null);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleInputChange = (id, value) => {
    const updatedData = {
      ...data,
      listing: data?.listing?.map((item) => ({
        ...item,
        fuels: item?.fuels?.map((fuel) =>
          fuel?.id === id ? { ...fuel, price: value } : fuel
        ),
      })),
    };

    setData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      data?.listing?.forEach((item) => {
        const siteId = item.id;

        item.fuels.forEach((fuel) => {
          if (!Array.isArray(fuel) && fuel.price !== undefined) {
            const priceId = fuel.id;
            const fieldKey = `fuels[${siteId}][${priceId}]`;
            const timeKey = `time[${siteId}][${priceId}]`;
            const fieldValue = fuel.price.toString();
            const fieldtime = fuel.time;
            formData.append(fieldKey, fieldValue);
            formData.append(timeKey, fieldtime);
          }
        });
      });

      // const isMobileSelected = selected.some(option => option.value === "mobile-sms");
      // const isEmailSelected = selected.some(option => option.value === "email");

      formData.append("send_sms", notificationTypes?.mobileSMS);
      formData.append("notify_operator", notificationTypes?.email);
      formData.append("drs_date", selectedDrsDate);
      formData.append("client_id", selectedClientId);
      formData.append("company_id", selectedCompanyId);
      // setSelectedClientId()
      // eslint-disable-next-line no-unused-vars
      const response = await postData(
        "/site/fuel-price/update-midday",
        formData
      );

      if (apidata.status_code === "200") {
        const values = {
          start_date: selectedDrsDate,
          client_id: selectedClientId,
          company_id: selectedCompanyId,
        };
        handleModalClose();
        handleSubmit1(values);
      }
      // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };

  const handleDataFromChild = async () => {
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

  const handleFuelPriceLinkClick = (item) => {
    let storedKeyName = "localFilterModalData";
    const storedData = localStorage.getItem(storedKeyName);

    if (storedData) {
      let updatedStoredData = JSON.parse(storedData);

      // updatedStoredData = JSON.parse(storedData);
      updatedStoredData.site_id = item?.id; // Update the site_id here
      updatedStoredData.site_name = item?.site_name; // Update the site_id here

      localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData));
      navigate(`/update-fuel-price/${item?.id}`);
    }
  };

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
    if (values?.start_date && values?.company_id) {
      handleSubmit1(values);
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div className="overflow-container">
        {modalOpen && (
          <>
            <CustomModal
              open={modalOpen}
              onClose={handleModalClose}
              selectedItem={selectedItem}
              selectedDrsDate={selectedDrsDate}
              onDataFromChild={handleDataFromChild}
            />
          </>
        )}

        <div className="page-header ">
          <div>
            <h1 className="page-title"> Fuel Selling Price</h1>
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
                Fuel Selling Price
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {isMobile ? (
          <>
            <CommonMobileFilters
              filters={filters}
              handleToggleSidebar1={handleMobileModalOpen}
              handleResetFilters={handleResetFilters}
              showResetBtn={true}
              showSiteName={false}
              showStartDate={true}
            />
          </>
        ) : (
          <></>
        )}

        <MobNewFilterTab
          getData={getData}
          isLoading={isLoading}
          isStatic={true}
          onApplyFilters={handleApplyFilters}
          validationSchema={validationSchemaForCustomInput}
          storedKeyName={storedKeyName}
          lg="4"
          showStationValidation={false}
          showMonthInput={false}
          showDateInput={true}
          showStationInput={false}
          ClearForm={handleClearForm}
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
        />

        <Row className="row-sm">
          <Col lg={12}>
            <Card
              style={{
                //  height: "calc(100vh - 180px)",
                overflowY: "auto",
              }}
            >
              <Card.Header>
                <h3 className="card-title w-100 ">
                  <div className=" d-flex w-100 justify-content-between align-items-center">
                    <span>
                      Fuel Selling Prices{" "}
                      {data?.currentDate ? <>({data?.currentDate})</> : ""}
                    </span>
                  </div>
                </h3>
              </Card.Header>
              <Card.Body>
                {data?.head_array ? (
                  <div
                    style={{
                      overflowY: "auto",
                      // maxHeight: "calc(100vh - 376px )",
                      maxHeight: "400px",
                    }}
                  >
                    <>
                      <table className="table table-modern">
                        <thead
                          style={{
                            position: "sticky",
                            top: "0",
                            width: "100%",
                          }}
                        >
                          <tr
                            // className="fuelprice-tr"
                            style={{ padding: "0px" }}
                          >
                            {data?.head_array &&
                              data?.head_array?.map((item, index) => (
                                <th key={index} scope="col">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip
                                        style={{
                                          display: "flex",
                                          alignItems: "flex-start",
                                          justifyContent: "flex-start",
                                        }}
                                      >
                                        {item}
                                      </Tooltip>
                                    }
                                  >
                                    <span>
                                      {item?.length > 10
                                        ? `${item?.substring(0, 10)}...`
                                        : item}
                                    </span>
                                  </OverlayTrigger>
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            border: "1px solid #eaedf1",
                            maxHeight: "200px",
                            overflow: "auto",
                          }}
                        >
                          {data?.listing?.map((item) => (
                            <tr key={item.id}>
                              <td className=" align-middle">
                                <div className=" fuel-price-conent">
                                  <div
                                    className={
                                      item?.link_clickable
                                        ? " fs-15 fw-semibold  flex-grow-1 fuel-site-name fuel-site-name-color"
                                        : "text-muted fs-15 fw-semibold  flex-grow-1 fuel-site-name-color"
                                    }
                                    onClick={() =>
                                      handleFuelPriceLinkClick(item)
                                    }
                                  >
                                    {item?.site_name}
                                    {/* count number */}
                                    {/* <span className="itemcount ">
                                      <span className=" d-flex justify-content-center">
                                        {item?.count}
                                      </span>
                                    </span> */}
                                  </div>
                                </div>
                              </td>
                              <td className=" align-middle fuel-price-conent fuel-price-time-td">
                                <span className=" fs-15 fw-semibold text-center  ">
                                  {item?.time
                                    ? moment(item?.time, "HH:mm").format(
                                        "h:mm A"
                                      )
                                    : ""}
                                </span>
                              </td>

                              {Array?.isArray(item?.fuels) &&
                                item?.fuels?.map((fuel, index) => (
                                  <td key={index}>
                                    {Array?.isArray(fuel) ? (
                                      <input
                                        type="text"
                                        className="table-input readonly fuel-price-conent"
                                        readOnly={true}
                                      />
                                    ) : (
                                      <input
                                        type="number"
                                        step="0.010"
                                        placeholder="Enter Values"
                                        className={`table-input fuel-price-conent ${
                                          fuel?.status === "UP"
                                            ? "table-inputGreen"
                                            : fuel?.status === "DOWN"
                                              ? "table-inputRed"
                                              : ""
                                        } ${
                                          !fuel?.is_editable ? "readonly" : ""
                                        }`}
                                        value={fuel?.price}
                                        readOnly={!fuel?.is_editable}
                                        id={fuel?.id}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e.target.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    )}
                                  </td>
                                ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  </div>
                ) : (
                  <img
                    src={require("../../../assets/images/commonimages/no_data.png")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                )}
              </Card.Body>
              <Card.Footer>
                {data?.head_array ? (
                  <div className="text-end notification-class">
                    <div style={{ width: "200px", textAlign: "left" }} />

                    {data?.btn_clickable ? (
                      <button
                        className="btn btn-primary me-2"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withApi(FuelPrices);
