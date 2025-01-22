import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import {
  Breadcrumb,
  Card,
  Col,
  Row,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import useErrorHandler from "../../CommonComponent/useErrorHandler";
import FormikSelect from "../../Formik/FormikSelect";
import FormikInput from "../../Formik/FormikInput";

const AddFuelAutomation = ({ isLoading, postData }) => {
  const { handleError } = useErrorHandler();
  const { id, siteName } = useParams();

  const handlePostData = async (values) => {
    try {
      const formData = new FormData();
      formData.append("frequency", values.frequency);
      formData.append("site_id", id);
      formData.append("value", values.value);
      formData.append("time", values.time);
      formData.append("action", values.action);

      const postDataUrl = "/site/fuel-automation-setting/add";
      const navigatePath = `/manage-fuel-automation/${id}`;

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const validationSchema = Yup.object({
    frequency: Yup.string().required("Frequency is required"),
    value: Yup.string().required("Value is required"),
    time: Yup.string().required("Time is required"),
    action: Yup.string().required("Action is required"),
  });

  const formik = useFormik({
    initialValues: {
      frequency: "1",
      value: "",
      time: "",
      action: "1",
      sort_code: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      handlePostData(values);
    },
  });

  const frequencyOptions = [{ id: 1, name: "Daily" }];

  // Function to handle the action click and set the formik value
  const handleActionClick = (actionType) => {
    formik.setFieldValue("action", actionType); // Set 'up' or 'down'
  };

  // Tooltip for better UI
  const renderTooltip = (message) => (
    <Tooltip id="button-tooltip">{message}</Tooltip>
  );

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Add Fuel Automation ({siteName})</h1>

            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item  breadcrumds"
                aria-current="page"
                linkAs={Link}
                linkProps={{ to: `/manage-fuel-automation/${id}` }}
              >
                Fuel Automation
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Add Fuel Automation
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Add Fuel Automation</Card.Title>
              </Card.Header>
              <form onSubmit={formik.handleSubmit}>
                <Card.Body>
                  <Row>
                    <Col lg={3} md={6}>
                      <FormikSelect
                        formik={formik}
                        name="frequency"
                        label={"Frequency"}
                        options={frequencyOptions?.map((item) => ({
                          id: item?.id,
                          name: item?.name,
                        }))}
                        className="form-input"
                      />
                    </Col>

                    <Col lg={3} md={6}>
                      <FormikInput
                        formik={formik}
                        type="number"
                        label="Value"
                        name="value"
                        step="0.0001"
                      />
                    </Col>

                    <Col lg={3} md={6}>
                      <FormikInput
                        formik={formik}
                        type="time"
                        label="Time"
                        name="time"
                      />
                    </Col>
                    <Col
                      lg={3}
                      md={6}
                      className="d-flex justify-content-center align-items-center gap-3"
                    >
                      <div className="form-group mt-6 d-flex gap-4">
                        {/* Up Arrow Button */}
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip("Increase Value")}
                        >
                          <button
                            type="button"
                            onClick={() => handleActionClick(1)}
                            className={`btn-action ${
                              formik.values.action === 1
                                ? "highlighted btn btn-primary"
                                : "work-flow-sucess-status"
                            }`}
                          >
                            <i className={`ph ph-arrow-up`}></i>
                          </button>
                        </OverlayTrigger>

                        {/* Down Arrow Button */}
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip("Decrease Value")}
                        >
                          <button
                            type="button"
                            onClick={() => handleActionClick(2)}
                            className={`btn-action ${
                              formik.values.action === 2
                                ? "highlighted btn btn-danger"
                                : "work-flow-danger-status"
                            }`}
                          >
                            <i className={`ph ph-arrow-down`}></i>
                          </button>
                        </OverlayTrigger>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer>
                  <div className="text-end my-5 text-end-small-screen">
                    <Link
                      type="submit"
                      className="btn btn-danger me-2 "
                      to={`/manage-fuel-automation/${id}`}
                    >
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </Card.Footer>
              </form>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withApi(AddFuelAutomation);
