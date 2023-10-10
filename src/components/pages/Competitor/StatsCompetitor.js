import React from 'react'
import Loaderimg from '../../../Utils/Loader'
import { Breadcrumb, Card, Col, Form, FormGroup, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorMessage, Field, Formik } from 'formik'
import * as Yup from "yup";
import withApi from '../../../Utils/ApiHelper'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import DataTableExtensions from "react-data-table-component-extensions";

const StatsCompetitor = ({ isLoading, getData }) => {
    const [data, setData] = useState();
    const [permissionsArray, setPermissionsArray] = useState([]);
    const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
        localStorage.getItem("superiorId")
    );

    const navigate = useNavigate()
    const [selected, setSelected] = useState([]);
    const [AddSiteData, setAddSiteData] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedCompanyList, setSelectedCompanyList] = useState([]);
    const [selectedSiteList, setSelectedSiteList] = useState([]);


    const UserPermissions = useSelector((state) => state?.data?.data);

    useEffect(() => {
        setclientIDLocalStorage(localStorage.getItem("superiorId"));
        if (UserPermissions) {
            setPermissionsArray(UserPermissions.permissions);
        }
    }, [UserPermissions]);
    useEffect(() => {
        handleFetchData();
        handleClientStats();
    }, []);


    const handleFetchData = async () => {
        try {
            const response = await getData("/client/commonlist");

            const { data } = response;
            if (data) {
                setAddSiteData(response?.data);
                if (
                    response?.data &&
                    localStorage.getItem("superiorRole") === "Client"
                ) {
                    const clientId = localStorage.getItem("superiorId");
                    if (clientId) {
                        setSelectedClientId(clientId);

                        setSelectedCompanyList([]);

                        // setShowButton(false);

                        if (response?.data) {
                            const selectedClient = response?.data?.data?.find(
                                (client) => client.id === clientId
                            );
                            if (selectedClient) {
                                setSelectedCompanyList(selectedClient?.companies);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const handleClientStats = async () => {
        try {
            const response = await getData(
                `/client/sites`
            );


            const { data } = response;
            if (data) {
                setData(data?.data);
            }

        } catch (error) {
            console.error("API error:", error);
        } // Set the submission state to false after the API call is completed
    };

    const columns = [
        {
            name: "S.No",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "15%",
            center: true,
            cell: (row, index) => (
                <span className="text-muted fs-15 fw-semibold text-center">
                    {index + 1}
                </span>
            ),
        },
        {
            name: "Site Name",
            selector: (row) => [row?.site_name],
            sortable: false,
            width: "85%",
            cell: (row, index) => (
                <Link to={`/sitecompetitor/${row.id}`}
                    className="d-flex"
                    style={{ cursor: "pointer" }}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-flex align-items-center">
                        <span>
                            <img
                                src={row?.supplierImage}
                                alt="supplierImage"
                                className="w-5 h-5 "
                            />
                        </span>
                        <h6 className="mb-0 fs-14 fw-semibold ms-2"> {row?.site_name}</h6>
                    </div>
                </Link>

            ),
        },
    ];

    const tableDatas = {
        columns,
        data,
    };

    console.log(data, "mydata");
    const role = localStorage.getItem("role");

    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div className="page-header d-flex">
                <div>
                    <h1 className="page-title ">Competitor Stats</h1>
                    <Breadcrumb className="breadcrumb breadcrumb-subheader">
                        <Breadcrumb.Item
                            className="breadcrumb-item"
                            linkAs={Link}
                            linkProps={{ to: "/dashboard" }}
                        >
                            Dashboard
                        </Breadcrumb.Item>

                        <Breadcrumb.Item
                            className="breadcrumb-item active breadcrumds"
                            aria-current="page"
                        >
                            Competitor Stats
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="ms-auto ">
                    <div className="input-group">

                    </div>
                </div>
            </div>

            {role === "Administrator" ? <>
                <>
                    <Row>
                        <Col md={12} xl={12}>
                            <Card>
                                <Card.Header>
                                    <h3 className="card-title"> Filter Data</h3>
                                </Card.Header>
                                <Card.Body>
                                    <Formik
                                        initialValues={{
                                            client_id: "",
                                            company_id: "",
                                        }}
                                        validationSchema={Yup.object({
                                            company_id: Yup.string().required("Company is required"),
                                        })}
                                        onSubmit={(values) => {
                                            // handleSubmit1(values);
                                        }}
                                    >
                                        {({ handleSubmit, errors, touched, setFieldValue }) => (
                                            <Form onSubmit={handleSubmit}>
                                                <Card.Body>
                                                    <Row>
                                                        {localStorage.getItem("superiorRole") !==
                                                            "Client" && (
                                                                <Col lg={6} md={12}>
                                                                    <FormGroup>
                                                                        <label
                                                                            htmlFor="client_id"
                                                                            className=" form-label mt-4"
                                                                        >
                                                                            Client
                                                                            <span className="text-danger">*</span>
                                                                        </label>
                                                                        <Field
                                                                            as="select"
                                                                            className={`input101 ${errors.client_id && touched.client_id
                                                                                ? "is-invalid"
                                                                                : ""
                                                                                }`}
                                                                            id="client_id"
                                                                            name="client_id"
                                                                            onChange={(e) => {
                                                                                const selectedType = e.target.value;

                                                                                setFieldValue("client_id", selectedType);
                                                                                setSelectedClientId(selectedType);

                                                                                // Reset the selected company and site
                                                                                setSelectedCompanyList([]);
                                                                                setSelectedSiteList([]);
                                                                                setFieldValue("company_id", "");
                                                                                setFieldValue("site_id", "");

                                                                                const selectedClient =
                                                                                    AddSiteData.data.find(
                                                                                        (client) => client.id === selectedType
                                                                                    );

                                                                                if (selectedClient) {
                                                                                    setSelectedCompanyList(
                                                                                        selectedClient.companies
                                                                                    );
                                                                                    setData(selectedClient.companies)
                                                                                }
                                                                            }}
                                                                        >
                                                                            <option value="">Select a Client</option>
                                                                            {AddSiteData.data &&
                                                                                AddSiteData.data.length > 0 ? (
                                                                                AddSiteData.data.map((item) => (
                                                                                    <option key={item.id} value={item.id}>
                                                                                        {item.client_name}
                                                                                    </option>
                                                                                ))
                                                                            ) : (
                                                                                <option disabled>No Client</option>
                                                                            )}
                                                                        </Field>

                                                                        <ErrorMessage
                                                                            component="div"
                                                                            className="invalid-feedback"
                                                                            name="client_id"
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            )}
                                                        <Col lg={6} md={12}>
                                                            <FormGroup>
                                                                <label
                                                                    htmlFor="company_id"
                                                                    className="form-label mt-4"
                                                                >
                                                                    Company
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                                <Field
                                                                    as="select"
                                                                    className={`input101 ${errors.company_id && touched.company_id
                                                                        ? "is-invalid"
                                                                        : ""
                                                                        }`}
                                                                    id="company_id"
                                                                    name="company_id"
                                                                    onChange={(e) => {
                                                                        const selectedCompany = e.target.value;

                                                                        setFieldValue("company_id", selectedCompany);
                                                                        setSelectedSiteList([]);
                                                                        const selectedCompanyData =
                                                                            selectedCompanyList.find(
                                                                                (company) =>
                                                                                    company.id === selectedCompany
                                                                            );
                                                                        if (selectedCompanyData) {
                                                                            setSelectedSiteList(
                                                                                selectedCompanyData.sites
                                                                            );
                                                                            setData(selectedCompanyData.sites)
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="">Select a Company</option>
                                                                    {selectedCompanyList.length > 0 ? (
                                                                        selectedCompanyList.map((company) => (
                                                                            <option key={company.id} value={company.id}>
                                                                                {company.company_name}
                                                                            </option>
                                                                        ))
                                                                    ) : (
                                                                        <option disabled>No Company</option>
                                                                    )}
                                                                </Field>
                                                                <ErrorMessage
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                    name="company_id"
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Form>
                                        )}
                                    </Formik>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </></> : ""}


            <Card>
                <Card.Body>
                    {data?.length > 0 ? (
                        <>
                            <div
                                className="table-responsive deleted-table"
                            >
                                <DataTableExtensions {...tableDatas}>
                                    <DataTable
                                        columns={columns}
                                        data={data}
                                        noHeader
                                        defaultSortField="id"
                                        defaultSortAsc={false}
                                        striped={true}
                                        persistTableHead
                                        pagination
                                        paginationPerPage={20}
                                        highlightOnHover
                                        searchable={true}
                                    //   onChangePage={(newPage) => setCurrentPage(newPage)}
                                    />
                                </DataTableExtensions>
                            </div>
                        </>
                    ) : (
                        <>
                            <img
                                src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                                alt="MyChartImage"
                                className="all-center-flex nodata-image"
                            />
                        </>
                    )}
                </Card.Body>
            </Card>
        </>
    )
}

export default withApi(StatsCompetitor);