import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { DialogActions } from '@mui/material';
import { Card, Col, Modal, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useMyContext } from '../../Utils/MyContext';
import LoaderImg from '../../Utils/Loader';
import FormikSelect from '../Formik/FormikSelect';
import useErrorHandler from '../CommonComponent/useErrorHandler';
import * as Yup from "yup";
import FormikInput from '../Formik/FormikInput';
import { getCurrentMonth } from '../../Utils/commonFunctions/commonFunction';
const TitanFilterModal = ({
    getData,
    isLoading,
    onApplyFilters,
    showClientInput = true,
    showEntityInput = true,
    showEntityValidation = true,
    showClientValidation = true,
    showStationInput = true,
    showStationValidation = true,
    showTankValidation = true,
    showDateValidation = true,
    showReportMonthInputValidation = false,
    showMonthInput = true,
    storedKeyName,
    onClose,
    isOpen,
}) => {

    const reduxData = useSelector(state => state?.data?.data);

    const { handleError } = useErrorHandler();
    const { contextClients, setcontextClients } = useMyContext();
    const validationSchema = Yup.object({
        client_id: Yup.string().required("Client is required"),
        company_id: Yup.string().required("Company is required"),
        start_month: Yup.string().required("Month is required"),
        // ompany_id: Yup.string().required("Company is required"),

        // grade_id: Yup.string()
        //     .nullable()
        //     .when("site_id", {
        //         is: (site_id) => {
        //             console.log("site_id value in `when` condition:", site_id);
        //             return !!site_id?.trim();
        //         },
        //         then: (schema) => {
        //             console.log("Making `grade_id` required");
        //             return schema.required("grade_id is required when site_id is selected");
        //         },
        //         otherwise: (schema) => {
        //             console.log("Allowing `grade_id` to be nullable");
        //             return schema.nullable();
        //         },
        //     }),
    });




    const formik = useFormik({
        initialValues: {
            client_id: "",
            client_name: "",
            company_id: "",
            tank_id: "",
            company_name: "",
            start_month: getCurrentMonth(),
            report_month: "",
            report_monthvalue: "",
            site_id: "",
            site_name: "",
            grade_id: "",
            grade_name: "",
            clients: [],
            companies: [],
            sites: [],
            tanks: [],
            grades: [],
            reportmonths: [],
            reports: [],
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onApplyFilters(values);

            // Check if the role is Client, then set the client_id from local storage
            if (localStorage.getItem("superiorRole") === "Client") {
                // Update the client_name in values from reduxData
                values.client_name = reduxData?.full_name;
            }
            localStorage.setItem(storedKeyName, JSON.stringify(values));
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    useEffect(() => {
        if (showClientInput && contextClients?.length === 0) {
            fetchClientList();
        } else if (contextClients?.length > 0) {
            formik.setFieldValue('clients', contextClients || []);
        }
    }, [showClientInput, contextClients, formik?.values?.clients]);




    useEffect(() => {
        const storedDataString = localStorage.getItem(storedKeyName);

        if (storedDataString) {
            const parsedData = JSON.parse(storedDataString);
            formik.setValues(parsedData);

            if (parsedData?.client_id) {
                fetchCompanyList(parsedData?.client_id);
            }

            if (parsedData?.company_id) {
                fetchSiteList(parsedData?.company_id);
            }
        }

        if (!storedDataString && localStorage.getItem("superiorRole") === "Client") {
            const clientId = localStorage.getItem("superiorId");
            if (clientId) {
                handleClientChange({ target: { value: clientId } });
            }
        }
    }, []);

    const fetchClientList = async () => {
        try {
            const response = await getData('/common/client-list');
            const clients = response?.data?.data;
            setcontextClients(clients);
            formik.setFieldValue('clients', clients);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchCompanyList = async (clientId) => {
        try {
            const response = await getData(`common/company-list?client_id=${clientId}`);
            // FetchReportList(clientId)
            formik.setFieldValue('companies', response?.data?.data);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchSiteList = async (companyId) => {
        try {
            const response = await getData(`common/site-list?company_id=${companyId}`);
            formik.setFieldValue('sites', response?.data?.data);
        } catch (error) {
            handleError(error);
        }
    };

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        formik.setFieldValue('client_id', clientId);

        if (clientId) {
            fetchCompanyList(clientId);
            const selectedClient = formik.values.clients.find(client => client?.id === clientId);
            formik.setFieldValue('client_name', selectedClient?.client_name || "");
            formik.setFieldValue('companies', selectedClient?.companies || []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('company_id', "");
            formik.setFieldValue('site_id', "");
            formik.setFieldValue('tanks', []);
            formik.setFieldValue('grades', []);
            formik.setFieldValue('tank_name', "");
            formik.setFieldValue('tank_id', "");
            formik.setFieldValue('grade_name', "");
            formik.setFieldValue('grade_id', "");
        } else {
            formik.setFieldValue('tanks', []);
            formik.setFieldValue('grades', []);
            formik.setFieldValue('tank_name', "");
            formik.setFieldValue('tank_id', "");
            formik.setFieldValue('grade_name', "");
            formik.setFieldValue('grade_id', "");
            formik.setFieldValue('client_name', "");
            formik.setFieldValue('companies', []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('reports', []);
            formik.setFieldValue('reportmonths', []);
            formik.setFieldValue('company_id', "");
            formik.setFieldValue('site_id', "");
        }
    };

    const handleCompanyChange = (e) => {
        const companyId = e.target.value;
        formik.setFieldValue('company_id', companyId);

        if (companyId) {
            if (showStationInput) {
                fetchSiteList(companyId);
            }
            formik.setFieldValue('site_id', "");
            const selectedCompany = formik?.values?.companies?.find(company => company?.id === companyId);
            formik.setFieldValue('company_name', selectedCompany?.company_name || "");
        } else {
            formik.setFieldValue('tanks', []);
            formik.setFieldValue('grades', []);
            formik.setFieldValue('tank_name', "");
            formik.setFieldValue('tank_id', "");
            formik.setFieldValue('grade_name', "");
            formik.setFieldValue('grade_id', "");
            formik.setFieldValue('company_name', "");
            formik.setFieldValue('sites', []);
            formik.setFieldValue('site_id', "");
            formik.setFieldValue('site_name', "");
        }
    };
    const handleSiteChange = (e) => {

        const companyId = e.target.value;

        formik.setFieldValue('tanks', []);
        formik.setFieldValue('site_id', companyId);

        if (companyId) {
            if (showStationInput) {
                FetchGradeList(companyId);
            }
            formik.setFieldValue('tank_id', "");
            const selectedCompany = formik?.values?.sites?.find(company => company?.id === companyId);
            formik.setFieldValue('site_name', selectedCompany?.site_name || "");
        } else {
            formik.setFieldValue('site_id', "");
            formik.setFieldValue('site_name', "");
            formik.setFieldValue('tanks', []);
            formik.setFieldValue('grades', []);
            formik.setFieldValue('tank_name', "");
            formik.setFieldValue('tank_id', "");
            formik.setFieldValue('grade_name', "");
            formik.setFieldValue('grade_id', "");
        }
    };

    const handleTankChange = (e) => {
        const companyId = e.target.value;
        if (companyId) {
            formik.setFieldValue('tank_id', companyId);
            const selectedCompany = formik?.values?.tanks?.find(company => company?.id === companyId);
            formik.setFieldValue('tank_name', selectedCompany?.tank_name || "");
        } else {
            formik.setFieldValue('tank_name', "");
            formik.setFieldValue('tank_id', "");
        }
    };



    const handleGradeChange = (e) => {
        const companyId = e.target.value;
        if (companyId) {
            formik.setFieldValue('grade_id', companyId);
            const selectedCompany = formik?.values?.grades?.find(company => company?.id === companyId);
            FetchTankList(companyId)
            console.log(selectedCompany, "selectedCompany");
            formik.setFieldValue('grade_name', selectedCompany?.fuel_name || "");
        } else {
            formik.setFieldValue('tanks', []);
            formik.setFieldValue('tank_name', "");
            formik.setFieldValue('tank_id', "");
            formik.setFieldValue('grade_name', "");
            formik.setFieldValue('grade_id', "");
        }
    };
    const FetchGradeList = async (id) => {
        console.log(id, "id");
        try {
            const response = await getData(`common/site-grade-list?site_id=${id}`);

            const { data } = response;
            if (data) {
                formik.setFieldValue('grades', response?.data?.data);
                console.log(data, "tanks");
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };
    const FetchTankList = async (id) => {
        console.log(id, "id");
        try {
            const response = await getData(`common/tank-list?site_id=${formik.values.site_id}&grade_id=${id}`);

            const { data } = response;
            if (data) {
                formik.setFieldValue('tanks', response?.data?.data);
                console.log(data, "tanks");
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };
    console.log(formik.values, "columnIndex");

    return (
        <>
            {isLoading && <LoaderImg />}
            <Modal show={isOpen} onHide={onClose} centered size={'sm'} className='dashboard-center-modal' >
                <div >
                    <Modal.Header
                        style={{
                            color: "#fff",
                        }}
                        className='p-0 m-0 d-flex justify-content-between align-items-center'
                    >

                        <span className="ModalTitle d-flex justify-content-between w-100  fw-normal"  >
                            <span>
                                Filter
                            </span>
                            <span onClick={onClose} >
                                <button className="close-button">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </span>
                        </span>
                    </Modal.Header>

                    <form onSubmit={formik.handleSubmit}>
                        <Card.Body>


                            <Row>


                                {showClientInput && localStorage.getItem('superiorRole') !== 'Client' && (
                                    <Col lg={6}>
                                        <FormikSelect
                                            formik={formik}
                                            name="client_id"
                                            label="Client"
                                            isRequired={showClientValidation}
                                            options={formik?.values?.clients?.map((item) => ({ id: item?.id, name: item?.full_name }))}
                                            className="form-input"
                                            onChange={handleClientChange}
                                        />
                                    </Col>
                                )}


                                {showEntityInput && (

                                    <Col lg={6}>
                                        <FormikSelect
                                            formik={formik}
                                            name="company_id"
                                            label="Company"
                                            options={formik?.values?.companies?.map((item) => ({ id: item?.id, name: item?.company_name }))}
                                            className="form-input"
                                            isRequired={showEntityValidation}
                                            onChange={handleCompanyChange}
                                        />
                                    </Col>
                                )}


                                {showStationInput && (
                                    <Col lg={6}>
                                        <FormikSelect
                                            formik={formik}
                                            name="site_id"
                                            label="Site"
                                            options={formik?.values?.sites?.map((item) => ({ id: item?.id, name: item?.site_name }))}
                                            className="form-input"
                                            isRequired={false}
                                            // isRequired={formik?.values?.company_id?.trim() !== ""}
                                            onChange={handleSiteChange}
                                        />
                                    </Col>
                                )}
                                {showMonthInput && (
                                    <Col lg={6}>
                                        <FormikInput
                                            formik={formik}
                                            type="month"
                                            label="Month"
                                            name="start_month"
                                        />
                                    </Col>
                                )}
                                {showStationInput && (
                                    <Col lg={6}>
                                        <FormikSelect
                                            formik={formik}
                                            name="grade_id"
                                            label="Grade"
                                            options={formik?.values?.grades?.map((item) => ({ id: item?.id, name: item?.fuel_name }))}
                                            className="form-input"
                                            isRequired={false}
                                            onChange={handleGradeChange}
                                        />
                                    </Col>
                                )}
                                {showStationInput && (
                                    <Col lg={6}>
                                        <FormikSelect
                                            formik={formik}
                                            name="tank_id"
                                            label="Tank"
                                            options={formik?.values?.tanks?.map((item) => ({ id: item?.id, name: item?.tank_name }))}
                                            className="form-input"
                                            isRequired={false}
                                            onChange={handleTankChange}
                                        />
                                    </Col>
                                )}

                            </Row>
                        </Card.Body>
                        <hr />
                        <DialogActions>
                            <button
                                className="btn btn-primary me-2"
                                type="submit"
                            >
                                Submit
                            </button>
                        </DialogActions>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default TitanFilterModal;
