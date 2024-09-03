import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import withApi from "../../Utils/ApiHelper";
import SortIcon from "@mui/icons-material/Sort";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Loaderimg from "../../Utils/Loader";
import { useDispatch, useSelector } from "react-redux";
import DashboardMultiLineChart from "./DashboardMultiLineChart";
import { Box } from "@material-ui/core";
import { useMyContext } from "../../Utils/MyContext";
import StackedLineBarChart from "./StackedLineBarChart";
import DashboardOverallStatsPieChart from "./DashboardOverallStatsPieChart";
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import CenterFilterModal from "../../data/Modal/CenterFilterModal";
import { handleError, SuccessAlert } from "../../Utils/ToastUtils";
import DashboardStatsBox from "./DashboardStatsBox/DashboardStatsBox";
import { initialState, reducer } from "../../Utils/CustomReducer";
import NewDashboardFilterModal from "../pages/Filtermodal/NewDashboardFilterModal";
import * as Yup from 'yup';



const Dashboard = (props) => {
  const { isLoading, getData } = props;
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [ShowTruw, setShowTruw] = useState(true);
  const [ShowAuth, setShowAuth] = useState(false);
  const [ClientID, setClientID] = useState();
  const [SearchList, setSearchList] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
  const [reducerState, reducerDispatch] = useReducer(reducer, initialState);
  const [IDsToLocal, setIDsToLocal] = useState();
  const [dashboardData, setDashboardData] = useState();

  const [filters, setFilters] = useState({
    client_id: '',
    company_id: '',
    site_id: '',
  });

  const [myclientID, setMyClientID] = useState(
    localStorage.getItem("superiorId")
  );
  const [myLocalSearchData, setmyLocalSearchData] = useState(
    localStorage.getItem("mySearchData")
      ? JSON.parse(localStorage.getItem("mySearchData"))
      : ""
  );

  const {
    shop_margin,
    shop_sale,
    shop_fees,
    fuel_value,
    gross_profit_value,
    gross_volume,
    gross_margin_value,
    pie_chart_values,
    stacked_line_bar_label,
    stacked_line_bar_data,
    d_line_chart_option,
    d_line_chart_values,
    dashboard_dates,
  } = reducerState;

  const {
    searchdata,
    setSearchdata,
    shouldNavigateToDetailsPage,
    setShouldNavigateToDetailsPage,
  } = useMyContext();

  // let myLocalSearchData = localStorage.getItem("mySearchData")
  //   ? JSON.parse(localStorage.getItem("mySearchData"))
  //   : "";

  const superiorRole = localStorage.getItem("superiorRole");
  const role = localStorage.getItem("role");

  // useEffect(() => {
  //   if (myLocalSearchData) {
  //     handleFormSubmit(myLocalSearchData);
  //   }
  //   //  console.clear();
  // }, [myLocalSearchData, myclientID]);

  const handleFetchSiteData = async () => {
    try {
      let clientId = localStorage.getItem("superiorId");
      const superiorRole = localStorage.getItem("superiorRole");
      const role = localStorage.getItem("role");
      const companyId = localStorage.getItem("PresetCompanyID");
      let url = "";

      if (superiorRole === "Administrator") {
        url = "/dashboard/stats";
      } else if (superiorRole === "Client" && role === "Client") {
        url = `/dashboard/stats?client_id=${clientId == null ? " " : clientId}`;

        setIDsToLocal(
          localStorage.setItem(
            "mySearchData",
            JSON.stringify({
              client_id: clientId,
              client_name: "",
              company_id: "",
              company_name: "",
              site_id: "",
              site_name: " ",
            })
          )
        );

        // Corrected: Use JSON.stringify to convert the object to a JSON string
      } else if (superiorRole === "Client" && role === "Operator") {
        url = "/dashboard/stats";
      } else if (superiorRole === "Client" && role !== "Client") {
        url = `dashboard/stats?client_id=${clientId == null ? "" : clientId
          }&company_id=${companyId == null ? "" : companyId}`;
        // Corrected: Use JSON.stringify to convert the object to a JSON string
        localStorage.setItem(
          "mySearchData",
          JSON.stringify({
            client_id: clientId,
            client_name: "",
            company_id: localStorage.getItem("PresetCompanyID"),
            company_name: "",
            site_id: "",
            site_name: " ",
          })
        );
      }
      const response = await getData(url);
      const { data } = response;

      setMyClientID(localStorage.getItem("superiorId"));
      setCenterFilterModalOpen(false)
      if (data) {
        reducerDispatch({
          type: "UPDATE_DATA",
          payload: {
            d_line_chart_values: data?.data?.d_line_graph?.series,
            d_line_chart_option: data?.data?.d_line_graph?.option?.labels,
            stacked_line_bar_data: data?.data?.line_graph?.datasets,
            stacked_line_bar_label: data?.data?.line_graph?.labels,
            pie_chart_values: data?.data?.pi_graph,
            gross_margin_value: data?.data?.gross_margin,
            gross_volume: data?.data?.gross_volume,
            gross_profit_value: data?.data?.gross_profit,
            fuel_value: data?.data?.fuel_sales,
            shop_sale: data?.data?.shop_sales,
            shop_fees: data?.data?.shop_fees,
            shop_margin: data?.data?.shop_profit,
            dashboard_dates: data?.data?.dateString,
          },
        });
      }
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
    }
  };

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const loggedInFlag = localStorage.getItem("justLoggedIn");
  const tokenUpdated = localStorage.getItem("tokenupdate") === "true";
  const Client_login = localStorage.getItem("Client_login") === "true";
  const storedToken = localStorage.getItem("token");
  const dispatch = useDispatch();
  useEffect(() => {
    setClientID(localStorage.getItem("superiorId"));

    if (tokenUpdated) {
      window.location.reload();
      localStorage.setItem("tokenupdate", "false"); // Update the value to string "false"
      // Handle token update logic without page reload
    }

    if (loggedInFlag) {
      setJustLoggedIn(true);
      localStorage.removeItem("justLoggedIn"); // clear the flag
    }

    if (justLoggedIn) {
      setShowAuth(true);
      SuccessAlert("Login Successfully");
      setJustLoggedIn(false);
    }
  }, [ClientID, dispatch, justLoggedIn, token]);

  useEffect(() => {
    if (Client_login) {
      if (tokenUpdated) {
        window.location.reload();
        localStorage.setItem("Client_login", "false"); // Update the value to string "false"
        // Handle token update logic without page reload
      }
    }
    //  console.clear();
  }, [Client_login]);

  const handleToggleSidebar1 = () => {
    setShowTruw(true);
    setSidebarVisible1(!sidebarVisible1);
    setCenterFilterModalOpen(!centerFilterModalOpen);
  };

  const handleFormSubmit = async (values) => {
    setSearchdata(values);

    const clientId =
      values.client_id !== undefined && values.client_id !== ""
        ? values.client_id
        : localStorage.getItem("superiorId");

    if (values.site_id) {
      // If site_id is present, set site_name to its value
      values.site_name = values.site_name || "";
    } else {
      // If site_id is not present, set site_name to an empty string
      values.site_name = "";
    }
    if (values.company_id) {
      // If company_id is present, set site_name to its value
      values.company_name = values.company_name || "";
    } else {
      // If company_id is not present, set company_name to an empty string
      values.company_name = "";
    }

    // Now you can store the updated 'values' object in localStorage
    localStorage.setItem("mySearchData", JSON.stringify(values));

    const companyId =
      values.company_id !== undefined
        ? values.company_id
        : localStorage.getItem("PresetCompanyID");
    try {
      const response = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `dashboard/stats?client_id=${clientId == null ? " " : clientId
          }&company_id=${companyId == null ? "" : companyId}&site_id=${values.site_id
          }`
          : `dashboard/stats?client_id=${clientId == null ? " " : clientId
          }&company_id=${companyId == null ? "" : companyId}&site_id=${values.site_id
          }`
      );

      const { data } = response;

      setMyClientID(localStorage.getItem("superiorId"));

      if (data) {
        reducerDispatch({
          type: "UPDATE_DATA",
          payload: {
            d_line_chart_values: data?.data?.d_line_graph?.series,
            d_line_chart_option: data?.data?.d_line_graph?.option?.labels,
            stacked_line_bar_data: data?.data?.line_graph?.datasets,
            stacked_line_bar_label: data?.data?.line_graph?.labels,
            pie_chart_values: data?.data?.pi_graph,
            gross_margin_value: data?.data?.gross_margin,
            gross_volume: data?.data?.gross_volume,
            gross_profit_value: data?.data?.gross_profit,
            fuel_value: data?.data?.fuel_sales,
            shop_sale: data?.data?.shop_sales,
            shop_fees: data?.data?.shop_fees,
            shop_margin: data?.data?.shop_profit,
            dashboard_dates: data?.data?.dateString,
          },
        });
      }
    } catch (error) {
      handleError(error);
      setShouldNavigateToDetailsPage(false);
      console.error("API error:", error);
    }
  };

  const [isLoadingState, setIsLoading] = useState(false);
  // const ResetForm = async () => {
  //   // myLocalSearchData = "";
  //   // setmyLocalSearchData = "";
  //   setmyLocalSearchData(localStorage.removeItem("mySearchData"));
  //   // setIsLoading(true);
  //   reducerDispatch({
  //     type: "RESET_STATE",
  //   });
  //   setSearchdata({});
  //   setTimeout(() => { }, 1000);
  //   localStorage.removeItem("mySearchData");

  //   if (superiorRole !== "Administrator") {
  //     // Assuming handleFetchSiteData is an asynchronous function
  //     handleFetchSiteData();
  //   }
  // };

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    localStorage.setItem(
      "Dashboardsitestats",
      permissionsArray?.includes("dashboard-site-stats")
    );
    if (UserPermissions?.company_id) {
      localStorage.setItem("PresetCompanyID", UserPermissions?.company_id);
      localStorage.setItem("PresetCompanyName", UserPermissions?.company_name);
    } else {
      localStorage.removeItem("PresetCompanyID");
    }
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
    navigate(UserPermissions?.route);
    //  console.clear();
  }, [UserPermissions, permissionsArray]);


  const isStatusPermissionAvailable =
    permissionsArray?.includes("dashboard-view");

  // useEffect(() => {
  //   if (isStatusPermissionAvailable && superiorRole !== "Administrator") {
  //     if (!myLocalSearchData) {
  //       handleFetchSiteData();
  //     }
  //   }
  //   //  console.clear();
  // }, [permissionsArray, myclientID]);

  const isProfileUpdatePermissionAvailable = permissionsArray?.includes(
    "profile-update-profile"
  );

  const isTwoFactorPermissionAvailable = UserPermissions?.two_factor;

  let storedKeyName = "localFilterModalData";
  const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
  });

  const handleApplyFilters = (values) => {
    console.log(values, "submitted values");
    callFetchFilterData(values)
  }


  const callFetchFilterData = async (filters) => {
    let { client_id, company_id, site_id, client_name } = filters;

    // Check if the role is Client, then set the client_id and client_name from local storage
    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
      client_name = localStorage.getItem("First_name");
    }

    // Update the filters object with new values
    const updatedFilters = {
      ...filters,
      client_id,
      client_name
    };


    if (client_id) {
      try {
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append('client_id', client_id);
        if (company_id) queryParams.append('company_id', company_id);
        if (site_id) queryParams.append('site_id', site_id);

        const queryString = queryParams.toString();
        const response = await getData(`dashboard/stats?${queryString}`);
        if (response && response.data && response.data.data) {
          setDashboardData(response?.data?.data)

          setFilters(updatedFilters)
          setCenterFilterModalOpen(false)
          setShouldNavigateToDetailsPage(true);
          const { data } = response;

          if (data) {
            reducerDispatch({
              type: "UPDATE_DATA",
              payload: {
                d_line_chart_values: data?.data?.d_line_graph?.series,
                d_line_chart_option: data?.data?.d_line_graph?.option?.labels,
                stacked_line_bar_data: data?.data?.line_graph?.datasets,
                stacked_line_bar_label: data?.data?.line_graph?.labels,
                pie_chart_values: data?.data?.pi_graph,
                gross_margin_value: data?.data?.gross_margin,
                gross_volume: data?.data?.gross_volume,
                gross_profit_value: data?.data?.gross_profit,
                fuel_value: data?.data?.fuel_sales,
                shop_sale: data?.data?.shop_sales,
                shop_fees: data?.data?.shop_fees,
                shop_margin: data?.data?.shop_profit,
                dashboard_dates: data?.data?.dateString,
              },
            });
          }
        }
        // setData(response.data);
      } catch (error) {
        handleError(error)
      } finally {
      }
    }
  };



  const handleResetFilters = async () => {
    localStorage.removeItem(storedKeyName);
    setFilters(null)
    setDashboardData(null)
    reducerDispatch({
      type: "RESET_STATE",
    });
  };

  const storedData = localStorage.getItem(storedKeyName);

  useEffect(() => {

    if (storedData) {
      handleApplyFilters(JSON.parse(storedData));
    } else if (localStorage.getItem("superiorRole") === "Client") {
      const storedClientIdData = localStorage.getItem("superiorId");

      if (storedClientIdData) {
        // fetchCompanyList(storedClientIdData)
        const futurepriceLog = {
          client_id: storedClientIdData,
        };
        // localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));
        handleApplyFilters(futurepriceLog);
      }
    }

  }, [dispatch, storedKeyName,]); // Add any other dependencies needed here


  console.log(dashboardData, "dashboardData");






  return (
    <>
      {isLoading || isLoadingState ? <Loaderimg /> : null}


      {centerFilterModalOpen && (
        <div className=''>
          <NewDashboardFilterModal
            isOpen={centerFilterModalOpen}
            onClose={() => setCenterFilterModalOpen(false)}
            getData={getData}
            isLoading={isLoading}
            isStatic={true}
            onApplyFilters={handleApplyFilters}
            validationSchema={validationSchemaForCustomInput}
            storedKeyName={storedKeyName}
            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
            showStationValidation={false}
            showMonthInput={false}
            showDateInput={false}
          />
        </div>
      )}


      {!UserPermissions?.role == "Client" && !UserPermissions?.sms_balance < 3 ? (
        <div
          className="balance-alert"
          style={{
            textAlign: "left",
            margin: " 10px 0",
            fontSize: "16px",
            color: "white",
            background: "#b52d2d",
            padding: "8px",
            borderRadius: "7px",
          }}
        >
          <div>
            Your SMS balance seems low, please buy more SMS to send
            notifications
          </div>
          <div className="balance-badge">
            <span>Sms Balance : </span>
            <span style={{ marginLeft: "6px" }}>
              {" "}
              {UserPermissions?.sms_balance}{" "}
            </span>
          </div>
        </div>
      ) : (
        ""
      )
      }


      <div className='d-flex justify-content-between align-items-center flex-wrap mb-5'>
        <div className="">
          <h2 className='page-title dashboard-page-title'>
            Dashboard ({dashboardData?.dateString ? dashboardData?.dateString : UserPermissions?.dates})
          </h2>
        </div>


        <div className=' d-flex gap-2 flex-wrap'>
          {filters?.client_id || filters?.company_id || filters?.site_id ? (
            <>
              <div className="badges-container  d-flex flex-wrap align-items-center gap-2 px-4 py-sm-0 py-2 text-white" style={{ background: "#ddd" }}>
                {filters?.client_id && (
                  <div className="badge bg-blue-600  d-flex align-items-center gap-2 p-3 ">
                    <span className="font-semibold">Client :</span> {filters?.client_name ? filters?.client_name : <>

                    </>}
                  </div>
                )}

                {filters?.company_id && filters?.company_name && (
                  <div className="badge bg-green-600  d-flex align-items-center gap-2 p-3 ">
                    <span className="font-semibold">Company : </span> {filters?.company_name}
                  </div>
                )}

                {filters?.site_id && filters?.site_name && (
                  <div className="badge bg-red-600  d-flex align-items-center gap-2 p-3 ">
                    <span className="font-semibold">Site :</span> {filters?.site_name}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>

              <div className="d-flex m-auto">

                <span className="p-2 badge bg-red-600  p-3">
                  *Please apply filter to see the stats
                </span>
              </div>
            </>
          )}

          <Button onClick={() => handleToggleSidebar1()} type="button" className="btn btn-primary ">
            Filter
            <span className="">
              <SortIcon />
            </span>
          </Button>

          {filters?.client_id || filters?.company_id || filters?.site_id ? (
            <>
              <span onClick={handleResetFilters} className="btn btn-danger">
                <RestartAltIcon />
              </span>
            </>
          ) : (
            ''
          )}
        </div>
      </div>




      {!UserPermissions?.role == "Client" && !UserPermissions?.sms_balance < 3 ? (
        <div
          className="balance-alert"
          style={{
            textAlign: "left",
            margin: " 10px 0",
            fontSize: "16px",
            color: "white",
            background: "#b52d2d",
            padding: "8px",
            borderRadius: "7px",
          }}
        >
          <div>
            Your SMS balance seems low, please buy more SMS to send
            notifications
          </div>
          <div className="balance-badge">
            <span>Sms Balance : </span>
            <span style={{ marginLeft: "6px" }}>
              {" "}
              {UserPermissions?.sms_balance}{" "}
            </span>
          </div>
        </div>
      ) : (
        ""
      )
      }

      <div>
        {/* <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexDirection={["row"]}
          className="center-filter-modal-responsive flex-wrap"
        >
          <Box alignSelf={["center", "flex-start"]} mt={["0px", "33px"]} className=" ">
            <h1
              className="page-title dashboard-page-title"
              style={{ alignItems: "center" }}
            >
              Dashboard (
              {dashboard_dates ? dashboard_dates : UserPermissions?.dates})
            </h1>
          </Box>


          {localStorage.getItem("superiorRole") === "Client" &&
            localStorage.getItem("role") === "Operator" ? (
            ""
          ) : (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"baseline"}
              my={["0px", "20px"]}
              gap={"5px"}
              mx={["0px", "10px"]}
              flexDirection={"inherit"}
              className="filter-responsive"
            >
              <span
                className="Search-data"
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  display: "flex",
                  gap: "5px",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <>
                  {Object.entries(searchdata).some(
                    ([key, value]) =>
                      [
                        "client_name",
                        "TOdate",
                        "company_name",
                        "site_name",
                        "fromdate",
                      ].includes(key) &&
                      value != null &&
                      value !== ""
                  ) ? (
                    <div className="badge-div c-dash-badge">
                      {Object.entries(searchdata).map(([key, value]) => {
                        if (
                          [
                            "client_name",
                            "TOdate",
                            "company_name",
                            "site_name",
                            "fromdate",
                          ].includes(key) &&
                          value != null &&
                          value !== ""
                        ) {
                          const formattedKey = key
                            .toLowerCase()
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ");

                          return (
                            <div key={key} className="badge">
                              <span className="badge-key">{formattedKey}:</span>
                              <span className="badge-value">{value}</span>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  ) : superiorRole === "Client" && role !== "Client" ? (
                    <div className="badge">
                      <span className="badge-key">Company Name:</span>
                      <span className="badge-value">
                        {localStorage.getItem("PresetCompanyName")}
                      </span>
                    </div>
                  ) : null}
                </>

                {UserPermissions?.applyFilter &&
                  Object.keys(searchdata).length === 0 ? (
                  <div
                    style={{
                      textAlign: "left",
                      margin: " 10px 0",
                      fontSize: "12px",
                      color: "white",
                      background: "#b52d2d",
                      padding: "4px 10px",
                      borderRadius: "7px",
                    }}
                  >
                    *Please apply filter to see the stats
                  </div>
                ) : (
                  ""
                )}
                <Box
                  display={"flex"}
                  ml={"4px"}
                  alignSelf={["flex-start", "center"]}
                >
                  <Link
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      handleToggleSidebar1();
                    }}
                    title="filter"
                    visible={sidebarVisible1}
                    onClose={handleToggleSidebar1}
                    onSubmit={handleFormSubmit}
                    searchListstatus={SearchList}
                  >
                    Filter
                    <span className="ms-2">
                      <SortIcon />
                    </span>
                  </Link>

                  {Object.keys(searchdata).length > 0 ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Reset Filter</Tooltip>}
                    >
                      <Link
                        to="#" // Replace with the appropriate link URL
                        className="btn btn-danger btn-sm ms-2"
                      // onClick={() => {
                      //   ResetForm();
                      // }}
                      >
                        <RestartAltIcon />
                      </Link>
                    </OverlayTrigger>
                  ) : (
                    ""
                  )}
                </Box>
              </span>
            </Box>
          )}
        </Box>



        <>
          <Box
            display={["flex", "flex", "none"]}
            flexWrap={"wrap"}
            marginBottom={"10px"}
            className=" gap-1"
          >
            {Object.entries(searchdata).some(
              ([key, value]) =>
                [
                  "client_name",
                  "TOdate",
                  "company_name",
                  "site_name",
                  "fromdate",
                ].includes(key) &&
                value != null &&
                value !== ""
            ) ? (
              Object.entries(searchdata).map(([key, value]) => {
                if (
                  [
                    "client_name",
                    "TOdate",
                    "company_name",
                    "site_name",
                    "fromdate",
                  ].includes(key) &&
                  value != null &&
                  value !== ""
                ) {
                  const formattedKey = key
                    .toLowerCase()
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                  return (
                    <div key={key} className="badge">
                      <span className="badge-key">{formattedKey}:</span>
                      <span className="badge-value">{value}</span>
                    </div>
                  );
                } else {
                  return null;
                }
              })
            ) : superiorRole === "Client" && role !== "Client" ? (
              <div className="badge">
                <span className="badge-key">Company Name:</span>
                <span className="badge-value">
                  {localStorage.getItem("PresetCompanyName")}
                </span>
              </div>
            ) : null}
          </Box>
        </>  */}

        {/* <CenterFilterModal
          onSubmit={handleFormSubmit}
          title="Search"
          visible={sidebarVisible1}
          onClose={handleToggleSidebar1}
          searchListstatus={SearchList}
          centerFilterModalOpen={centerFilterModalOpen}
          setCenterFilterModalOpen={setCenterFilterModalOpen}
        /> */}

        {/* {isProfileUpdatePermissionAvailable &&
        !isTwoFactorPermissionAvailable &&
        ShowAuth ? (
          <>
            <CenterAuthModal title="Auth Modal" />
          </> 
        ) : (
          ""
        )} */}

        <DashboardStatsBox
          GrossVolume={dashboardData?.gross_volume}
          shopmargin={dashboardData?.shop_profit}
          GrossProfitValue={dashboardData?.gross_profit}
          GrossMarginValue={dashboardData?.gross_margin}
          FuelValue={dashboardData?.fuel_sales}
          shopsale={dashboardData?.shop_sales}
          shop_fees={dashboardData?.shop_fees}
          searchdata={searchdata}
          shouldNavigateToDetailsPage={shouldNavigateToDetailsPage}
          setShouldNavigateToDetailsPage={setShouldNavigateToDetailsPage}
          dashboardData={dashboardData}
        />




        <Row>
          <Col lg={12} md={12} sm={12} xl={12}>
            <Row>
              <Col lg={6} md={12} sm={12} xl={3}>
                <Card className=" overflow-hidden">
                  <Card.Body className="card-body">
                    <Row>
                      <div className="col">
                        <h6 className="">Total Sales</h6>
                        <h3 className="mb-2 number-font">
                          2323

                          {/* <CountUp
                            end={34516}
                            separator=","
                            start={0}
                            duration={2.94}
                          /> */}
                        </h3>
                        <p className="text-muted mb-0">
                          <span className="text-primary me-1">
                            <i className="fa fa-chevron-circle-up text-primary me-1"></i>
                            <span>3% </span>
                          </span>
                          last month
                        </p>
                      </div>
                      <div className="col col-auto">
                        <div className="counter-icon bg-primary-gradient box-shadow-primary brround ms-auto">
                          <i className="fe fe-trending-up text-white mb-5 "></i>
                        </div>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <div className="col-lg-6 col-md-12 col-sm-12 col-xl-3">
                <div className="card overflow-hidden">
                  <div className="card-body">
                    <Row>
                      <div className="col">
                        <h6 className="">Total Leads</h6>
                        <h3 className="mb-2 number-font">
                          sad {/* <CountUp
                            end={56992}
                            separator=","
                            start={0}
                            duration={2.94}
                          /> */}
                        </h3>
                        <p className="text-muted mb-0">
                          <span className="text-secondary me-1">
                            <i className="fa fa-chevron-circle-up text-secondary me-1"></i>
                            <span>3% </span>
                          </span>
                          last month
                        </p>
                      </div>
                      <div className="col col-auto">
                        <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                          <i className="icon icon-rocket text-white mb-5 "></i>
                        </div>
                      </div>
                    </Row>
                  </div>
                </div>
              </div>
              <Col lg={6} md={12} sm={12} xl={3}>
                <Card className="card overflow-hidden">
                  <Card.Body className="card-body">
                    <Row>
                      <div className="col">
                        <h6 className="">Total Profit</h6>
                        <h3 className="mb-2 number-font">
                          $ 3223
                          {/* <CountUp
                            end={42567}
                            separator=","
                            start={0}
                            duration={2.94}
                          /> */}
                        </h3>
                        <p className="text-muted mb-0">
                          <span className="text-success me-1">
                            <i className="fa fa-chevron-circle-down text-success me-1"></i>
                            <span>0.5% </span>
                          </span>
                          last month
                        </p>
                      </div>
                      <div className="col col-auto">
                        <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto">
                          <i className="fe fe-dollar-sign text-white mb-5 "></i>
                        </div>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} md={12} sm={12} xl={3}>
                <Card className=" overflow-hidden">
                  <Card.Body className="card-body">
                    <Row>
                      <div className="col">
                        <h6 className="">Total Cost</h6>
                        <h3 className="mb-2 number-font">
                          $ 2222
                          {/* <CountUp
                            end={34789}
                            separator=","
                            start={0}
                            duration={2.94}
                          /> */}
                        </h3>
                        <p className="text-muted mb-0">
                          <span className="text-danger me-1">
                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                            <span>0.2% </span>
                          </span>
                          last month
                        </p>
                      </div>
                      <div className="col col-auto">
                        <div className="counter-icon bg-success-gradient box-shadow-success brround  ms-auto">
                          <i className="fe fe-briefcase text-white mb-5 "></i>
                        </div>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row style={{ marginBottom: "10px", marginTop: "20px" }}>
          <Col
            lg={8}
          >
            <Card>
              <Card.Header className="card-header">
                <h4 className="card-title" >
                  Total Transactions
                </h4>
              </Card.Header>
              <Card.Body className="card-body pb-0 
              
              ">
                {/* // dashboard-chart-height */}
                {dashboardData?.line_graph && dashboardData?.line_graph ? (
                  <div id="chart">
                    <>
                      <StackedLineBarChart
                        stackedLineBarData={dashboardData?.line_graph?.datasets || []}
                        stackedLineBarLabels={dashboardData?.line_graph?.labels || []}
                      />
                    </>

                  </div>
                ) : (
                  <>

                    <div className=" h-100">
                      <img
                        src={require("../../assets/images/no-chart-img.png")}
                        alt="MyChartImage"
                        className="all-center-flex disable-chart"
                      />
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "0.785rem",
                          textAlign: "center",
                          color: "#d63031",
                        }}
                      >
                        Please Apply Filter To Visualize Chart.....
                      </p>
                    </div>


                  </>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className=" pie-card-default-height">
              <Card.Header className="card-header">
                <h4 className="card-title" >
                  Overall Stats
                </h4>
              </Card.Header>
              <Card.Body className="card-body pb-0 
              
              ">
                {/* // dashboard-chart-height */}
                <div id="chart" className=" h-100">
                  {pie_chart_values ? (
                    <>
                      <DashboardOverallStatsPieChart data={dashboardData?.pi_graph} />
                    </>
                  ) : (
                    <>

                      <img
                        src={require("../../assets/images/no-chart-img.png")}
                        alt="MyChartImage"
                        className="all-center-flex disable-chart"
                      />

                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "0.785rem",
                          textAlign: "center",
                          color: "#d63031",
                        }}
                      >
                        Please Apply Filter To Visualize Chart.....
                      </p>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row style={{ marginBottom: "10px", marginTop: "20px" }}>
          <Col lg={12} md={12}>
            <Card>
              <Card.Header className="card-header">
                <h4 className="card-title">Total Transactions</h4>
              </Card.Header>
              <Card.Body className="card-body pb-0">
                <div id="chart">
                  <DashboardMultiLineChart
                    LinechartValues={dashboardData?.d_line_graph?.series || []}
                    LinechartOption={dashboardData?.d_line_graph?.option?.labels || []}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withApi(Dashboard);

