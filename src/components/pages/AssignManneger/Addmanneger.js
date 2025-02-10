import { useEffect, useState } from "react";
import { Col, Row, Card, Breadcrumb, FormGroup } from "react-bootstrap";
import * as Yup from "yup";
import { Link, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import FormikReactSelect from "../../Formik/FormikReactSelect";

const AddCompany = (props) => {
  const { isLoading, getData, postData } = props;
  const [dropdownValue, setDropdownValue] = useState([]);
  const { id, siteName } = useParams();
  const UserPermissions = useSelector((state) => state?.data?.data);
  const FetchmannegerList = async () => {
    try {
      const response = await getData(`/site/manager/${id}`);

      if (response && response.data) {
        setDropdownValue(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchmannegerList();
  }, [UserPermissions]);

  const handleSubmit = async () => {
    // event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("user_id", formik.values.user_id);
      formData.append("site_id", id);

      formik.values.reports?.forEach((site, index) => {
        formData.append(`reports[${index}]`, site.value);
      });

      const postDataUrl = "/site/manager/assign";
      const navigatePath = `/assignmanger/${id}`;

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };
  const validationSchema = Yup.object({
    user_id: Yup.string().required("User is required"),
    reports: Yup.array()
      .min(1, "At least one Report is required")
      .required("Reports are required"),
  });

  const formik = useFormik({
    initialValues: {
      user_id: "",
      reports: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleMultiSelectServiceChange = (selectedOptions) => {
    formik.setFieldValue("reports", selectedOptions);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Assign Manager ({siteName})</h1>

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
                  linkProps={{ to: `/assignmanger/${id}` }}
                >
                  Assign Manager
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Add Assign Manager
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Assign Manager</Card.Title>
                </Card.Header>

                <form onSubmit={(event) => formik.handleSubmit(event)}>
                  <Card.Body style={{ minHeight: "300px" }}>
                    <Row>
                      <Col lg={4} md={6}>
                        <FormikReactSelect
                          formik={formik}
                          name="user_id"
                          label="User"
                          options={[
                            { value: "", label: "Select User" },
                            ...(dropdownValue.users?.map((item) => ({
                              value: item.id,
                              label: item.user_name,
                            })) || []),
                          ]}
                          onChange={(selectedOption) => {
                            formik.handleChange(selectedOption.value);
                          }}
                        />
                      </Col>

                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label className="form-label mt-0">
                            Select Report
                            <span className="text-danger">*</span>
                          </label>
                          <div>
                            <MultiSelect
                              value={formik?.values?.reports}
                              onChange={handleMultiSelectServiceChange}
                              labelledBy="Multi Select Reports"
                              options={
                                dropdownValue?.reports?.map((site) => ({
                                  label: site?.report_name,
                                  value: site?.id,
                                })) || []
                              }
                              className="matrix-multi"
                            />
                            {formik.touched.reports &&
                              typeof formik?.errors?.reports === "string" && (
                                <div className="text-danger mt-1">
                                  {formik.errors.reports}
                                </div>
                              )}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Card.Body>

                  <Card.Footer className="text-end">
                    <Link
                      type="submit"
                      className="btn btn-danger me-2 "
                      to={`/assignmanger/${id}`}
                    >
                      Cancel
                    </Link>
                    <button className="btn btn-primary me-2" type="submit">
                      Submit
                    </button>
                  </Card.Footer>
                </form>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(AddCompany);
