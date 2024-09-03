import { useEffect, useReducer, useState } from "react";
import { Breadcrumb, Button, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import DashboardChildTable from "./DashboardChildTable";
import { useMyContext } from "../../../Utils/MyContext";
import Loaderimg from "../../../Utils/Loader";
import { Box } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { useDispatch, useSelector } from "react-redux";
import CenterFilterModal from "../../../data/Modal/CenterFilterModal";
import { ErrorAlert, SuccessAlert, handleError } from "../../../Utils/ToastUtils";
import DashboardStatsBox from "../DashboardStatsBox/DashboardStatsBox";
import { initialState, reducer } from "../../../Utils/CustomReducer";
import NewDashboardFilterModal from "../../pages/Filtermodal/NewDashboardFilterModal";
import * as Yup from 'yup';



const DashBoardChild = (props) => {
  const { isLoading, getData } = props;
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [tableData, setTableData] = useState();
  const [SearchList, setSearchList] = useState(false);
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
  const [reducerState, reducerDispatch] = useReducer(reducer, initialState);
  const { shop_margin, shop_sale, shop_fees, fuel_value, gross_profit_value, gross_volume, gross_margin_value, dashboard_dates } = reducerState;

  const [dashboardData, setDashboardData] = useState();
  const [filters, setFilters] = useState({
    client_id: '',
    company_id: '',
    site_id: '',
  });

  const navigate = useNavigate();
  const UserPermissions = useSelector((state) => state?.data?.data);
  const {
    searchdata,
    setSearchdata,
  } = useMyContext();

  const handleToggleSidebar1 = () => {
    setSidebarVisible1(!sidebarVisible1);
    setCenterFilterModalOpen(!centerFilterModalOpen);
  };


  let myLocalSearchData = localStorage.getItem("mySearchData") ? JSON.parse(localStorage.getItem("mySearchData")) : "";


  // useEffect(() => {
  //   if (myLocalSearchData) {
  //     handleFormSubmit(myLocalSearchData)
  //   }
  // }, [])


  const superiorRole = localStorage.getItem("superiorRole");

  const role = localStorage.getItem("role");

  const dispatch = useDispatch();


  const handleFormSubmit = async (values) => {
    const clientId =
      (values.client_id !== undefined && values.client_id !== "")
        ? values.client_id
        : localStorage.getItem("superiorId");
    const companyId =
      values.company_id !== undefined && values.company_id !== null
        ? values.company_id
        : localStorage.getItem("PresetCompanyID") || "";


    try {
      const response = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `dashboard/stats?client_id=${clientId == null ? " " : clientId}&company_id=${companyId == null ? "" : companyId}&site_id=${values.site_id}`
          : `dashboard/stats?client_id=${clientId == null ? " " : clientId}&company_id=${companyId == null ? "" : companyId}&site_id=${values.site_id}`
      );

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
          }
        });
      }
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
    }

    if (searchdata?.length > 0) {
      setSearchdata({});
    }
    setSearchdata(values);

    if (values.site_id) {
      // If site_id is present, set site_name to its value
      values.site_name = values.site_name || "";
    } else {
      // If site_id is not present, set site_name to an empty string
      values.site_name = "";
    }

    localStorage.setItem("mySearchData", JSON.stringify(values));

    setSearchdata(localStorage.setItem("mySearchData", JSON.parse(values)));
  };



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
    callTableData(values)
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
          setFilters(updatedFilters)
          setCenterFilterModalOpen(false)
          setDashboardData(response?.data?.data)
          const { data } = response;

          // if (data) {
          //   reducerDispatch({
          //     type: "UPDATE_DATA",
          //     payload: {
          //       d_line_chart_values: data?.data?.d_line_graph?.series,
          //       d_line_chart_option: data?.data?.d_line_graph?.option?.labels,
          //       stacked_line_bar_data: data?.data?.line_graph?.datasets,
          //       stacked_line_bar_label: data?.data?.line_graph?.labels,
          //       pie_chart_values: data?.data?.pi_graph,
          //       gross_margin_value: data?.data?.gross_margin,
          //       gross_volume: data?.data?.gross_volume,
          //       gross_profit_value: data?.data?.gross_profit,
          //       fuel_value: data?.data?.fuel_sales,
          //       shop_sale: data?.data?.shop_sales,
          //       shop_fees: data?.data?.shop_fees,
          //       shop_margin: data?.data?.shop_profit,
          //       dashboard_dates: data?.data?.dateString,
          //     }
          //   });
          // }
        }
        // setData(response.data);
      } catch (error) {
        handleError(error)
      } finally {
      }
    }
  };


  const callTableData = async (filters) => {
    let { client_id, company_id, site_id, client_name } = filters;

    // Check if the role is Client, then set the client_id and client_name from local storage
    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
      client_name = localStorage.getItem("First_name");
    }

    if (client_id) {
      try {
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append('client_id', client_id);
        if (company_id) queryParams.append('company_id', company_id);
        if (site_id) queryParams.append('site_id', site_id);

        const queryString = queryParams.toString();
        const response = await getData(`dashboard/get-details?${queryString}`);
        if (response && response.data && response.data.data) {
          setTableData(response?.data?.data?.sites);
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


  return (
    <>
      {isLoading ? <Loaderimg /> : null}


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


      <div className='d-flex justify-content-between align-items-center flex-wrap mb-5'>
        <div className="">
          <h2 className='page-title dashboard-page-title'>
            Dashboard Deatil ({dashboardData?.dateString ? dashboardData?.dateString : UserPermissions?.dates})
          </h2>
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
              Dashboard Details
            </Breadcrumb.Item>
          </Breadcrumb>
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


        </div>
      </div>



      {/* <div>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexDirection={["row",]}
          className="center-filter-modal-responsive  flex-wrap"
        >
          <Box alignSelf={["center", "flex-start"]}
            mt={["0px", "33px"]}>
            <h1 className="page-title  dashboard-page-title">
              Dashboard Details   ({dashboard_dates ? dashboard_dates : UserPermissions?.dates})
            </h1>
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
                Dashboard Details
              </Breadcrumb.Item>
            </Breadcrumb>
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
                  <Box display={["none", "none", "flex"]} flexWrap={"wrap"} justifyContent={"center"} alignItems={"center"} className=" gap-1 badge-div" >
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
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
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
                      <div className="badge ">
                        <span className="badge-key">Company Name:</span>
                        <span className="badge-value">
                          {localStorage.getItem("PresetCompanyName")}
                        </span>
                      </div>
                    ) : null}
                  </Box>
                </>

                <Box display={"flex"} ml={"4px"} alignSelf={["flex-start", "center"]} >
                  <Link
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      handleToggleSidebar1();
                    }}
                    title="filter"
                    visible={sidebarVisible1}
                    onClose={handleToggleSidebar1}
                    // onSubmit={handleFormSubmit}
                    searchListstatus={SearchList}
                  >
                    Filter
                    <span className="ms-2">
                      <SortIcon />
                    </span>
                  </Link>
                </Box>

              </span>


            </Box>
          )}
        </Box>
        <>
          <Box display={["flex", "flex", "none"]} flexWrap={"wrap"} marginBottom={"10px"} className=" gap-1" >
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
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    )
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
        </>

        <CenterFilterModal
          // onSubmit={handleFormSubmit}
          title="Search"
          visible={sidebarVisible1}
          onClose={handleToggleSidebar1}
          searchListstatus={SearchList}
          centerFilterModalOpen={centerFilterModalOpen}
          setCenterFilterModalOpen={setCenterFilterModalOpen}
        />
      </div> */}

      <Row>
        <DashboardStatsBox
          GrossVolume={dashboardData?.gross_volume}
          shopmargin={dashboardData?.shop_profit}
          GrossProfitValue={dashboardData?.gross_profit}
          GrossMarginValue={dashboardData?.gross_margin}
          FuelValue={dashboardData?.fuel_sales}
          shopsale={dashboardData?.shop_sales}
          shop_fees={dashboardData?.shop_fees}
          searchdata={searchdata}
        />
      </Row>

      <DashboardChildTable data={tableData} />
    </>
  );
};

export default DashBoardChild;
