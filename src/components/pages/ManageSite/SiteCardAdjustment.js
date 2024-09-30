import { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import { Link, useParams } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { handleError } from "../../../Utils/ToastUtils";

import { Card, Col, Row, Breadcrumb } from "react-bootstrap";
import { useSelector } from "react-redux";

const SiteCardAdjustment = (props) => {
    const { getData, postData, isLoading } = props;

    const [data, setData] = useState();
    const [startdate, setStartdate] = useState();
    const { id } = useParams(); // Destructure id from useParams()
    const UserPermissions = useSelector((state) => state?.data?.data?.permissions || []);

    const isAddPermissionAvailable = UserPermissions?.includes("site-card-adjustment-create");


    const GetListing = async (start_month) => {
        setStartdate(start_month);
        const [year, month] = start_month.split("-");
        formik.setFieldValue("year", year);
        formik.setFieldValue("month", month);
        try {
            const response = await getData(
                `/site/card-adjustment/list?site_id=${id}&month=${month}&year=${year}`
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

            const postDataUrl = "site/card-adjustment/add";
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
        start_month: Yup.string().required("Start date is required"),
    });

    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div className="page-header d-flex manageSite-header">
                <div>
                    <h1 className="page-title dashboard-page-title">
                        {" "}
                        Site Card Adjustment ({(data?.site_name)})
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
                            Site Card Adjustment
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <Card>
                <Card.Header>Filter By Month:</Card.Header>
                <Card.Body>
                    <Formik
                        initialValues={{
                            start_month: "", // Set the initial month value
                        }}
                        validationSchema={validationSchema1}
                        onSubmit={(values, { resetForm }) => {
                            const { start_month } = values; // Destructuring to extract start_month
                            GetListing(start_month);
                        }}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit}>
                                <Row>
                                    <Col lg={3} md={3}>
                                        <div className="form-group">
                                            <label htmlFor="start_month" className="form-label mt-4">
                                                Date
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="month"
                                                max={getCurrentDate()}
                                                className={`input101 ${formik.errors.start_month && formik.touched.start_month
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                value={formik.values.start_month}
                                                id="start_month"
                                                name="start_month"
                                                onChange={formik.handleChange}
                                            ></input>
                                            {formik.errors.start_month &&
                                                formik.touched.start_month && (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.start_month}
                                                    </div>
                                                )}
                                        </div>
                                    </Col>
                                </Row>
                                <div className="text-end">
                                    <Link type="button" className="btn btn-danger me-2"
                                        onClick={() => {
                                            formik.resetForm();
                                            localStorage.removeItem("localFilterModalData");
                                        }}>
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
                            <h3 className="card-title"> Site Card Adjustment  ({(data?.site_name)}) </h3>
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


                                    {isAddPermissionAvailable && (<>
                                        <div className="card-footer text-end">
                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
                                        </div>
                                    </>)}


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

export default withApi(SiteCardAdjustment);