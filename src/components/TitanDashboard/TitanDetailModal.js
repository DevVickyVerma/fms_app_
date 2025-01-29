
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";

import { Bounce, toast } from "react-toastify";

import moment from "moment/moment";
import LoaderImg from "../../Utils/Loader";
import CeoFilterBadge from "../Dashboard/CeoFilterBadge";
import CeoDashSitetable from "../Dashboard/CeoDashSitetable";
import withApi from "../../Utils/ApiHelper";
import useErrorHandler from "../CommonComponent/useErrorHandler";
import { Card, Col } from "react-bootstrap";
import { BestvsWorst, GraphfilterOptions } from "../../Utils/commonFunctions/commonFunction";


const TitanDetailModal = (props) => {
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

    console.log(formik.values, "formik.values");

    const [bestvsWorst, setbestvsWorst] = useState("0");
    const [graphfilterOption, setgraphfilterOption] = useState("weekly");


    return (
        <>
            {isLoading || pdfisLoading ? <LoaderImg /> : ""}
            <div
                className={`common-sidebar    ${visible ? "visible slide-in-right " : "slide-out-right"
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
                            {title}
                        </h3>

                        <button className="close-button" onClick={onClose}>

                            <i className="ph ph-x-circle c-fs-25"></i>
                        </button>
                    </div>
                    <div
                        className="card-body scrollview pt-0"
                        style={{ background: "#f2f3f9" }}
                    >




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
                                <Card className="mt-5">
                                    <Card.Body className="">
                                        <div className="w-100" style={{ display: "flex" }}>

                                            {filterData?.sites ? (
                                                <Col lg={2} className="textend flexcolumn">

                                                    <select
                                                        id="BestvsWorst"
                                                        name="BestvsWorst"
                                                        value={bestvsWorst}
                                                        onChange={(e) => setbestvsWorst(e.target.value)}
                                                        className="selectedMonth ms-2"
                                                    >

                                                        {BestvsWorst?.map((item) => (
                                                            <option key={item.value} value={item.value}>
                                                                {item.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Col>
                                            ) : (
                                                ""
                                            )}
                                            {filterData?.sites ? (
                                                <Col lg={2} className="textend flexcolumn">

                                                    <select
                                                        id="GraphfilterOptions"
                                                        name="GraphfilterOptions"
                                                        value={graphfilterOption}
                                                        onChange={(e) => setgraphfilterOption(e.target.value)}
                                                        className="selectedMonth ms-2"
                                                    >

                                                        {GraphfilterOptions?.map((item) => (
                                                            <option key={item.value} value={item.value}>
                                                                {item.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Col>
                                            ) : (
                                                ""
                                            )}
                                            {filterData?.sites ? (
                                                <Col lg={3} className="textend flexcolumn">
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
                                            {filterData?.sites ? (
                                                <Col lg={3} className="textend flexcolumn">
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
                                                        <option value="">--Select a Grade--</option>
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




                                        </div>
                                    </Card.Body>
                                </Card>
                                <CeoDashSitetable
                                    data={apiData?.data}
                                    tootiptitle={"Profit"}
                                    title={"Sites "}
                                />
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
};

export default withApi(TitanDetailModal);
