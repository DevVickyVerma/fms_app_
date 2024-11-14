import { useEffect } from 'react';

import {
  Col,
  Row,
  Card,
  Breadcrumb,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import useErrorHandler from '../../CommonComponent/useErrorHandler';

const EditSitePump = (props) => {
  const { isLoading, getData, postData } = props;

  const { id } = useParams();
  const { handleError } = useErrorHandler();
  useEffect(() => {
    try {
      FetchRoleList();
    } catch (error) {
      handleError(error);
    }
    console.clear();
  }, [id]);

  const FetchRoleList = async () => {
    try {
      const response = await getData(`/site-ppl/${id}`);

      if (response) {
        formik.setValues(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("sales_volume", values.sales_volume);
      formData.append("pence_per_liter", values.pence_per_liter);

      formData.append("id", values.id);
      formData.append("site_id", values.site_id);

      const postDataUrl = "/site-ppl/update";
      const navigatePath = "/assignppl";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };



  const formik = useFormik({
    initialValues: {
      sales_volume: "",
      pence_per_liter: "",
    },
    validationSchema: Yup.object({
      pence_per_liter: Yup.string().required(" Pence Per Liter is required"),
      sales_volume: Yup.string().required(" Pence Per Liter is required"),
    }),
    onSubmit: handleSubmit,
  });



  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Site PPL Rate</h1>

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
                  linkProps={{ to: "/assignppl" }}
                >
                  Manage Site PPL Rate
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Site PPL Rate
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Site PPL Rate</Card.Title>
                </Card.Header>

                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="sales_volume"
                          >
                            Sales Volume<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.sales_volume &&
                              formik.touched.sales_volume
                              ? "is-invalid"
                              : ""
                              }`}
                            id="sales_volume"
                            name="sales_volume"
                            placeholder="Sales Volume"
                            onChange={formik.handleChange}
                            value={formik.values.sales_volume || ""}
                          />
                          {formik.errors.sales_volume &&
                            formik.touched.sales_volume && (
                              <div className="invalid-feedback">
                                {formik.errors.sales_volume}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label className=" form-label mt-4" htmlFor="name">
                            Pence Per Liter
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.pence_per_liter &&
                              formik.touched.pence_per_liter
                              ? "is-invalid"
                              : ""
                              }`}
                            id="pence_per_liter"
                            name="pence_per_liter"
                            placeholder=" Pence Per Liter"
                            onChange={formik.handleChange}
                            value={formik.values.pence_per_liter}
                          />
                          {formik.errors.pence_per_liter &&
                            formik.touched.pence_per_liter && (
                              <div className="invalid-feedback">
                                {formik.errors.pence_per_liter}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/assignppl/`}
                      >
                        Cancel
                      </Link>

                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(EditSitePump);
