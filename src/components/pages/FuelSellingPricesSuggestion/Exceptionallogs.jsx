import { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import { Collapse } from "antd";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import TabDesign from "../FuelSellingSuggestionLogs/TabDesign";


const Exceptionallogs = (props) => {
    const { getData, isLoading, postData } = props;
    const [selectedDrsDate, setSelectedDrsDate] = useState("");
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

    const [isNotClient] = useState(
        localStorage.getItem("superiorRole") !== "Client"
    );
    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        company_id: Yup.string().required("Company is required"),

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
            console.log(values, "values");
            handleSubmit1(values);
        }
    };


    const handleClearForm = async (resetForm) => {
        setData(null);
    };



    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <>

                <div className="page-header ">
                    <div>
                        <h1 className="page-title">Fuel  Price Exceptional Logs</h1>
                        <Breadcrumb className="breadcrumb">
                            <Breadcrumb.Item
                                className="breadcrumb-item"
                                linkAs={Link}
                                linkProps={{ to: "/ceodashboard" }}
                            >
                                Dashboard
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                Fuel  Price Exceptional Logs
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
                    <Col md={12} xl={12}>      <TabDesign /></Col>
                </Row>



            </>
        </>
    );
};

export default withApi(Exceptionallogs);
