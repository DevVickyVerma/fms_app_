import { useEffect, useState } from 'react';
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const EditOpeningBalance = ({ isLoading, postData, getData }) => {

  const [siteName] = useState("");
  const { handleError } = useErrorHandler();
  const [AddCatSiteData, setCatSiteData] = useState([]);

  const FetchCategoryList = async () => {
    try {
      const response = await getData(`common/category-list`);

      if (response && response.data) {

        setCatSiteData(response.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };


  useEffect(() => {
    FetchCategoryList();
  }, []);

  const { id } = useParams();



  const handlePostData = async (values) => {
    try {
      const formData = new FormData();
      formData.append("site_id", values.site_id);
      formData.append("id", values.id);
      formData.append("business_category_id", values.business_category_id);
      formData.append(
        "business_sub_category_id",
        values.business_sub_category_id
      );

      formData.append("id", id);
      const postDataUrl = "/assignsubcategory/update";
      const navigatePath = `/assign-business-sub-categories/${values.site_id}`;
      // await postData(postDataUrl, formData,); // Set the submission state to false after the API call is completed
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const validationSchema = Yup.object({
    business_sub_category_id: Yup.string().required(
      "Business Sub Category is required"
    ),
    business_category_id: Yup.string().required(
      "Business Category is required"
    ),
  });

  const formik = useFormik({
    initialValues: {
      site_id: "",
      business_sub_category_id: "",
      business_category_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      handlePostData(values);
    },
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {" "}
              Edit Hide Business Categories ({siteName})
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
                linkProps={{ to: "/sites" }}
              >
                Sites
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item  breadcrumds"
                aria-current="page"
                linkAs={Link}
                linkProps={{
                  to: `/hide-business-categories/${formik?.values?.site_id}`,
                }}
              >
                Hide Business Categories
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Edit Hide Business Categories
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">
                  {" "}
                  Edit Hide Business Categories
                </Card.Title>
              </Card.Header>
              <form onSubmit={formik.handleSubmit}>
                <Card.Body>
                  <Row>
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="business_category_id"
                          className=" form-label mt-4"
                        >
                          Select Business Category
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          as="select"
                          className={`input101 ${formik.errors.business_category_id &&
                            formik.touched.business_category_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="business_category_id"
                          name="business_category_id"
                          onChange={formik.handleChange}
                          value={formik?.values?.business_category_id}
                        >
                          <option value=""> Select Business Category</option>
                          {AddCatSiteData.data ? (
                            AddCatSiteData.data.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.category_name}
                              </option>
                            ))
                          ) : (
                            <option disabled={true}>No Business Category</option>
                          )}
                        </select>
                        {formik.errors.business_category_id &&
                          formik.touched.business_category_id && (
                            <div className="invalid-feedback">
                              {formik.errors.business_category_id}
                            </div>
                          )}
                      </div>
                    </Col>

                  </Row>
                </Card.Body>
                <Card.Footer className="text-end">
                  <Link
                    type="submit"
                    className="btn btn-danger me-2 "
                    to={`/assign-business-sub-categories/${formik?.values?.site_id}`}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary me-2 "
                  // disabled={Object.keys(errors).length > 0}
                  >
                    Save
                  </button>
                </Card.Footer>
              </form>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withApi(EditOpeningBalance);
