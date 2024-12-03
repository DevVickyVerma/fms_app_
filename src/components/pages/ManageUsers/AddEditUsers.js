import { useEffect } from 'react';
import { Col, Row, Card, Breadcrumb } from "react-bootstrap";
import { useFormik } from "formik";
import { Link, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import FormikInput from '../../Formik/FormikInput';
import * as Yup from "yup";
import LoaderImg from '../../../Utils/Loader';




const ManageAddEditUser = (props) => {
    const { isLoading, postData, getData } = props;
    const { id: urlId } = useParams()


    const fetchDetailList = async () => {
        try {
            const response = await getData(`/level/detail/${urlId}`);

            if (response && response.data && response.data.data) {
                formik.setValues(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const AddSiteinitialValues = {
        name: "",
        sort_order: "",
        is_final: 0,
    };
    const formik = useFormik({
        initialValues: AddSiteinitialValues,
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            sort_order: Yup.number()
                .min(1, "Sort order must be at least 1")
                .max(10, "Sort order must be at most 10")
                .required("Sort order is required"),
            is_final: Yup.number().oneOf([0, 1], "Invalid value for is_final"),
        }),
        onSubmit: (values) => {
            handleSubmit1(values)
        },
    });

    const handleSubmit1 = async (values,) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("sort_order", values.sort_order);
            formData.append("is_final", values.is_final);

            if (urlId) {
                formData.append("id", values.id);
            }


            let postDataUrl = "/level/";
            postDataUrl += urlId ? "update" : "create";

            const navigatePath = "/manage-levels/";
            await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
        } catch (error) {
            console.error(error); // Set the submission state to false if an error occurs
        }
    };


    useEffect(() => {
        if (urlId) {
            fetchDetailList(urlId)
        }
    }, [urlId])



    console.log(formik.values, "closeicon");

    return (
        <>
            {isLoading ? <LoaderImg /> : null}
            <>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">{urlId ? "Edit User" : "Add User"}  </h1>

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
                                linkProps={{ to: "/manage-levels/" }}
                            >
                                Manage Levels
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                {urlId ? "Edit User" : "Add User"}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <Row>
                    <Col lg={12} xl={12} md={12} sm={12}>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h3">{urlId ? "Edit User" : "Add User"} </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <form onSubmit={formik.handleSubmit}>
                                    <Row>



                                        <Col lg={6}>
                                            <FormikInput formik={formik} type="text" name="first_name" />
                                        </Col>
                                        <Col lg={6}>
                                            <FormikInput formik={formik} type="text" name="last_name" />
                                        </Col>

                                        <Col lg={4} md={6}>
                                            <FormikSelect
                                                formik={formik}
                                                name="Site_Status"
                                                label="Site Status"
                                                options={AddSiteData.site_status?.map((item) => ({ id: item?.id, name: item?.name }))}
                                                className="form-input"
                                            />
                                        </Col>


                                        <Col lg={6}>
                                            <FormikInput formik={formik} type="number" name="sort_order" label='Sort Order' min='1' max='10' />
                                        </Col>


                                        <Col lg={6}>
                                            <div className=' position-relative pointer  ms-6 my-4' >
                                                <input
                                                    type="checkbox"
                                                    id="is_final"
                                                    name="is_final"
                                                    checked={formik?.values?.is_final === 1}
                                                    onChange={(e) => {
                                                        formik.setFieldValue('is_final', e.target.checked ? 1 : 0);
                                                    }}
                                                    className='mx-1 form-check-input form-check-input-updated pointer'
                                                />
                                                <label htmlFor="is_final" className='p-0 m-0 pointer' > Final Approver</label>
                                            </div>
                                        </Col>


                                    </Row>
                                    <Card.Footer className="text-end">
                                        <Link
                                            type="submit"
                                            className="btn btn-danger me-2 "
                                            to={`/manage-levels/`}
                                        >
                                            Cancel
                                        </Link>

                                        <button
                                            type="submit"
                                            className="btn btn-primary me-2 "
                                        // disabled={Object.keys(errors).length > 0}
                                        >
                                            {urlId ? "Update" : "Save"}
                                        </button>
                                    </Card.Footer>
                                </form>
                            </Card.Body>

                        </Card>

                    </Col>
                </Row>
            </>
        </>
    );
};
export default withApi(ManageAddEditUser);