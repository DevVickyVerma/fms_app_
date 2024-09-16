import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import LoaderImg from '../../../Utils/Loader';
import { handleError } from '../../../Utils/ToastUtils';
import FormikSelect from '../../Formik/FormikSelect';
import FormikInput from '../../Formik/FormikInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMyContext } from '../../../Utils/MyContext';



const NewFilterTab = ({
    getData,
    isLoading,
    onApplyFilters,
    handleSendEmail,
    handleDeleteDRS,
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
    showSendEmail = false,
    showDRSDelete = false,
    showResetBtn = true,
    showDateRangeInput = false, // Add this prop
    validationSchema,
    storedKeyName,
    layoutClasses = 'flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5',
    onClose,
    isOpen,
    ClearForm,
    lg,
}) => {
    const reduxData = useSelector(state => state?.data?.data);


    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`; // Formats as yyyy-MM

    const formik = useFormik({
        initialValues: {
            client_id: "",
            client_name: "",
            company_id: "",
            company_name: "",
            start_month: currentMonth, // Set default to current month
            start_date: new Date().toISOString().split('T')[0] || "",
            site_id: "",
            site_name: "",
            range_start_date: null, // Renamed start date field
            range_end_date: null,   // Renamed end date field
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



    const { contextClients, setcontextClients } =
        useMyContext();



    useEffect(() => {
        if (showClientInput && contextClients?.length == 0) {
            fetchClientList();
        } else if (contextClients?.length > 0) {
            formik.setFieldValue('clients', contextClients);
        }
    }, [showClientInput, contextClients]);

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
            const selectedCompany = formik.values.companies.find(company => company?.id === companyId);
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
        const selectedSiteData = formik?.values?.sites?.find(site => site.id === selectedSiteId);
        formik.setFieldValue('site_name', selectedSiteData?.site_name || "");
    };

    const handleClearForm = () => {
        formik.resetForm()
        localStorage.removeItem(storedKeyName)
        if (localStorage.getItem("superiorRole") === "Client") {
            const clientId = localStorage.getItem("superiorId");
            if (clientId) {
                handleClientChange({ target: { value: clientId } });
            }
        } else {
            fetchClientList()
        }
        ClearForm()
    }

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        formik.setFieldValue('range_start_date', start);
        formik.setFieldValue('range_end_date', end);
    };




    return (
        <>
            {isLoading ? <LoaderImg /> : null}
            <>
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <Card.Body>
                            <Row>
                                {showClientInput && localStorage.getItem('superiorRole') !== 'Client' && (
                                    <Col lg={lg || 6}>
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

                                    <Col lg={lg || 6}>
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
                                    <Col lg={lg || 6}>
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


                                {showDateInput && (
                                    <Col lg={lg || 6}>
                                        <FormikInput formik={formik} type="date" label="Date" name="start_date" />
                                    </Col>
                                )}

                                {
                                    showMonthInput && (
                                        <Col lg={lg || 6}>
                                            <FormikInput formik={formik} type="month" label="Month" name="start_month" />
                                        </Col>
                                    )
                                }


                                {showDateInput && showDateRangeInput && (
                                    <Col lg={lg || 6}>
                                        <label htmlFor="date-range">Date Range</label>
                                        <DatePicker
                                            id="date-range"
                                            selected={formik.values.range_start_date ? new Date(formik.values.range_start_date) : null}
                                            onChange={handleDateChange}
                                            startDate={formik.values.range_start_date ? new Date(formik.values.range_start_date) : null}
                                            endDate={formik.values.range_end_date ? new Date(formik.values.range_end_date) : null}
                                            selectsRange
                                            isClearable
                                            placeholderText='Select Date Range'
                                            dateFormat="yyyy-MM-dd"
                                            className="input101 form-input"
                                        />
                                        {formik.errors.range_start_date && formik.touched.range_start_date && (
                                            <div className="text-danger mt-1">
                                                {formik.errors.range_start_date}
                                            </div>
                                        )}
                                        {formik.errors.range_end_date && formik.touched.range_end_date && (
                                            <div className="text-danger mt-1">
                                                {formik.errors.range_end_date}
                                            </div>
                                        )}
                                    </Col>
                                )}

                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <div className='text-end'>

                                {showSendEmail && (

                                    <>
                                        <span>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Send Email</Tooltip>}
                                            >
                                                <button
                                                    to="#"
                                                    className="btn btn-info me-2 rounded-11"
                                                    onClick={handleSendEmail}
                                                >
                                                    Send Email
                                                </button>
                                            </OverlayTrigger>
                                        </span>
                                    </>
                                )}
                                {showDRSDelete && (

                                    <>
                                        <span>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Delete</Tooltip>}
                                            >
                                                <Link
                                                    to="#"
                                                    className="btn btn-danger me-2 rounded-11"
                                                    onClick={handleDeleteDRS}
                                                >
                                                    <i>
                                                        <svg
                                                            className="table-delete"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            width="16"
                                                        >
                                                            <path d="M0 0h24v24H0V0z" fill="none" />
                                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                                                        </svg>
                                                    </i>
                                                </Link>
                                            </OverlayTrigger>
                                        </span>
                                    </>
                                )}


                                {showResetBtn && (<>
                                    <button
                                        className="btn btn-danger me-2"
                                        type="btn"
                                        onClick={handleClearForm}
                                    >
                                        Reset
                                    </button>

                                </>)}



                                <button
                                    className="btn btn-primary me-2"
                                    type="submit"
                                >
                                    Submit
                                </button>

                            </div>

                        </Card.Footer>
                    </form>

                </div>
            </>
        </>
    );
};

export default NewFilterTab;
