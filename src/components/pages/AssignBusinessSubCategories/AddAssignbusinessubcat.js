import { useEffect, useState } from 'react';
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const AddOpeningBalance = ({ isLoading, postData, getData }) => {
  const { handleError } = useErrorHandler();
  const { id, siteName } = useParams();
  const [AddCatSiteData, setCatSiteData] = useState([]);
  const [AddSubCatSiteData, setSubCatSiteData] = useState([]);

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
  const FetchSubCategoryList = async () => {
    try {
      const response = await getData(`/site-fuel/sub-categories-list?site_id=${id}`);


      if (response && response.data) {
        setSubCatSiteData(response.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  useEffect(() => {
    FetchCategoryList();
    FetchSubCategoryList()
  }, []);



  const handlePostData = async (values) => {
    try {
      const formData = new FormData();
      formData.append("site_id", values.site_id);
      formData.append("business_category_id", values.business_category_id);
      formData.append(
        "business_sub_category_id",
        values.business_sub_category_id
      );
      const postDataUrl = "/assignsubcategory/add";
      const navigatePath = `/assign-business-sub-categories/${id}`;

      await postData(postDataUrl, formData, navigatePath);
    } catch (error) {
      handleError(error);
    }
  };

  const validationSchema = Yup.object({
    business_sub_category_id: Yup.string().required("Business Sub Category is required"),
    business_category_id: Yup.string().required("Business Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      site_id: id,
      business_sub_category_id: "",
      business_category_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
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
              Assign Business Sub Categories ({siteName})
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
                linkProps={{ to: `/assign-business-sub-categories/${id}` }}
              >
                Manage Assigned Business Sub Categories
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Assign Business Sub Categories
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">
                  Assign Business Sub Categories
                </Card.Title>
              </Card.Header>
              <form onSubmit={formik.handleSubmit}>
                <Card.Body>
                  <Row>
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label htmlFor="business_category_id" className=" form-label mt-4">
                          Select Business Category
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          as="select"
                          className={`input101 ${formik.errors.business_category_id && formik.touched.business_category_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="business_category_id"
                          name="business_category_id"
                          onChange={formik.handleChange}
                        >
                          <option value=""> Select Business Category</option>
                          {AddCatSiteData.data ? (
                            AddCatSiteData.data.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.category_name}
                              </option>
                            ))
                          ) : (
                            <option disabled={true}>No SubBusiness  Type</option>
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
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label htmlFor="business_sub_category_id" className=" form-label mt-4">
                          Select Sub Business Category
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          as="select"
                          className={`input101 ${formik.errors.business_sub_category_id && formik.touched.business_sub_category_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="business_sub_category_id"
                          name="business_sub_category_id"
                          onChange={formik.handleChange}
                        >
                          <option value=""> Select  Sub Business Category</option>
                          {AddSubCatSiteData.data?.fuels ? (
                            AddSubCatSiteData.data?.fuels.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))
                          ) : (
                            <option disabled={true}>No SubBusiness  Type</option>
                          )}
                        </select>
                        {formik.errors.business_sub_category_id &&
                          formik.touched.business_sub_category_id && (
                            <div className="invalid-feedback">
                              {formik.errors.business_sub_category_id}
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
                  <button type="submit" className="btn btn-primary me-2 ">
                    Assign Business Sub Categories
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

export default withApi(AddOpeningBalance);
