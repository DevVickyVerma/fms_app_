import CeoDashboardCharts from "../CeoDashboardCharts";
import {
  Baroptions,
  Shrinkage,
  StockData,
  StockDetail,
} from "../../../Utils/commonFunctions/CommonData";
import { Card, Col, Row } from "react-bootstrap";
import CeoDashSitetable from "../CeoDashSitetable";
import ReportTable from "../ReportTable";
import { Doughnut } from "react-chartjs-2";
import CeoDashboardBarChart from "../CeoDashboardBarChart";
import DashboardMultiLineChart from "../DashboardMultiLineChart";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LoaderImg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import CeoDashboardStatsBox from "../DashboardStatsBox/CeoDashboardStatsBox";
import { Bounce, toast } from "react-toastify";
import MultiDateRangePicker from "../../../Utils/MultiDateRangePicker";
import CeoFilterBadge from "../CeoFilterBadge";
import SelectField from "./SelectField";
import moment from "moment/moment";
import { MultiSelect } from "react-multi-select-component";
import NoDataComponent from "../../../Utils/commonFunctions/NoDataComponent";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const CeoDetailModal = (props) => {
  const {
    title,
    getData,
    visible,
    onClose,
    filterDataAll,
    isLoading,
    filterData,
    dashboardData,
  } = props;
  const [apiData, setApiData] = useState(); // to store API response data
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedGrades, setselectedGrades] = useState([]);
  const [sitefuels, setsitefuels] = useState();

  const { handleError } = useErrorHandler();

  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  var [isClientRole] = useState(
    localStorage.getItem("superiorRole") == "Client"
  );

  const fetchCompanyList = async (companyId) => {
    try {
      const response = await getData(
        `common/company-list?client_id=${companyId}`
      );

      filterData.companies = response?.data?.data;
      const selectedItem = response?.data?.data?.find(
        (item) => item.id === filterData?.company_id
      );

      await formik.setFieldValue("selectedCompanyDetails", selectedItem);
      await fetchSiteList(filterData?.company_id);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (visible && isClientRole) {
      fetchCompanyList(filterData?.client_id);
    }
  }, [isClientRole]);

  useEffect(() => {
    if (title == "Reports") {
      const selectedItem = filterData?.sites?.find(
        (item) => item.id === filterData?.sites?.[0]?.id
      );
      formik.setFieldValue("selectedSiteDetails", selectedItem);
      formik.setFieldValue("selectedSite", filterData?.sites?.[0]?.id);
      formik.setFieldValue("site_name", filterData?.sites?.[0]?.site_name);
    }

    if (visible && filterData) {
      if (filterData?.site_id) {
        const selectedItem = filterData?.sites.find(
          (item) => item.id === filterData?.site_id
        );
        formik.setFieldValue("selectedSite", filterData?.site_id);
        formik.setFieldValue("selectedSiteDetails", selectedItem);
        formik.setFieldValue("site_name", filterData?.site_name);
      } else if (filterData?.company_id) {
        const selectedItem = filterData?.companies?.find(
          (item) => item.id === filterData?.company_id
        );
        formik.setFieldValue("company_id", filterData?.company_id);
        formik.setFieldValue("selectedCompany", filterData?.company_id);
        formik.setFieldValue("selectedCompanyDetails", selectedItem);
      }
      // if (title == "Live Margin") {
      //   if (filterData?.site_id) {
      //     // here i am finding the main filters sites object if there is site ID exist
      //     const selectedItem = filterData?.sites?.find(
      //       (item) => item.id === filterData?.site_id
      //     );
      //     setSelected(() => [
      //       { label: selectedItem?.site_name, value: selectedItem?.id },
      //     ]);

      //     formik.setFieldValue("selectedSiteDetails", selectedItem);
      //     formik.setFieldValue("selectedSite", filterData?.id);
      //     formik.setFieldValue("site_name", filterData?.site_name);
      //   } else {
      //     const selectedItem = filterData?.sites?.find(
      //       (item) => item.id === filterData?.sites?.[0]?.id
      //     );
      //     formik.setFieldValue("selectedSiteDetails", selectedItem);
      //     formik.setFieldValue("selectedSite", filterData?.sites?.[0]?.id);
      //     formik.setFieldValue("site_name", filterData?.sites?.[0]?.site_name);
      //     setSelected(() => [
      //       { label: selectedItem?.site_name, value: selectedItem?.id },
      //     ]);
      //   }
      // }
      if (filterData?.company_id) {
        const selectedItem = filterData?.companies?.find(
          (item) => item.id === filterData?.company_id
        );
        formik.setFieldValue("company_id", filterData?.company_id);
        formik.setFieldValue("selectedCompany", filterData?.company_id);
        formik.setFieldValue("selectedCompanyDetails", selectedItem);
      }
    }
  }, [visible]);

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      company_name: "",
      comparison_value: "weekly",
      comparison_label: "Weekly",
      selectedSite: "",
      selectedCompany: "",
      selectedCompanyDetails: "",
      site_name: "",
      selectedSiteDetails: "",
      selectedMonth: "",
      selectedMonthDetails: "",
      startDate: null,
      endDate: null,
    },
    onSubmit: (values) => {
      // console.log(values);
    },
  });

  const handleMonthChange = (selectedId) => {
    const selectedItem = apiData?.data?.months?.find(
      (item) => item.display == selectedId
    );
    formik.setFieldValue("selectedMonth", selectedId);
    formik.setFieldValue("selectedMonthDetails", selectedItem);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      // When dates are selected
      formik.setFieldValue("startDate", dates[0] ?? null);
      formik.setFieldValue("endDate", dates[1] ?? null);
    } else {
      // When the date picker is cleared
      formik.setFieldValue("startDate", null);
      formik.setFieldValue("endDate", null);
    }
  };
  const [pdfisLoading, setpdfisLoading] = useState(false);
  const ErrorToast = (message) => {
    toast.error(message, {
      autoClose: 2000,
      hideProgressBar: false,
      transition: Bounce,
      theme: "colored",
    });
  };
  const handleDownload = async (report) => {
    if (!formik?.values?.selectedMonthDetails?.value) {
      ErrorToast("Please select Month For Reports");
    } else {
      setpdfisLoading(true);
      try {
        const formData = new FormData();

        formData.append("report", report);

        // Add client_id based on superiorRole
        const superiorRole = localStorage.getItem("superiorRole");
        if (superiorRole !== "Client") {
          formData.append("client_id", filterData.client_id);
        } else {
          formData.append("client_id", filterData.client_id);
        }

        // Add other necessary form values
        formData.append("company_id", filterData.company_id);

        // Prepare client ID condition for the query params
        let clientIDCondition =
          superiorRole !== "Client"
            ? `client_id=${filterData.client_id}&`
            : `client_id=${filterData.client_id}&`;

        // Construct commonParams basedd on toggleValue
        const commonParams = `/download-report/${
          report?.report_code
        }?${clientIDCondition}company_id=${
          filterData.company_id
        }&site_id[]=${encodeURIComponent(formik.values?.selectedSite)}&month=${
          formik?.values?.selectedMonthDetails?.value
        }`;

        // API URL for the fetch request
        const apiUrl = `${process.env.REACT_APP_BASE_URL + commonParams}`;

        // Fetch the data
        const token = localStorage.getItem("token");
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if the response is OK
        if (!response.ok) {
          //
          // Await the response body parsing first to get the actual JSON data
          const errorData = await response.json();
          ErrorToast(errorData?.message);
          throw new Error(
            `Errorsss ${response.status}: ${
              errorData?.message || "Something went wrong!"
            }`
          );
        }

        // Handle the file download
        const blob = await response.blob();
        const contentType = response.headers.get("Content-Type");
        let fileExtension = "xlsx"; // Default to xlsx

        if (contentType) {
          if (contentType.includes("application/pdf")) {
            fileExtension = "pdf";
          } else if (
            contentType.includes(
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
          ) {
            fileExtension = "xlsx";
          } else if (contentType.includes("text/csv")) {
            fileExtension = "csv";
          }
        }

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(new Blob([blob]));

        // Create a link element and trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${report?.report_name}.${fileExtension}`
        );
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Error downloading the file:", error);
      } finally {
        setpdfisLoading(false);
      }
    }
  };

  const fetchSiteList = async (companyId) => {
    try {
      const response = await getData(
        `common/site-list?company_id=${companyId}`
      );
      // setSelected([]);

      filterData.sites = response?.data?.data;
    } catch (error) {
      handleError(error);
    }
  };
  const handleCompanyChange = async (selectedId) => {
    try {
      if (selectedId) {
        // Find the selected company details
        const selectedItem = filterData?.companies.find(
          (item) => item.id === selectedId
        );
        if (title !== "Live Margin") {
          await fetchData(selectedId, "company"); // Fetch data for company change
        }
        await fetchSiteList(selectedId); // Fetch and update sites dynamically

        await formik.setFieldValue("selectedCompany", selectedId);
        await formik.setFieldValue("selectedCompanyDetails", selectedItem);
        await formik.setFieldValue("selectedSite", "");
        await formik.setFieldValue("selectedSiteDetails", "");
      } else {
        await fetchData(null, "no-company");
        // Clear fields if no company is selected
        await formik.setFieldValue("selectedCompany", "");
        await formik.setFieldValue("selectedCompanyDetails", "");
        await formik.setFieldValue("selectedSite", "");
        await formik.setFieldValue("selectedSiteDetails", "");
      }
    } catch (error) {
      console.error("Error in handleCompanyChange:", error);
    }
  };

  const handleSiteChange = async (selectedId) => {
    try {
      // Check if a site is selected (selectedId is not null or undefined)
      if (selectedId) {
        // Fetch data for site change with the custom selected site ID
        await fetchData(selectedId, "site");
      } else {
        await fetchData(null, "no-site");
      }

      // Find the selected site details from filterData
      const selectedItem = filterData?.sites.find(
        (item) => item.id === selectedId
      );

      // Update Formik state with selected site and its details
      await formik.setFieldValue("selectedSite", selectedId);
      await formik.setFieldValue("selectedSiteDetails", selectedItem);
    } catch (error) {
      console.error("Error in handleSiteChange:", error);
    }
  };

  const handleComparisonChange = async (e) => {
    try {
      const selectedValue = e.target.value;
      // Find the corresponding label (option name) based on the selected value
      const selectedOption = Comparisongraphfilter?.find(
        (item) => item.value === selectedValue
      );

      if (selectedOption) {
        formik.setFieldValue("comparison_value", selectedValue);

        // You can also store the label if needed
        formik.setFieldValue("comparison_label", selectedOption.label);
      }
    } catch (error) {
      console.error("Error in handleComparisonChange:", error);
    }
  };

  useEffect(() => {
    // setSelected([]);
    fetchData(); // Trigger the fetchData function on component mount or title change
  }, [title, formik?.values?.comparison_value, formik?.values?.endDate]); // Dependencies: title and selectedSite

  const fetchData = async (customId, type) => {
    try {
      setLoading(true); // Start loading indicator
      const queryParams = new URLSearchParams();
      if (filterData?.client_id) {
        queryParams.append("client_id", filterData.client_id);
      }

      if (title === "Live Margin") {
        // * "is_ceo" goes 1 when api is called with CEO live margin
        queryParams.append("is_ceo", 1);

        if (filterData?.site_id) {
          formik.setFieldValue("selectedSite", filterData?.site_id);
        }
      }

      if (title === "Comparison") {
        const isCustom = formik?.values?.comparison_value === "custom";

        if (isCustom) {
          const startDate = formik?.values?.startDate;
          const endDate = formik?.values?.endDate;

          // Check if both startDate and endDate are selected
          if (startDate && endDate) {
            const formattedStartDate = moment(startDate).format("DD-MM-YYYY");
            const formattedEndDate = moment(endDate).format("DD-MM-YYYY");
            const customDateRange = `${formattedStartDate}/${formattedEndDate}`;

            // Append the custom date range to the query params
            queryParams.append("filter_type", formik?.values?.comparison_value);
            queryParams.append("daterange", customDateRange);
          } else {
            return; // Stop the API call if dates are not selected
          }
        } else if (formik?.values?.comparison_value) {
          // Append normal filter_type value if it's not custom
          queryParams.append("filter_type", formik?.values?.comparison_value);
        }
      }

      const shouldSkipCompanyId = type === "no-company";

      if (!shouldSkipCompanyId) {
        if (type === "company" && customId) {
          queryParams.append("company_id", customId); // Use custom company ID
        } else if (filterData?.company_id) {
          queryParams.append("company_id", filterData.company_id); // Use default company ID
        }
      }

      const shouldSkipSiteId =
        title === "Reports" ||
        type === "no-site" ||
        type === "company" ||
        title === "MOP Breakdown" ||
        title === "Live Margin";

      if (!shouldSkipSiteId && !shouldSkipCompanyId) {
        if (type === "site" && customId) {
          queryParams.append("site_id", customId); // Use custom site ID
        } else if (filterData?.site_id) {
          queryParams.append("site_id", filterData.site_id); // Use default site ID
        }
        // else if (title === "Live Margin" && filterData?.sites?.[0]?.id) {
        //   queryParams.append("site_id[0]", filterData.sites[0].id); // Use the first site ID as fallback
        // }
      }

      if (
        filterData?.sites?.length > 0 &&
        (title === "MOP Breakdown" || title === "Live Margin")
      ) {
        // Determine the selected site based on title and site_id
        const selectedSiteItem = filterData.site_id
          ? filterData.sites.find((item) => item.id === filterData.site_id) // Use filterData.site_id if it exists
          : title === "Live Margin" // If the title is "Live Margin", fallback to the first site
            ? filterData.sites[0]
            : null; // No site selected for "MOP Breakdown" if no filterData.site_id

        if (selectedSiteItem) {
          const selectedOptions = [
            { label: selectedSiteItem.site_name, value: selectedSiteItem.id },
          ];

          setSelected(selectedOptions); // Store the selected site in state
          queryParams.append("site_id[0]", selectedSiteItem.id); // Append the site ID to queryParams

          if (title === "Live Margin") {
            fecthFuelList(selectedOptions, true); // Fetch fuel list if the title is "Live Margin"
          }
        }
      }

      const queryString = queryParams.toString(); // Construct the query string

      let response;
      // Dynamically handle API calls based on the title
      switch (title) {
        case "MOP Breakdown":
          response = await getData(`ceo-dashboard/mop-stats?${queryString}`);
          break;
        case "Comparison":
          response = await getData(`ceo-dashboard/sales-stats?${queryString}`);
          break;
        case "Performance":
          response = await getData(
            `ceo-dashboard/site-performance?${queryString}`
          );
          break;
        case "Reports":
          response = await getData(
            `client/reportlist?client_id=${filterData?.client_id}`
          );
          break;
        case "Live Margin":
          response = await getData(
            `ceo-dashboard/get-live-margin?${queryString}`
          );
          break;
        case "Daily Wise Sales":
          response = await getData(`ceo-dashboard/stats?${queryString}`);
          break;
        case "Stock":
          response = await getData(`ceo-dashboard/stock-stats?${queryString}`);
          break;
        case "Shrinkage":
          response = await getData(
            `ceo-dashboard/shrinkage-stats?${queryString}`
          );
          break;
        case "Stock Details":
          response = await getData(
            `ceo-dashboard/department-item-stocks?${queryString}`
          );
          break;
        default:
          console.log("Title not recognized");
      }

      if (response) {
        setApiData(response.data); // Assuming response has a 'data' field

        if (title === "Reports" && response.data.data?.months?.length > 0) {
          formik.setFieldValue(
            "selectedMonth",
            response.data.data?.months?.[0].display
          );
          formik.setFieldValue(
            "selectedMonthDetails",
            response.data.data?.months?.[0]
          );
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const handleRemoveFilter = async (filterName) => {
    if (filterName == "company_name") {
      await formik.setFieldValue("selectedCompany", "");
      await formik.setFieldValue("selectedCompanyDetails", "");
      await formik.setFieldValue("selectedSite", "");
      await formik.setFieldValue("selectedSiteDetails", "");
      await fetchData(null, "no-company");
    } else if (filterName == "site_name") {
      await formik.setFieldValue("selectedSite", "");
      await formik.setFieldValue("selectedSiteDetails", "");
      await fetchData(null, "no-site");
    }
  };

  const Comparisongraphfilter = [
    {
      value: "weekly",
      label: `Weekly  (${dashboardData?.date_filter?.weekly})`,
    },
    {
      value: "monthly",
      label: `Monthly  (${dashboardData?.date_filter?.monthly})`,
    },
    {
      value: "yearly",
      label: `Year To Date   (${dashboardData?.date_filter?.ytd})`,
    },
    { value: "month_year", label: "Actual Vs Previous Year Month" },
    { value: "budget", label: "Actual Vs Budget" },
    { value: "custom", label: "Custom" },
  ];

  const handleSelectChange = (selectedOptions) => {
    if (selectedOptions?.length) {
      fecthFuelList(selectedOptions); // Call function when selectedOptions is not empty
    } else {
      setselectedGrades([]);
    }
    setSelected(selectedOptions); // Update state with selected options
  };

  const handleMopSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    // Retrieve form values
    const selectedCompany = formik.values.company_id;
    const selectedSites = selected;

    // Validation
    if (!selectedCompany) {
      ErrorToast("Please select a company.");
      return;
    }

    // console.log("Submitting form data:", payload);
    const queryParams = new URLSearchParams();
    if (filterData?.client_id) {
      queryParams.append("client_id", filterData.client_id);
    }
    if (filterData?.company_id) {
      queryParams.append("company_id", filterData.company_id); // Use default company ID
    }

    if (selected !== null && selected !== undefined) {
      selected.forEach((client, index) => {
        queryParams.append(`site_id[${index}]`, client.value); // Use client.value to get the selected value
      });
    }

    const queryString = queryParams.toString(); // Construct the query string

    try {
      const response = await getData(`ceo-dashboard/mop-stats?${queryString}`);

      if (response && response.data && response.data.data) {
        setApiData(response.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };
  const handleLiveSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    // Retrieve form values
    const selectedCompany = formik.values.company_id;
    const selectedSites = selected;

    if (!selectedCompany) {
      alert("Please select a company.");
      return;
    }
    if (!selected || selected.length === 0) {
      alert("Please select a Site.");
      return;
    }

    // console.log("Submitting form data:", payload);
    const queryParams = new URLSearchParams();
    if (filterData?.client_id) {
      queryParams.append("client_id", filterData.client_id);
    }
    if (filterData?.company_id) {
      queryParams.append("company_id", filterData.company_id); // Use default company ID
    }

    if (selected !== null && selected !== undefined) {
      selected.forEach((client, index) => {
        queryParams.append(`site_id[${index}]`, client.value); // Use client.value to get the selected value
      });
    }
    if (selectedGrades !== null && selectedGrades !== undefined) {
      selectedGrades.forEach((client, index) => {
        queryParams.append(`fuel_id[${index}]`, client.value); // Use client.value to get the selected value
      });
    }

    const queryString = queryParams.toString(); // Construct the query string

    try {
      const response = await getData(
        `ceo-dashboard/get-live-margin?${queryString}`
      );

      if (response && response.data && response.data.data) {
        setApiData(response.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const fecthFuelList = async (selectedOptions, dontCheckCompanyId = false) => {
    setLoading(true);
    // Retrieve form values
    const selectedCompany = formik.values.company_id;
    const selected = selectedOptions;

    // Check company selection unless dontCheckCompanyId is true
    if (!dontCheckCompanyId && !selectedCompany) {
      ErrorToast("Please select a company.");
      return;
    }

    // console.log("Submitting form data:", payload);
    const queryParams = new URLSearchParams();

    if (selected !== null && selected !== undefined) {
      selected.forEach((client, index) => {
        queryParams.append(`site_id[${index}]`, client.value); // Use client.value to get the selected value
      });
    }

    const queryString = queryParams.toString(); // Construct the query string

    try {
      const response = await getData(`common/site-fuels?${queryString}`);

      if (response && response.data && response.data.data) {
        setsitefuels(response.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const sitefuelsoptions =
    selected && sitefuels
      ? sitefuels.map((site) => ({
          label: site?.name,
          value: site?.id,
        }))
      : [];

  return (
    <>
      {isLoading || pdfisLoading ? <LoaderImg /> : ""}
      <div
        className={`common-sidebar    ${
          visible ? "visible slide-in-right " : "slide-out-right"
        }`}
        style={{
          width:
            title == "MOP Breakdown"
              ? "50%"
              : title == "Reports"
                ? "40"
                : title == "Comparison"
                  ? "70%"
                  : "80%",
        }}
      >
        <div className="card">
          <div className="card-header text-center SidebarSearchheader">
            <h3 className="SidebarSearch-title m-0">
              {title !== "Live Margin" ? (
                title
              ) : (
                <>
                  <img
                    src={require("../../../assets/images/commonimages/LiveIMg.gif")}
                    alt="Live Img"
                    className="Liveimage"
                  />{" "}
                  Margins{" "}
                  <span> Last Updated On {apiData?.data?.last_updated}</span>
                  <span className="text-mute">
                    {" "}
                    {apiData?.data?.last_updated_time && (
                      <>({apiData.data?.last_updated_time})</>
                    )}
                  </span>
                </>
              )}
            </h3>

            <button className="close-button" onClick={onClose}>
              {/* <FontAwesomeIcon icon={faTimes} /> */}
              <i className="ph ph-x-circle c-fs-25"></i>
            </button>
          </div>
          <div
            className="card-body scrollview pt-0"
            style={{ background: "#f2f3f9" }}
          >
            {title == "Daily Wise Sales" && (
              <>
                <div className="m-4 textend">
                  {" "}
                  <CeoFilterBadge
                    filters={{
                      client_name: filterData.client_name,
                      company_name:
                        formik?.values?.selectedCompanyDetails?.company_name,
                      site_name: formik?.values?.selectedSiteDetails?.site_name,
                      start_date: "",
                    }}
                    onRemoveFilter={handleRemoveFilter}
                    showResetBtn={true}
                    showStartDate={false}
                  />
                </div>
                <Card className="">
                  <Card.Body className="">
                    <Row>
                      {filterData?.companies && (
                        <SelectField
                          label="Company"
                          id="selectedCompany"
                          name="selectedCompany"
                          value={formik.values.selectedCompany}
                          options={filterData.companies}
                          onChange={handleCompanyChange}
                          required={true}
                          // placeholder="--Select a Company--"
                        />
                      )}

                      {filterData?.sites && (
                        <SelectField
                          label="Site"
                          id="selectedSite"
                          name="selectedSite"
                          value={formik.values.selectedSite}
                          options={filterData.sites}
                          onChange={handleSiteChange}
                          placeholder="--Select a Site--"
                        />
                      )}
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="">
                  <Card.Header className="p-4 w-100  ">
                    <div className="w-100">
                      <div className="spacebetweenend">
                        <h4 className="card-title">Daily Wise Sales </h4>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div>
                      <DashboardMultiLineChart
                        LinechartValues={
                          apiData?.data?.d_line_graph?.series || []
                        }
                        LinechartOption={
                          apiData?.data?.d_line_graph?.option?.labels || []
                        }
                      />
                    </div>
                  </Card.Body>
                </Card>
              </>
            )}
            {title == "Live Margin" && (
              <>
                <div className="m-4 textend">
                  {" "}
                  <CeoFilterBadge
                    filters={{
                      client_name: filterData.client_name,
                      company_name:
                        formik?.values?.selectedCompanyDetails?.company_name,
                      // site_name: formik?.values?.selectedSiteDetails?.site_name
                      //   ? formik?.values?.selectedSiteDetails?.site_name
                      //   : filterData?.sites[0]?.site_name, // Pass "yes" if it has a value, "no" otherwise
                    }}
                    selected={selected}
                    showResetBtn={false}
                  />
                </div>
                <Card className="">
                  <Card.Body className="">
                    <Row>
                      {filterData?.companies && (
                        <SelectField
                          label="Company"
                          id="selectedCompany"
                          name="selectedCompany"
                          value={formik.values.selectedCompany}
                          options={filterData.companies}
                          onChange={handleCompanyChange}
                          required={true}
                          lg={4}
                        />
                      )}

                      {filterData?.sites && (
                        <Col md={4}>
                          <div className="form-group">
                            <label className="form-label">
                              Select Sites
                              <span className="text-danger">*</span>
                            </label>

                            <MultiSelect
                              value={selected}
                              onChange={handleSelectChange}
                              labelledBy="Select Sites"
                              disableSearch="true"
                              options={
                                filterData.sites?.map((site) => ({
                                  label: site?.site_name,
                                  value: site?.id,
                                })) || []
                              }
                              showCheckbox="false"
                            />
                          </div>
                        </Col>
                      )}
                      {sitefuelsoptions && (
                        <Col md={4}>
                          <div className="form-group">
                            <label className="form-label">Select Grades</label>

                            <MultiSelect
                              value={selectedGrades}
                              onChange={setselectedGrades}
                              labelledBy="Select Grades"
                              disableSearch="true"
                              options={sitefuelsoptions}
                              showCheckbox="false"
                            />
                          </div>
                        </Col>
                      )}
                      <hr></hr>
                      <div className="text-end">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleLiveSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="">
                  <Card.Body className="">
                    {apiData?.data && selected.length > 0 ? (
                      <>
                        <table className="table table-modern tracking-in-expand">
                          <thead>
                            <tr>
                              <th scope="col">Gross Volume</th>
                              <th scope="col">Fuel Sales</th>
                              <th scope="col">Gross Profit</th>
                              <th scope="col">Gross Margin</th>
                              <th scope="col">Shop Sales</th>
                              <th scope="col">Shop Profit</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="">
                              <td>
                                <h2 className="my-2 number-font">
                                  <span className="l-sign">ℓ</span>{" "}
                                  {apiData?.data?.gross_volume}
                                </h2>
                              </td>
                              <td>
                                <div className="">
                                  <h2 className="my-2 number-font">
                                    {" "}
                                    £ {apiData?.data?.fuel_sales}
                                  </h2>
                                </div>
                              </td>
                              <td>
                                <div className="">
                                  <h2 className="my-2 number-font">
                                    £ {apiData?.data?.gross_profit}
                                  </h2>
                                </div>
                              </td>
                              <td>
                                <div className="">
                                  <h2 className="my-2 number-font">
                                    {" "}
                                    {apiData?.data?.gross_margin} ppl
                                  </h2>
                                </div>
                              </td>
                              <td>
                                <div className="">
                                  <h2 className="my-2 number-font">
                                    £ {apiData?.data?.shop_sales}
                                  </h2>
                                </div>
                              </td>
                              <td>
                                <div className="">
                                  <h2 className="my-2 number-font">
                                    £ {apiData?.data?.shop_profit}
                                  </h2>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <Row className="mt-5">
                          {apiData?.data?.sites?.map((site) => (
                            <Col md={3} key={site.id}>
                              <Card className="mb-4">
                                <Card.Header className="ceo-live-margin-header">
                                  {site?.site_name}
                                </Card.Header>
                                <Card.Body>
                                  <Card.Text className="">
                                    <strong>Gross Volume:</strong>{" "}
                                    <span className="number-font ms-1">
                                      <span className="l-sign">ℓ</span>{" "}
                                      {site?.gross_volume}
                                    </span>
                                  </Card.Text>
                                  <Card.Text className="">
                                    <strong>Fuel Sales:</strong>
                                    <span className="number-font ms-1">
                                      £ {site?.fuel_sales}
                                    </span>
                                  </Card.Text>
                                  <Card.Text className="">
                                    <strong>Gross Profit:</strong>
                                    <span className="number-font ms-1">
                                      £ {site?.gross_profit}
                                    </span>
                                  </Card.Text>
                                  <Card.Text className="">
                                    <strong>Gross Margin:</strong>{" "}
                                    <span className="number-font ms-1">
                                      {site?.gross_margin} ppl
                                    </span>
                                  </Card.Text>
                                  <Card.Text className="">
                                    <strong>Shop Sales:</strong>
                                    <span className="number-font ms-1">
                                      £ {site?.shop_sales}
                                    </span>
                                  </Card.Text>
                                  <Card.Text className="">
                                    <strong>Shop Profit:</strong>
                                    <span className="number-font ms-1">
                                      £ {site?.shop_profit}
                                    </span>
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </>
                    ) : (
                      <NoDataComponent />
                    )}

                    {/* 
                  
                    // ** Old table for live margin to be shown here
                    <Row>
                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card dash-plates-1 img-card box-${request[0].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  <span className="l-sign">ℓ</span>{" "}
                                  {apiData?.data?.gross_volume}
                                </h2>
                                <p className="text-white mb-0">Gross Volume</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-drop text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card  dash-plates-2 img-card box-${request[1].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  {" "}
                                  £ {apiData?.data?.fuel_sales}
                                </h2>
                                <p className="text-white mb-0">Fuel Sales</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-shopping-bag text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card  dash-plates-3 img-card box-${request[2].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  £ {apiData?.data?.gross_profit}
                                </h2>
                                <p className="text-white mb-0">Gross Profit</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-currency-gbp text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card  dash-plates-1 img-card box-${request[3].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  {" "}
                                  {apiData?.data?.gross_margin} ppl
                                </h2>
                                <p className="text-white mb-0">Gross Margin</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-lightning text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card  dash-plates-2 img-card box-${request[4].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  £ {apiData?.data?.shop_sales}
                                </h2>
                                <p className="text-white mb-0">Shop Sales</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-shopping-bag text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card  dash-plates-3 img-card box-${request[5].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  £ {apiData?.data?.shop_profit}
                                </h2>
                                <p className="text-white mb-0">Shop Profit</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-currency-gbp text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row> */}
                  </Card.Body>
                </Card>
              </>
            )}
            {title == "MOP Breakdown" && (
              <>
                <div className="m-4 textend">
                  <CeoFilterBadge
                    filters={{
                      client_name: filterData.client_name,
                      company_name:
                        formik?.values?.selectedCompanyDetails?.company_name,
                    }}
                    selected={selected}
                    onRemoveFilter={handleRemoveFilter}
                    showResetBtn={true}
                    showCompResetBtn={false}
                    showStartDate={false}
                  />
                </div>
                <Card>
                  <Card.Body>
                    <Row>
                      {filterData?.companies && (
                        <SelectField
                          label="Company"
                          id="selectedCompany"
                          name="selectedCompany"
                          value={formik.values.selectedCompany}
                          options={filterData.companies}
                          onChange={handleCompanyChange}
                          required={true}
                          // placeholder="--Select a Company--"
                        />
                      )}
                      {filterData?.sites && (
                        <Col md={6}>
                          <div className="form-group">
                            <label className="form-label">Select Sites</label>
                            <MultiSelect
                              value={selected}
                              onChange={setSelected}
                              labelledBy="Select ssss"
                              placeholder="dfsfdfsfd"
                              disableSearch="true"
                              options={
                                filterData.sites?.map((site) => ({
                                  label: site?.site_name,
                                  value: site?.id,
                                })) || []
                              }
                              showCheckbox="false"
                            />
                          </div>
                        </Col>
                      )}

                      <hr></hr>
                      <div className="text-end">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleMopSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>

                <Row>
                  {apiData?.data ? (
                    <CeoDashboardStatsBox
                      dashboardData={apiData?.data}
                      Mopstatsloading={loading}
                    />
                  ) : (
                    <>
                      <Col lg={12}>
                        <NoDataComponent />
                      </Col>
                    </>
                  )}
                </Row>

                <Row>
                  <Col
                    sm={12}
                    md={12}
                    xl={12}
                    key={Math.random()}
                    className="mb-6"
                  >
                    {apiData?.data?.pie_graph_data?.stock_graph_data ? (
                      <>
                        <Card className="h-100">
                          <Card.Header className="p-4">
                            <h4 className="card-title">Pie Chart</h4>
                          </Card.Header>
                          <Card.Body className=" d-flex justify-content-center align-items-center">
                            <div style={{ width: "350px", height: "350px" }}>
                              <Doughnut
                                data={
                                  apiData?.data?.pie_graph_data
                                    ?.stock_graph_data || []
                                }
                                options={
                                  apiData?.data?.pie_graph_data
                                    ?.stock_graph_options || []
                                }
                                height="150px"
                              />
                            </div>
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      <>
                        <NoDataComponent title={"Pie Chart"} />
                      </>
                    )}
                  </Col>
                </Row>
              </>
            )}
            {title == "Comparison" && (
              <>
                <div className="m-4 textend">
                  <CeoFilterBadge
                    filters={{
                      client_name: filterData.client_name,
                      company_name:
                        formik?.values?.selectedCompanyDetails?.company_name,
                      site_name: formik?.values?.selectedSiteDetails?.site_name,
                      start_date: "",
                    }}
                    onRemoveFilter={handleRemoveFilter}
                    showResetBtn={true}
                    showCompResetBtn={false}
                    showStartDate={false}
                  />
                </div>
                <Card className="mt-5">
                  <Card.Body className="">
                    <Row>
                      {filterData?.companies && (
                        <SelectField
                          label="Company"
                          id="selectedCompany"
                          name="selectedCompany"
                          lg={4}
                          value={formik.values.selectedCompany}
                          options={filterData.companies}
                          onChange={handleCompanyChange}
                          required={true}
                          // placeholder="--Select a Company--"
                        />
                      )}
                      {filterData?.sites ? (
                        <Col lg={4} className="">
                          <label className=" form-label" htmlFor="Site">
                            Site
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <select
                            id="selectedSite"
                            name="selectedSite"
                            value={formik.values.selectedSite}
                            onChange={(e) => handleSiteChange(e.target.value)}
                            className="input101 "
                          >
                            <option value="">--Select a Site--</option>
                            {filterData?.sites?.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.site_name}
                              </option>
                            ))}
                          </select>
                        </Col>
                      ) : (
                        ""
                      )}
                      {filterData?.sites ? (
                        <Col lg={4} className="">
                          <label className=" form-label" htmlFor="Site">
                            Filter
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            id="comparison_value"
                            name="comparison_value"
                            value={formik?.values?.comparison_value}
                            // onChange={formik.handleChange}
                            onChange={handleComparisonChange}
                            // className="selectedMonth"
                            className="input101"
                          >
                            {Comparisongraphfilter?.map((item, index) => (
                              <option
                                key={`${item.value}-${index}`}
                                value={item.value}
                              >
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </Col>
                      ) : (
                        ""
                      )}
                      {filterData?.sites &&
                      formik?.values?.comparison_value === "custom" ? (
                        <Col lg={4} className="">
                          <label className=" form-label" htmlFor="Site">
                            Select Custom Date Range
                            <span className="text-danger">*</span>
                          </label>
                          <MultiDateRangePicker
                            startDate={formik.values.startDate}
                            endDate={formik.values.endDate}
                            onChange={handleDateChange}
                            isClearable={false}
                          />
                        </Col>
                      ) : (
                        ""
                      )}
                    </Row>
                  </Card.Body>
                </Card>
                <CeoDashboardCharts
                  Salesstatsloading={false}
                  BarGraphSalesStats={apiData?.data}
                  Baroptions={Baroptions}
                  formik={formik}
                />
              </>
            )}

            {title == "Performance" && (
              <>
                <div className="m-4 textend">
                  <CeoFilterBadge
                    filters={{
                      client_name: filterData.client_name,
                      company_name:
                        formik?.values?.selectedCompanyDetails?.company_name,
                      site_name: "",
                      start_date: "",
                    }}
                    onRemoveFilter={handleRemoveFilter}
                    showResetBtn={false}
                    showCompResetBtn={false}
                    showStartDate={false}
                  />
                </div>
                <CeoDashSitetable
                  data={apiData?.data}
                  tootiptitle={"Profit"}
                  title={"Sites "}
                />
              </>
            )}
            {title == "Reports" && (
              <>
                <div className="m-4 textend">
                  <CeoFilterBadge
                    filters={{
                      client_name: filterData.client_name,
                      company_name:
                        formik?.values?.selectedCompanyDetails?.company_name,
                      site_name: formik?.values?.selectedSiteDetails?.site_name,
                      start_date: "",
                    }}
                    onRemoveFilter={handleRemoveFilter}
                    showResetBtn={false}
                    showCompResetBtn={false}
                    showStartDate={false}
                  />
                </div>
                <Col sm={12} md={12} key={Math.random()}>
                  <Card className="mt-5">
                    <Card.Body className="">
                      <div className="w-100">
                        <div className="spacebetweenend">
                          {filterData?.sites ? (
                            <Col lg={6} className="textend flexcolumn">
                              <label className=" form-label" htmlFor="report">
                                Site
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                id="selectedSite"
                                name="selectedSite"
                                value={formik.values.selectedSite}
                                style={{ width: "100%" }}
                                onChange={(e) =>
                                  handleSiteChange(e.target.value)
                                }
                                className="selectedMonth"
                              >
                                <option value="">--Select a Site--</option>
                                {filterData?.sites?.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.site_name}
                                  </option>
                                ))}
                              </select>
                            </Col>
                          ) : (
                            ""
                          )}
                          {apiData?.data?.months ? (
                            <Col lg={6} className="textend flexcolumn">
                              <label className=" form-label" htmlFor="report">
                                Month
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                id="selectedMonth"
                                name="selectedMonth"
                                style={{ width: "100%" }}
                                value={formik.values.selectedMonth}
                                onChange={(e) =>
                                  handleMonthChange(e.target.value)
                                }
                                className="selectedMonth"
                              >
                                <option value="">--Select a Month--</option>
                                {apiData?.data?.months?.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.display}
                                  </option>
                                ))}
                              </select>
                            </Col>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="spacebetweenend"></div>
                      </div>
                    </Card.Body>
                  </Card>
                  <Card className="">
                    <Card.Header className="p-4 w-100  ">
                      <div className="spacebetweenend">
                        <h4 className="card-title">
                          Reports{" "}
                          {formik.values?.selectedSiteDetails?.site_name &&
                            ` (${formik.values.selectedSiteDetails.site_name})`}
                        </h4>
                        {userPermissions?.includes("report-type-list") ? (
                          <span className="textend">
                            <Link to="/reports">View All</Link>
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div>
                        <ReportTable
                          reports={apiData?.data?.reports}
                          pdfisLoading={pdfisLoading}
                          handleDownload={handleDownload}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            )}

            {(title === "Stock" ||
              title === "Shrinkage" ||
              title === "Stock Details") && (
              <>
                <div className="m-4 textend">
                  {" "}
                  <CeoFilterBadge
                    filters={{
                      client_name: filterData.client_name,
                      company_name:
                        formik?.values?.selectedCompanyDetails?.company_name,
                      site_name: formik?.values?.selectedSiteDetails?.site_name,
                      start_date: "",
                    }}
                    onRemoveFilter={handleRemoveFilter}
                    showResetBtn={true}
                    showStartDate={false}
                  />
                </div>
                <Card className="">
                  <Card.Body className="">
                    <Row>
                      {filterData?.companies && (
                        <SelectField
                          label="Company"
                          id="selectedCompany"
                          name="selectedCompany"
                          value={formik.values.selectedCompany}
                          options={filterData.companies}
                          onChange={handleCompanyChange}
                          required={true}
                        />
                      )}

                      {filterData?.sites && (
                        <SelectField
                          label="Site"
                          id="selectedSite"
                          name="selectedSite"
                          value={formik.values.selectedSite}
                          options={filterData.sites}
                          onChange={handleSiteChange}
                          placeholder="--Select a Site--"
                        />
                      )}
                    </Row>
                  </Card.Body>
                </Card>
                <Row className=" d-flex align-items-stretch">
                  <Col
                    sm={12}
                    md={6}
                    xl={6}
                    key={Math.random()}
                    className="mb-6"
                  >
                    <Card className="h-100">
                      <Card.Header className="p-4">
                        <h4 className="card-title">Stocks</h4>
                      </Card.Header>
                      <Card.Body
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ width: "300px", height: "300px" }}>
                          <Doughnut
                            data={StockData?.stock_graph_data}
                            options={StockData?.stock_graph_options}
                            height="100px"
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col
                    sm={12}
                    md={6}
                    xl={6}
                    key={Math.random()}
                    className="mb-6"
                  >
                    <CeoDashboardBarChart
                      data={Shrinkage?.shrinkage_graph_data}
                      options={Shrinkage?.shrinkage_graph_options}
                      title="Shrinkage"
                      width="300px"
                      height="200px"
                    />
                  </Col>
                  <Col sm={12} md={12} xl={12} key={Math.random()} className="">
                    <Card className="h-100">
                      <Card.Header className="p-4 w-100 flexspacebetween">
                        <h4 className="card-title">
                          {" "}
                          <div className="lableWithsmall">Stock Details</div>
                        </h4>
                        <span style={{ color: "#4663ac", cursor: "pointer" }}>
                          View Details
                        </span>
                      </Card.Header>
                      <Card.Body style={{ maxHeight: "350px" }}>
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                            }}
                          >
                            <thead
                              style={{
                                position: "sticky",
                                top: 0,
                                backgroundColor: "#fff",
                                zIndex: 1,
                              }}
                            >
                              <tr>
                                <th
                                  style={{ textAlign: "left", padding: "8px" }}
                                >
                                  Name
                                </th>
                                <th
                                  style={{ textAlign: "left", padding: "8px" }}
                                >
                                  Gross Sales
                                </th>
                                <th
                                  style={{ textAlign: "left", padding: "8px" }}
                                >
                                  Nett Sales
                                </th>
                                <th
                                  style={{ textAlign: "left", padding: "8px" }}
                                >
                                  Profit
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {StockDetail?.map((stock) => (
                                <tr key={stock?.id}>
                                  <td style={{ padding: "8px" }}>
                                    {stock?.name}
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    {stock?.gross_sales}
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    {stock?.nett_sales}
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    {stock?.profit}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default withApi(CeoDetailModal);
