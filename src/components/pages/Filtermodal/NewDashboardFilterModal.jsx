import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Dialog, DialogActions } from '@mui/material';
import { Card, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import LoaderImg from '../../../Utils/Loader';
import { handleError } from '../../../Utils/ToastUtils';
import FormikSelect from '../../Formik/FormikSelect';

const NewDashboardFilterModal = ({
    getData,
    isLoading,
    onApplyFilters,
    showClientInput = true,
    isStatic = true,
    smallScreen = false,
    showEntityInput = true,
    showStationInput = true,
    showStationValidation = true,
    showMonthValidation = true,
    showDateValidation = true,
    showMonthInput = true,
    showDateInput = true,
    validationSchema,
    storedKeyName,
    layoutClasses = 'flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5',
    onClose,
    isOpen,
}) => {

    const reduxData = useSelector(state => state?.data?.data);



    const formik = useFormik({
        initialValues: {
            client_id: "",
            client_name: "",
            company_id: "",
            company_name: "",
            start_month: "",
            site_id: "",
            site_name: "",
            clients: [],
            companies: [],
            sites: [],
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
        if (showClientInput) fetchClientList();
    }, [showClientInput]);

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
            formik.setFieldValue('clients', clients);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchCompanyList = async (clientId) => {
        try {
            const response = await getData(`common/company-list?client_id=${clientId}`);
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
        } else {
            formik.setFieldValue('client_name', "");
            formik.setFieldValue('companies', []);
            formik.setFieldValue('sites', []);
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
            formik.setFieldValue('company_name', "");
            formik.setFieldValue('sites', []);
            formik.setFieldValue('site_id', "");
            formik.setFieldValue('site_name', "");
        }
    };

    const handleSiteChange = (e) => {
        const selectedSiteId = e.target.value;
        formik.setFieldValue("site_id", selectedSiteId);
        const selectedSiteData = formik?.values?.sites?.find(site => site?.id === selectedSiteId);
        formik.setFieldValue('site_name', selectedSiteData?.site_name || "");
    };



    return (
        <>
            {isLoading && <LoaderImg />}



            <div>
                <Dialog
                    open={isOpen}
                    onClose={onClose}
                    aria-labelledby="responsive-dialog-title"
                    className="ModalTitle"
                >
                    <span
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                        className="ModalTitle"
                    >
                        <span>
                            Filter
                        </span>
                        <span onClick={onClose} >
                            <button className="close-button">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </span>
                    </span>

                    <>
                        {isLoading ? <LoaderImg /> : null}
                        <>
                            <div
                            // className={`${visible ? "visible" : ""}`}
                            >
                                <form onSubmit={formik.handleSubmit}>
                                    <Card.Body>
                                        <Row>


                                            {showClientInput && localStorage.getItem('superiorRole') !== 'Client' && (
                                                <Col lg={6}>
                                                    <FormikSelect
                                                        formik={formik}
                                                        name="client_id"
                                                        label="Client"
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
                                                        isRequired={showStationValidation}
                                                        onChange={handleSiteChange}
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
                        </>
                    </>
                </Dialog>
            </div >
        </>
    );
};

export default NewDashboardFilterModal;
