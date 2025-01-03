import { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import { Link, useParams } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, Col, Row, Breadcrumb } from "react-bootstrap";
import useErrorHandler from "../../CommonComponent/useErrorHandler";
import FormikInput from "../../Formik/FormikInput";
import { useSelector } from "react-redux";

const SiteBudget = (props) => {
  const { getData, postData, isLoading } = props;
  const [data, setData] = useState();
  const { id } = useParams(); // Destructure id from useParams()
  const { handleError } = useErrorHandler();

  const UserPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  const isUpdatePermissionAvailable =
    UserPermissions?.includes("budget-update");

  useEffect(() => {
    GetListing();
  }, []);

  const GetListing = async () => {
    try {
      const response = await getData(`/site/budget/list?site_id=${id}`);
      if (response) {
        setData(response?.data?.data);
        formik.setValues(response?.data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const validationSchema = Yup.object({
    fuel_sales: Yup.number()
      .required("Fuel sales is required")
      .typeError("Fuel sales must be a number"),
    gross_volume: Yup.number()
      .required("Gross volume is required")
      .typeError("Gross volume must be a number"),
    shop_fees: Yup.number()
      .required("Shop fees is required")
      .typeError("Shop fees must be a number"),
    shop_margin: Yup.number()
      .required("Shop margin is required")
      .typeError("Shop margin must be a number"),
    shop_profit: Yup.number()
      .required("Shop profit is required")
      .typeError("Shop profit must be a number"),
    shop_sales: Yup.number()
      .required("Shop sales is required")
      .typeError("Shop sales must be a number"),
  });

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append(`site_id`, id);
      formData.append(`fuel_sales`, values?.fuel_sales);
      formData.append(`gross_volume`, values?.gross_volume);
      formData.append(`shop_fees`, values?.shop_fees);
      formData.append(`shop_margin`, values?.shop_margin);
      formData.append(`shop_profit`, values?.shop_profit);
      formData.append(`shop_sales`, values?.shop_sales);

      const postDataUrl = "site/budget/update";
      const navigatePath = `/sites`;
      await postData(postDataUrl, formData, navigatePath);
    } catch (error) {
      handleError(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      fuel_sales: "", // Or initialize to 0 if you prefer: 0
      gross_volume: "",
      shop_fees: "",
      shop_margin: "",
      shop_profit: "",
      shop_sales: "",
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div className="page-header d-flex manageSite-header">
        <div>
          <h1 className="page-title dashboard-page-title">
            {" "}
            Site Budget ({data?.name})
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
              Manage Site
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Site Budget
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title"> Site Budget ({data?.name}) </h3>
            </Card.Header>

            <Card.Body>
              <form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col lg={4}>
                    <FormikInput
                      formik={formik}
                      type="number"
                      name="fuel_sales"
                    />
                  </Col>
                  <Col lg={4}>
                    <FormikInput
                      formik={formik}
                      type="number"
                      name="gross_volume"
                    />
                  </Col>
                  <Col lg={4}>
                    <FormikInput
                      formik={formik}
                      type="number"
                      name="shop_fees"
                    />
                  </Col>
                  <Col lg={4}>
                    <FormikInput
                      formik={formik}
                      type="number"
                      name="shop_margin"
                    />
                  </Col>
                  <Col lg={4}>
                    <FormikInput
                      formik={formik}
                      type="number"
                      name="shop_profit"
                    />
                  </Col>
                  <Col lg={4}>
                    <FormikInput
                      formik={formik}
                      type="number"
                      name="shop_sales"
                    />
                  </Col>
                </Row>
                {isUpdatePermissionAvailable && (
                  <>
                    <Card.Footer className="text-end">
                      <button type="submit" className="btn btn-primary">
                        Update
                      </button>
                    </Card.Footer>
                  </>
                )}
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default withApi(SiteBudget);
