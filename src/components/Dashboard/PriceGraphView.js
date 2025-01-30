import { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import LoaderImg from "../../Utils/Loader";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import NewFilterTab from "../pages/Filtermodal/NewFilterTab";
import {
  getCurrentDate,
  handleFilterData,
} from "../../Utils/commonFunctions/commonFunction";
import NoDataComponent from "../../Utils/commonFunctions/NoDataComponent";
import withApi from "../../Utils/ApiHelper";
import LinesDotGraphchart from "./LinesDotGraphchart";
import { useSelector } from "react-redux";
const PriceGraphView = (props) => {
  const { isLoading, getData, postData } = props;
  const [PriceGraphData, setPriceGraphData] = useState();
  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    site_id: Yup.string().required("Site is required"),
  });
  let storedKeyName = "localFilterModalData";
  const [filters, setFilters] = useState({
    client_id: "",
    company_id: "",
    site_id: "",
  });
  const ReduxFullData = useSelector((state) => state?.data?.data);

  const handleClearForm = () => {
    setFilters(null);
  };
  const handleApplyFilters = async (values) => {
    setFilters(values);

    try {
      const queryParams = new URLSearchParams();
      if (values?.site_id) {
        queryParams.append("site_id", values?.site_id);
      } else {
        values.site_id = values?.sites[0]?.id;
        values.site_name = values?.sites[0]?.site_name;
        queryParams.append("site_id", values?.sites[0]?.id); // Replace 'default_value' as needed
      }

      const queryString = queryParams.toString();
      const response = await getData(
        `ceo-dashboard/price-graph-stats?${queryString}`
      );

      if (response && response.data && response.data.data) {
        setPriceGraphData(response?.data?.data);
      }
    } catch (error) {
      // handleError(error);
    }
  };
  const [permissionsArray, setPermissionsArray] = useState([
    ReduxFullData?.permissions,
  ]);
  // useEffect(() => {

  //     if (filters) {
  //         if (filterData?.site_id) {
  //             const selectedItem = filterData?.sites.find(
  //                 (item) => item.id === filterData?.site_id
  //             );
  //             formik.setFieldValue("selectedSite", filterData?.site_id);
  //             formik.setFieldValue("selectedSiteDetails", selectedItem);
  //             formik.setFieldValue("site_name", filterData?.site_name);
  //         } else if (filterData?.company_id) {
  //             const selectedItem = filterData?.companies?.find(
  //                 (item) => item.id === filterData?.company_id
  //             );
  //             formik.setFieldValue("company_id", filterData?.company_id);
  //             formik.setFieldValue("selectedCompany", filterData?.company_id);
  //             formik.setFieldValue("selectedCompanyDetails", selectedItem);
  //         }

  //         if (filterData?.company_id) {
  //             const selectedItem = filterData?.companies?.find(
  //                 (item) => item.id === filterData?.company_id
  //             );
  //             formik.setFieldValue("company_id", filterData?.company_id);
  //             formik.setFieldValue("selectedCompany", filterData?.company_id);
  //             formik.setFieldValue("selectedCompanyDetails", selectedItem);
  //         }
  //     }
  // }, [visible]);

  useEffect(() => {
    handleFilterData(handleApplyFilters, ReduxFullData, "localFilterModalData");
  }, [permissionsArray?.includes("ceodashboard-view")]);

  return (
    <>
      {isLoading ? <LoaderImg /> : null}

      <>
        <div className="page-header d-flex flex-wrap">
          <div className="mb-2 mb-sm-0">
            <h1 className="page-title">Price Graph</h1>
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
                Price Graph
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Filter</h3>
              </Card.Header>
              <NewFilterTab
                getData={getData}
                isLoading={isLoading}
                isStatic={true}
                onApplyFilters={handleApplyFilters}
                validationSchema={validationSchemaForCustomInput}
                storedKeyName={storedKeyName}
                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                lg="4"
                showStationValidation={true}
                showMonthInput={false}
                showDateInput={false}
                showStationInput={true}
                ClearForm={handleClearForm}
                parentMaxDate={getCurrentDate()}
              />
            </Card>
          </Col>
        </Row>

        {filters?.site_name ? (
          <Row
            style={{
              marginBottom: "10px",
              marginTop: "20px",
            }}
          >
            <Col lg={12} md={12} className="">
              <Card className="">
                <Card.Header>
                  <div className="w-100">
                    <div className="spacebetweenend">
                      <h4 className="card-title">
                        Price Graph ({filters?.site_name})
                      </h4>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  {PriceGraphData?.labels &&
                  PriceGraphData?.fuel_type?.length > 0 &&
                  PriceGraphData?.datasets?.length > 0 ? (
                    <LinesDotGraphchart stockGraphData={PriceGraphData} />
                  ) : (
                    <NoDataComponent />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <NoDataComponent title={"Price Graph"} />
        )}
      </>
    </>
  );
};
export default withApi(PriceGraphView);
