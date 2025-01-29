import { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useCustomDelete from "../../../Utils/useCustomDelete";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import * as Yup from "yup";
import { handleFilterData } from "../../../Utils/commonFunctions/commonFunction";
import { useFormik } from "formik";
import CurrentDateTable from "../../../Utils/commonFunctions/CurrentDateTable";

const FuelAutomation = ({ isLoading, getData, postData, apidata }) => {
  let storedKeyName = "localFilterModalData";
  const [data, setData] = useState();
  const [dataSetting, setDataSetting] = useState();
  const ReduxFullData = useSelector((state) => state?.data?.data);
  const { customDelete } = useCustomDelete();

  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  const isEditPermissionAvailable = userPermissions?.includes(
    "fuel-automation-edit"
  );

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      console.log("Form values:", values);
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    console.log(values, "values");

    const formData = new FormData();
    formData.append("site_id", values?.site_id);

    // Iterate through each setting (parent)
    values?.setting?.forEach((parentItem, parentIndex) => {
      formData.append(`time[${parentIndex}]`, parentItem?.time);
      formData.append(`frequency[${parentIndex}]`, parentItem?.frequency);

      // Iterate through each grade (child) of the current setting
      parentItem?.grades?.forEach(({ id, action = 1, value = 0 }) => {
        if (id) {
          // Ensure the id exists before appending
          formData.append(`action[${parentIndex}][${id}]`, action);
          formData.append(`value[${parentIndex}][${id}]`, value);
        }
      });
    });

    try {
      const postDataUrl = "/site/fuel-automation-setting/update";
      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed

      if (apidata.api_response === "success") {
        handleSuccess();
      }
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };

  const handleSuccess = () => {
    handleFilterData(handleApplyFilters, ReduxFullData, "localFilterModalData");
  };

  const handleDelete = (values) => {
    const formData = new FormData();
    formData.append(`time`, values?.time);
    formData.append(`site_id`, formik?.values?.site_id);
    customDelete(
      postData,
      "site/fuel-automation-setting/delete",
      formData,
      handleSuccess
    );
  };

  useEffect(() => {
    handleFilterData(handleApplyFilters, ReduxFullData, "localFilterModalData");
  }, []);

  const fetchBankManagerList = async (filters) => {
    let { client_id, site_id } = filters;

    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = ReduxFullData?.superiorId;
    }

    if (client_id) {
      try {
        const response = await getData(
          `/site/fuel-automation-setting/list?site_id=${site_id}`
        );
        if (response && response.data) {
          setDataSetting(response?.data?.data);
          formik.setValues(response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } catch (error) {
        console.error(error); // Set the submission state to false if an error occurs
      }
    }
  };

  const handleClearForm = async () => {
    setDataSetting(null);
    formik.resetForm();
  };

  const handleApplyFilters = (values) => {
    if (values?.site_id && values?.company_id) {
      fetchBankManagerList(values);
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
  });

  const handleShowDate = (e) => {
    const inputDateElement = e?.target; // Get the clicked input element
    if (
      inputDateElement &&
      inputDateElement?.showPicker &&
      !inputDateElement?.readOnly &&
      !inputDateElement?.disabled
    ) {
      inputDateElement.showPicker(); // Programmatically trigger the date picker
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <div className="page-header d-flex">
          <div>
            <h1 className="page-title">Fuel Automation </h1>

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
                Fuel Automation
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Fuel Selling Price </h3>
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
                showMonthInput={false}
                showDateInput={false}
                showStationInput={true}
                ClearForm={handleClearForm}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Card.Header className="d-flex justify-content-between">
            <h3 className="card-title ">
              {" "}
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div>
                  <span>
                    Fuel Automation for ({formik.values?.site_name} )
                    <span className="d-flex pt-1 align-items-center c-fs-12">
                      <span className="greenboxx me-2"></span>
                      <span className="text-muted">Current Price</span>
                    </span>
                  </span>
                </div>
              </div>
            </h3>

            {formik?.values?.setting?.length < formik?.values?.max &&
            isEditPermissionAvailable ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary ms-2 btn-sm"
                  onClick={() => {
                    const newSetting = {
                      time: "12:15",
                      frequency: 1,
                      grades:
                        dataSetting?.setting?.[0]?.grades?.map((grade) => ({
                          id: grade?.id,
                          name: grade?.name,
                          action: 1, // default action
                          value: 0.001, // default value
                        })) || [],
                    };
                    formik.setFieldValue("setting", [
                      ...formik.values.setting,
                      newSetting,
                    ]);
                  }}
                >
                  <i className="ph ph-plus"></i>
                </button>
              </>
            ) : (
              ""
            )}
          </Card.Header>

          <Card.Body>
            {dataSetting?.setting?.length > 0 ? (
              <>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    <CurrentDateTable data={dataSetting} />
                  </Row>

                  <Row className="mt-5">
                    {formik.values?.setting?.map(
                      (settingItem, settingIndex) => (
                        <Col lg={6} key={settingIndex}>
                          <>
                            <Card.Header className="d-flex justify-content-between">
                              <h3 className="card-title">
                                <div className="d-flex align-items-center">
                                  <span>
                                    {formik.values?.site_name} - Set Pricing -{" "}
                                  </span>
                                  <span className="circle-num-automation c-fs-12 ms-1">
                                    {settingIndex + 1}
                                  </span>
                                </div>
                              </h3>

                              {isEditPermissionAvailable && (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-danger ms-2 btn-sm"
                                    onClick={() => {
                                      handleDelete(settingItem);
                                    }}
                                  >
                                    <i className="ph ph-trash"></i>
                                  </button>
                                </>
                              )}
                            </Card.Header>
                            <Card.Body>
                              {/* Render time and frequency */}
                              <div className="d-flex justify-content-between gap-4 my-2">
                                <span className="d-flex align-items-center c-fw-500">
                                  Time
                                </span>
                                <span className="c-w-50">
                                  <input
                                    type="time"
                                    className="table-input mx-2"
                                    value={settingItem.time}
                                    onChange={(e) =>
                                      formik.setFieldValue(
                                        `setting[${settingIndex}].time`,
                                        e.target.value
                                      )
                                    }
                                    onClick={handleShowDate}
                                  />
                                </span>
                              </div>
                              <div className="d-flex justify-content-between gap-4 my-2">
                                <span className="d-flex align-items-center c-fw-500">
                                  Frequency
                                </span>
                                <span className="c-w-50">
                                  <input
                                    type="text"
                                    className="table-input mx-2 readonly"
                                    value={
                                      settingItem.frequency == "1"
                                        ? "Daily"
                                        : "-"
                                    }
                                    readOnly={true}
                                    onChange={(e) =>
                                      formik.setFieldValue(
                                        `setting[${settingIndex}].frequency`,
                                        e.target.value
                                      )
                                    }
                                  />
                                </span>
                              </div>

                              {/* Render grades */}
                              {settingItem.grades.map(
                                (gradeItem, gradeIndex) => (
                                  <div
                                    key={gradeIndex}
                                    className="d-flex justify-content-between gap-4 my-2"
                                  >
                                    <span className="d-flex align-items-center c-fw-500">
                                      {gradeItem.name}
                                    </span>
                                    <span className="c-w-50">
                                      <div className="d-flex align-items-center">
                                        <input
                                          type="number"
                                          className="table-input mx-2"
                                          step="0.001"
                                          value={gradeItem.value}
                                          onChange={(e) =>
                                            formik.setFieldValue(
                                              `setting[${settingIndex}].grades[${gradeIndex}].value`,
                                              e.target.value
                                            )
                                          }
                                        />

                                        <OverlayTrigger
                                          placement="top"
                                          overlay={<Tooltip>Price Up</Tooltip>}
                                        >
                                          <span>
                                            <button
                                              type="button"
                                              className={`btn btn-sm ms-2 ${gradeItem.action === 1 ? "btn-success" : "btn-light"}`}
                                              onClick={() => {
                                                formik.setFieldValue(
                                                  `setting[${settingIndex}].grades[${gradeIndex}].action`,
                                                  1
                                                );
                                              }}
                                            >
                                              ↑
                                            </button>
                                          </span>
                                        </OverlayTrigger>

                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip>Price Down</Tooltip>
                                          }
                                        >
                                          <span>
                                            <button
                                              type="button"
                                              className={`btn btn-sm ms-2 ${gradeItem.action === 2 ? "btn-danger" : "btn-light"}`}
                                              onClick={() => {
                                                formik.setFieldValue(
                                                  `setting[${settingIndex}].grades[${gradeIndex}].action`,
                                                  2
                                                );
                                              }}
                                            >
                                              ↓
                                            </button>
                                          </span>
                                        </OverlayTrigger>
                                      </div>
                                    </span>
                                  </div>
                                )
                              )}
                            </Card.Body>
                          </>
                        </Col>
                      )
                    )}

                    {isEditPermissionAvailable && (
                      <>
                        <Card.Footer className=" text-end">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </Card.Footer>
                      </>
                    )}
                  </Row>
                </form>
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
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default withApi(FuelAutomation);
