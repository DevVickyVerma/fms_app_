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
  const { id } = useParams();
  const UserPermissions = useSelector((state) => state?.data?.data);

  const FetchManagerList = async (id) => {
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

  const FetchManagerDetailList = async () => {
    try {
      const response = await getData(`/site/manager/detail/${id}`);

      if (response && response.data) {
        formik.setValues(response?.data?.data);
        FetchManagerList(response?.data?.data?.site_id);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchManagerDetailList();
  }, [UserPermissions]);

  const handleSubmit = async () => {
    // event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("user_id", formik?.values?.user_id);
      formData.append("id", formik.values?.id);

      formik.values.reports?.forEach((site, index) => {
        formData.append(`reports[${index}]`, site?.value);
      });

      const postDataUrl = "/site/manager/update";
      const navigatePath = `/assignmanger/${formik?.values?.site_id}`;

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      userSelectedid: "",
      user_id: "",
      reports: [],
    },
    validationSchema: Yup.object({
      user_id: Yup.string().required("User is required"),
      reports: Yup.array()
        .min(1, "At least one Report is required")
        .required("Reports are required"),
    }),
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
              <h1 className="page-title">
                Edit Site Manager ({formik?.values?.site_name})
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
                  className="breadcrumb-item"
                  linkAs={Link}
                  linkProps={{
                    to: `/assignmanger/${formik?.values?.site_id}`,
                  }}
                >
                  Assign Manager
                </Breadcrumb.Item>

                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Site Manager
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Card>
            <Card.Header>
              <Card.Title as="h3">Edit Site Manager</Card.Title>
            </Card.Header>

            <form onSubmit={(event) => formik.handleSubmit(event)}>
              <Card.Body style={{ minHeight: "400px" }}>
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
                <button className="btn btn-primary me-2" type="submit">
                  Submit
                </button>
              </Card.Footer>
            </form>
          </Card>
        </div>
      </>
    </>
  );
};
export default withApi(AddCompany);
