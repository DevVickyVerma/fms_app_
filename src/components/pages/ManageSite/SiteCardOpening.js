import { useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import { Link, useParams } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { handleError } from "../../../Utils/ToastUtils";

import { Card, Col, Row, Breadcrumb } from "react-bootstrap";

const SiteCardOpening = (props) => {
  const { getData, postData, isLoading } = props;

  const [data, setData] = useState();
  const [startdate, setStartdate] = useState();
  const { id } = useParams(); // Destructure id from useParams()

  const GetListing = async (start_date) => {
    setStartdate(start_date);
    const [year, month] = start_date.split("-");
    formik.setFieldValue("year", year);
    formik.setFieldValue("month", month);
    try {
      const response = await getData(
        `/site/card-opening/list?site_id=${id}&month=${month}&year=${year}`
      );
      if (response) {
        setData(response?.data?.data);
        formik.setValues(response?.data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    group_card: Yup.array().of(
      Yup.object().shape({
        cards: Yup.array().of(
          Yup.object().shape({
            value: Yup.number()
              .required("Card value is required")
          })
        ),
      })
    ),
  });
  const onSubmit = async (values) => {
    try {
      const [year, month] = startdate.split("-");
      const formData = new FormData();
      formData.append(`site_id`, id);
      formData.append(`year`, year);
      formData.append(`month`, month);

      values.group_card.forEach((group) => {
        group.cards.forEach((card) => {
          formData.append(`value[${card.id}]`, card.value);
        });
      });

      const postDataUrl = "site/card-opening/add";
      await postData(postDataUrl, formData);
    } catch (error) {
      handleError(error);
    }
  };

  const formik = useFormik({
    initialValues: { group_card: data?.group_card || [] },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };
  const validationSchema1 = Yup.object().shape({
    start_date: Yup.string().required("Start date is required"),
  });
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div className="page-header d-flex manageSite-header">
        <div>
          <h1 className="page-title dashboard-page-title">
            {" "}
            Site Card Opening ({(data?.site_name)})
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
              Site Card Opening
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Card>
        <Card.Header>Filter By Month:</Card.Header>
        <Card.Body>
          <Formik
            initialValues={{
              start_date: "",
            }}
            validationSchema={validationSchema1}
            onSubmit={(values, { resetForm }) => {
              const { start_date } = values; // Destructuring to extract start_date
              GetListing(start_date);
            }}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col lg={3} md={3}>
                    <div className="form-group">
                      <label htmlFor="start_date" className="form-label mt-4">
                        Date
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="month"
                        max={getCurrentDate()}
                        className={`input101 ${formik.errors.start_date && formik.touched.start_date
                          ? "is-invalid"
                          : ""
                          }`}
                        value={formik.values.start_date}
                        id="start_date"
                        name="start_date"
                        onChange={formik.handleChange}
                      />
                      {formik.errors.start_date &&
                        formik.touched.start_date && (
                          <div className="invalid-feedback">
                            {formik.errors.start_date}
                          </div>
                        )}
                    </div>
                  </Col>
                </Row>
                <div className="text-end">
                  <Link type="button" className="btn btn-danger me-2">
                    Reset
                  </Link>
                  <button className="btn btn-primary me-2" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </Card.Body>
      </Card>
      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title"> Site Card Opening  ({(data?.site_name)}) </h3>
            </Card.Header>

            <Card.Body>
              {formik.values?.group_card?.length > 0 ? (
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    {formik.values?.group_card.map((group) => (
                      <div className="col-12 col-lg-6" key={group.group_id}>
                        <div className="card mb-3">
                          <div className="card-header">
                            <h4
                              className="card-title"
                              style={{ minHeight: "32px" }}
                            >
                              {group.name}
                            </h4>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              {group.cards.map((card) => (
                                <div className="col-6" key={card.id}>
                                  <div className="form-group">
                                    <label
                                      className="form-label"
                                      htmlFor={card.id}
                                    >
                                      {card.name}{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <input
                                      id={card.id}
                                      name={`group_card.${formik.values.group_card.indexOf(
                                        group
                                      )}.cards.${group.cards.indexOf(
                                        card
                                      )}.value`}
                                      type="number"
                                      className={`input101 ${formik.errors.group_card?.[
                                        formik.values.group_card.indexOf(
                                          group
                                        )
                                      ]?.cards?.[group.cards.indexOf(card)]
                                        ?.value &&
                                        formik.touched.group_card?.[
                                          formik.values.group_card.indexOf(
                                            group
                                          )
                                        ]?.cards?.[group.cards.indexOf(card)]
                                          ?.value
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={
                                        formik.values.group_card?.[
                                          formik.values.group_card.indexOf(
                                            group
                                          )
                                        ]?.cards?.[group.cards.indexOf(card)]
                                          ?.value
                                      }
                                    />
                                    {formik.errors.group_card?.[
                                      formik.values.group_card.indexOf(group)
                                    ]?.cards?.[group.cards.indexOf(card)]
                                      ?.value &&
                                      formik.touched.group_card?.[
                                        formik.values.group_card.indexOf(group)
                                      ]?.cards?.[group.cards.indexOf(card)]
                                        ?.value ? (
                                      <div className="invalid-feedback">
                                        {
                                          formik.errors.group_card[
                                            formik.values.group_card.indexOf(
                                              group
                                            )
                                          ].cards[group.cards.indexOf(card)]
                                            .value
                                        }
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card-footer text-end">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <img
                    src={require("../../../../src/assets/images/commonimages/no_data.png")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default withApi(SiteCardOpening);
