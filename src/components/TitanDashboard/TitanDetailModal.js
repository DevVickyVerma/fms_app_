
import { useEffect, useState } from "react";
import { useFormik } from "formik";

import moment from "moment/moment";
import LoaderImg from "../../Utils/Loader";
import CeoFilterBadge from "../Dashboard/CeoFilterBadge";
import withApi from "../../Utils/ApiHelper";
import useErrorHandler from "../CommonComponent/useErrorHandler";
import { Card, Col } from "react-bootstrap";
import { BestvsWorst, GraphfilterOptions } from "../../Utils/commonFunctions/commonFunction";
import DataTable from "react-data-table-component";
import NoDataComponent from "../../Utils/commonFunctions/NoDataComponent";
import TitanStatsTable from "./TitanStatsTable";


const TitanDetailModal = (props) => {
    const {
        title,
        getData,
        visible,
        onClose,
        isLoading,
        filterData,
        cardID,

    } = props;
    const [apiData, setApiData] = useState(); // to store API response data
    const [loading, setLoading] = useState(false);

    console.log(filterData, "filterData");
    const { handleError } = useErrorHandler();



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



    const formik = useFormik({
        initialValues: {
            client_id: "",
            company_id: "",
            company_name: "",
            comparison_value: "weekly",
            comparison_label: "Weekly",
            grades: [],
            selectedGrade: "",
            selectedGrade: "",
            selectedTank: "",
            selectedCompany: "",
            selectedTankDetails: "",
            selectedGradeDetails: "",
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


    const onSiteSelect = async (selectedId) => {
        const selectedSite = siteList?.find(site => site.id === selectedId);
        try {

            if (selectedSite) {
                await formik.setFieldValue("selectedSite", selectedSite?.id);
                await formik.setFieldValue("selectedSiteDetails", selectedSite);
            } else {
                await formik.setFieldValue("selectedSite", "");
                await formik.setFieldValue("selectedSiteDetails", "");
            }

            // Update Formik state with selected site and its details

        } catch (error) {
            console.error("Error in handleSiteChange:", error);
        }
    }

    const handleGradeChange = async (selectedId) => {
        const selectedSite = formik.values?.selectedSiteDetails?.fuel?.find(site => site.id == selectedId);
        if (selectedSite) {
            await formik.setFieldValue("selectedGrade", selectedId)
            await formik.setFieldValue("selectedGradeDetails", selectedSite)
        } else {
            await formik.setFieldValue("selectedGrade", "");
            await formik.setFieldValue("selectedGradeDetails", "");
        }
    };
    const handleTankChange = async (selectedId) => {
        const selectedSite = formik.values?.selectedGradeDetails?.tanks?.find(site => site.id == selectedId);
        if (selectedSite) {
            await formik.setFieldValue("selectedTank", selectedId)
            await formik.setFieldValue("selectedTankDetails", selectedSite)
        } else {
            await formik.setFieldValue("selectedTank", "");
            await formik.setFieldValue("selectedTankDetails", "");
        }
    };

    useEffect(() => {
        fetchData(); // Trigger the fetchData function on component mount or title change
    }, [title, formik?.values?.selectedTank]); // Dependencies: title and selectedSite
    console.log(formik?.values, "filterData");
    const fetchData = async () => {
        try {
            setLoading(true); // Start loading indicator
            const queryParams = new URLSearchParams();



            if (cardID) {
                queryParams.append("card_id", cardID);
                queryParams.append("site_id", filterData.site_id);
                const formattedStartDate = moment(filterData?.range_start_date).format('YYYY-MM-DD');
                const formattedEndDate = moment(filterData?.range_end_date).format('YYYY-MM-DD');
                queryParams.append("start_date", formattedStartDate);
                queryParams.append("end_date", formattedEndDate);
            } else if (title == "Performance") {
                queryParams.append("client_id", filterData.client_id);
                queryParams.append("company_id", filterData.company_id);
                queryParams.append("case", bestvsWorst);
                queryParams.append("filter_type", graphfilterOption);
                if (formik?.values?.selectedTank) {
                    queryParams.append("site_id", formik?.values?.selectedSite);
                    queryParams.append("grade_id", formik?.values.selectedGrade);
                    queryParams.append("tank_id", formik?.values.selectedTank);
                }
            }
            const queryString = queryParams.toString(); // Construct the query string
            let response;
            // Dynamically handle API calls based on the title
            switch (title) {
                case "Card Reconciliation Details":
                    response = await getData(`credit-card/get-diff-transcations?${queryString}`);
                    break;

                case "Performance":
                    response = await getData(
                        `titan-dashboard/performance-stats?${queryString}`
                    );
                    break;

                default:
                    console.log("Title not recognized");
            }

            if (response) {
                setApiData(response.data?.data); // Assuming response has a 'data' field
                console.log(response, "response");
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








    const [bestvsWorst, setbestvsWorst] = useState("0");
    const [graphfilterOption, setgraphfilterOption] = useState("weekly");

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
            name: "Card Name",
            selector: (row) => [row.card_name],
            sortable: false,
            width: "20%",
            cell: (row) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-flex">
                        <h6 className="mb-0 fs-14 fw-semibold wrap-text">
                            {row.card_name}
                        </h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Card Trans Date/Time",
            selector: (row) => [row.card_transaction_date],
            sortable: false,
            width: "21%",
            cell: (row) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-flex">
                        <h6 className="mb-0 fs-14 fw-semibold wrap-text">
                            {row.card_transaction_date}
                        </h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Till Trans Date/Time",
            selector: (row) => [row.transaction_date],
            sortable: false,
            width: "21%",
            cell: (row) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-flex">
                        <h6 className="mb-0 fs-14 fw-semibold wrap-text">
                            {row.transaction_date}
                        </h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Till Amt",
            selector: (row) => [row.total_price_till],
            sortable: false,
            width: "10%",
            cell: (row) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.total_price_till}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Card Amt.",
            selector: (row) => [row.total_price_bank],
            sortable: false,
            width: "10%",
            cell: (row) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">  {parseFloat(row.total_price_bank).toFixed(3)}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Difference",
            selector: (row) => [row.price_difference],
            sortable: false,
            width: "10%",
            cell: (row) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">   {parseFloat(row.price_difference).toFixed(3)}</h6>
                    </div>
                </div>
            ),
        },


    ];

    const siteList = apiData?.fuel_mapping?.map(site => ({
        id: site.site_id,
        name: site.name,
        fuel: site?.fuel // Extract fuel types
    }));


    return (
        <>
            {isLoading || loading ? <LoaderImg /> : ""}
            <div
                className={`common-sidebar    ${visible ? "visible slide-in-right " : "slide-out-right"
                    }`}
                style={{
                    width:
                        title == "MOP Breakdown"
                            ? "50%"
                            : title == "Card Reconciliation Details"
                                ? "60%"
                                : title == "Comparison"
                                    ? "70%"
                                    : "80%",
                }}
            >
                <div className="card">
                    <div className="card-header text-center SidebarSearchheader">
                        <h3 className=" card-title SidebarSearch-title m-0">
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

                                    {formik?.values?.selectedTankDetails?.name ? <CeoFilterBadge
                                        filters={{
                                            client_name: filterData.client_name,
                                            company_name:
                                                filterData?.company_name,
                                            site_name: formik?.values?.selectedSiteDetails?.name, // Fixed formatting
                                            grade: formik?.values?.selectedGradeDetails?.name, // Ensure correct property
                                            tank: formik?.values?.selectedTankDetails?.name,
                                        }}
                                        onRemoveFilter={handleRemoveFilter}
                                        showResetBtn={false}
                                        showCompResetBtn={false}
                                        showStartDate={false}
                                    /> : <CeoFilterBadge
                                        filters={{
                                            client_name: filterData.client_name,
                                            company_name:
                                                filterData?.company_name,

                                        }}
                                        onRemoveFilter={handleRemoveFilter}
                                        showResetBtn={false}
                                        showCompResetBtn={false}
                                        showStartDate={false}
                                    />}


                                </div>
                                <Card className="mt-5">
                                    <Card.Body className="">
                                        <div className="w-100" style={{ display: "flex" }}>

                                            {filterData?.sites ? (
                                                <Col lg={1} className="textend flexcolumn ms-2 p-0 m-0">

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
                                                            onSiteSelect(e.target.value)
                                                        }
                                                        className="selectedMonth"
                                                    >
                                                        <option value="">--Select a Site--</option>
                                                        {siteList?.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.name}
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
                                                        id="selectedGrade"
                                                        name="selectedGrade"
                                                        value={formik.values.selectedGrade}
                                                        style={{ width: "100%" }}
                                                        onChange={(e) =>
                                                            handleGradeChange(e.target.value)
                                                        }
                                                        className="selectedMonth"
                                                    >
                                                        <option value="">--Select a Grade--</option>
                                                        {formik.values?.selectedSiteDetails?.fuel?.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.name}
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
                                                        id="selectedTank"
                                                        name="selectedTank"
                                                        value={formik.values.selectedTank}
                                                        style={{ width: "100%" }}
                                                        onChange={(e) =>
                                                            handleTankChange(e.target.value)
                                                        }
                                                        className="selectedMonth"
                                                    >
                                                        <option value="">--Select a Tank--</option>
                                                        {formik.values?.selectedGradeDetails?.tanks?.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.name}
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
                                <TitanStatsTable
                                    data={apiData?.stats}
                                    tootiptitle={"Profit"}
                                    title={"Sites "}
                                />
                            </>
                        )}
                        {title == "Card Reconciliation Details" && (
                            <>
                                <div className="m-4 textend">
                                    <CeoFilterBadge
                                        filters={{
                                            client_name: filterData.client_name,
                                            company_name:
                                                filterData?.company_name,
                                            site_name: filterData?.site_name,

                                        }}
                                        onRemoveFilter={handleRemoveFilter}
                                        showResetBtn={false}
                                        showCompResetBtn={false}
                                        showStartDate={false}
                                    />
                                </div>
                                <Card>

                                    <Card.Body>
                                        {apiData?.length > 0 ? (
                                            <>
                                                <div className="table-responsive deleted-table">
                                                    <DataTable
                                                        columns={columns}
                                                        data={apiData}
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
                                                <NoDataComponent />
                                            </>
                                        )}
                                    </Card.Body>

                                </Card>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
};

export default withApi(TitanDetailModal);
