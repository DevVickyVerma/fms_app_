import { useEffect, useReducer, useState } from "react";
import { Breadcrumb, Button, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import DashboardChildTable from "./DashboardChildTable";
import { useMyContext } from "../../../Utils/MyContext";
import Loaderimg from "../../../Utils/Loader";
import SortIcon from "@mui/icons-material/Sort";
import { useDispatch, useSelector } from "react-redux";
import { handleError } from "../../../Utils/ToastUtils";
import DashboardStatsBox from "../DashboardStatsBox/DashboardStatsBox";
import { initialState, reducer } from "../../../Utils/CustomReducer";
import NewDashboardFilterModal from "../../pages/Filtermodal/NewDashboardFilterModal";
import * as Yup from 'yup';



const DashBoardChild = (props) => {
  const { isLoading, getData } = props;
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [tableData, setTableData] = useState();
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
  const UserPermissions = useSelector((state) => state?.data?.data);
  const [reducerState, reducerDispatch] = useReducer(reducer, initialState);

  const [dashboardData, setDashboardData] = useState();
  const [filters, setFilters] = useState({
    client_id: '',
    company_id: '',
    site_id: '',
  });

  const navigate = useNavigate();
  const ReduxFullData = useSelector((state) => state?.data?.data);
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

  let storedKeyName = "localFilterModalData";
  const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
  });

  const handleApplyFilters = (values) => {
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
        }
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
            Dashboard Deatil ({dashboardData?.dateString ? dashboardData?.dateString : ReduxFullData?.dates})
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
