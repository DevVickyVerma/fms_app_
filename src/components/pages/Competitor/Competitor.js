import React, { useEffect, useState } from 'react'
import withApi from '../../../Utils/ApiHelper';
import { Breadcrumb, Card, Col, Form, FormGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import axios from 'axios';
import Loaderimg from '../../../Utils/Loader';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import { useSelector } from 'react-redux';

const Competitor = ({ getData, postData, isLoading }) => {
    const [selectedCompanyList, setSelectedCompanyList] = useState([]);
    const [CompetitorData, setCompetitorData] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [selectedSiteId, setSelectedSiteId] = useState("");
    const [AddSiteData, setAddSiteData] = useState([]);
    const [selectedSiteList, setSelectedSiteList] = useState([]);
    const [SupplierData, setSupplierData] = useState({});
    const [subbmittedData, setSubbmittedData] = useState();
    const [mySelectedSiteId, setMySelectedSiteId] = useState("");
    const [CompetitorList, setCompetitorList] = useState();

    const UserPermissions = useSelector((state) => state?.data?.data);

    const [permissionsArray, setPermissionsArray] = useState([]);

    useEffect(() => {
        if (UserPermissions) {
            setPermissionsArray(UserPermissions?.permissions);
        }
    }, [UserPermissions]);

    const isStatusPermissionAvailable = permissionsArray?.includes(
        "client-status-update"
    );
    const isEditPermissionAvailable = permissionsArray?.includes("client-edit");
    const isLoginPermissionAvailable = permissionsArray?.includes(
        "client-account-access"
    );
    const isAddonPermissionAvailable =
        permissionsArray?.includes("addons-assign");
    const isAddPermissionAvailable = permissionsArray?.includes("competitor-create");
    const isDeletePermissionAvailable =
        permissionsArray?.includes("competitor-delete");
    const isReportsPermissionAvailable =
        permissionsArray?.includes("competitor-edit");
    const isAssignPermissionAvailable =
        permissionsArray?.includes("client-assign");

    const navigate = useNavigate();

    console.log("selectedSiteList", selectedSiteList);


    const Errornotify = (message) => toast.error(message);

    function handleError(error) {
        if (error.response && error.response.status === 401) {
            navigate("/login");
            Errornotify("Invalid access token");
            localStorage.clear();
        } else if (error.response && error.response.data.status_code === "403") {
            navigate("/errorpage403");
        } else {
            const errorMessage = Array.isArray(error.response.data.message)
                ? error.response.data.message.join(" ")
                : error.response.data.message;
            Errornotify(errorMessage);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const GetSiteData = async () => {
            try {
                const response = await axiosInstance.get("suppliers");

                if (response.data) {
                    setSupplierData(response.data.data);
                }
            } catch (error) {
                handleError(error);
            }
        };
        try {
            GetSiteData();
        } catch (error) {
            handleError(error);
        }
        // console.clear()
        console.clear();
    }, []);






    const formik = useFormik({
        initialValues: {
            client_id: "",
            company_id: "",
            site_id: "",


        },
        validationSchema: Yup.object({
            client_id: Yup.string().required("Client is required"),
            company_id: Yup.string().required("Company is required"),
            site_id: Yup.string().required("Site  is required"),

        }),

        onSubmit: (values) => {
            handleSubmit(values)
            console.log(values, "useFormik");
        },
    });

    const fetchCommonListData = async () => {
        try {
            const response = await getData("/client/commonlist");

            const { data } = response;
            if (data) {
                setCompetitorData(response.data);
                // if (
                //     response?.data &&
                //     localStorage.getItem("superiorRole") === "Client"
                // ) {
                const clientId = localStorage.getItem("superiorId");
                if (clientId) {
                    setSelectedClientId(clientId);

                    setSelectedCompanyList([]);

                    // setShowButton(false);
                    console.log(clientId, "clientId");
                    console.log(AddSiteData, "AddSiteData");

                    if (response?.data) {
                        const selectedClient = response?.data?.data?.find(
                            (client) => client.id === clientId
                        );
                        if (selectedClient) {
                            setSelectedCompanyList(selectedClient?.companies);
                        }
                    }
                    // }
                }
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };





    console.log(CompetitorData, "CompetitorData");

    useEffect(() => {
        fetchCommonListData();
    }, [])

    const handleManageCompetitorList = async () => {
        if (subbmittedData) {
            try {
                const response = await getData(`site/competitor/list?site_id=${mySelectedSiteId}`);
                if (response && response.data && response.data.data) {
                    setCompetitorList(response.data.data.competitors)
                } else {
                    throw new Error("No data available in the response");
                }
            } catch (error) {
                console.error("API error:", error);
            }
        }
    };

    console.log("setSubbmittedData", subbmittedData);
    console.log("CompetitorList", CompetitorList);



    const handleSubmit = async (values) => {
        console.log(values, "values")

        try {
            const formData = new FormData();
            // console.log(formData, "formData");

            setSubbmittedData(values);
            setMySelectedSiteId(values?.site_id)
            handleManageCompetitorList();

            // const postDataUrl = "/site/competitor/add";
            // const navigatePath = "/competitor";

            // await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
        } catch (error) {
            handleError(error); // Set the submission state to false if an error occurs
        }
    };

    const columns = [
        {
            name: "S.No",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "10%",
            center: true,
            cell: (row, index) => (
                <span className="text-muted fs-15 fw-semibold text-center">
                    {index + 1}
                </span>
            ),
        },
        {
            name: "Name",
            selector: (row, index) => [row.name],
            sortable: false,
            width: "20%",
            center: true,
            cell: (row, index) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Suppliers",
            selector: (row) => [row.supplier],
            sortable: true,
            width: "20%",
            cell: (row, index) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.supplier}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Created Date",
            selector: (row) => [row.created_date],
            // selector: "created_date",
            sortable: true,
            width: "20%",
            cell: (row, index) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Address",
            selector: (row) => [row.address
            ],
            // selector: "created_date",
            sortable: true,
            width: "20%",
            cell: (row, index) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.address
                        }</h6>
                    </div>
                </div>
            ),
        },

        {
            name: "Status",
            selector: (row) => [row.status],
            sortable: true,
            width: "12%",
            cell: (row) => (
                <span className="text-muted fs-15 fw-semibold text-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
                        {row.status === 1 ? (
                            <button
                                className="btn btn-success btn-sm"
                            // onClick={
                            //     isEditPermissionAvailable ? () => toggleActive(row) : null
                            // }
                            >
                                Active
                            </button>
                        ) : row.status === 0 ? (
                            <button
                                className="btn btn-danger btn-sm"
                            // onClick={
                            //     isEditPermissionAvailable ? () => toggleActive(row) : null
                            // }
                            >
                                Inactive
                            </button>
                        ) : (
                            <button
                                className="badge"
                            // onClick={
                            //     isEditPermissionAvailable ? () => toggleActive(row) : null
                            // }
                            >
                                Unknown
                            </button>
                        )}
                    </OverlayTrigger>
                </span>
            ),
        },

    ];


    const tableDatas = {
        columns,
        CompetitorList,
    };


    return (
        <>
            {isLoading ? <Loaderimg /> : null}

            <>
                <div className="page-header ">
                    <div>
                        <h1 className="page-title">Manage Competitor</h1>
                        <Breadcrumb className="breadcrumb">
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
                                Manage Competitor
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>


                {/* here I will start Body of competitor */}
                <Row>
                    <Col lg={12} xl={12} md={12} sm={12}>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h3">Manage Competitor</Card.Title>
                            </Card.Header>
                            {/* here my body will start */}
                            <Card.Body>
                                <form onSubmit={formik.handleSubmit}>
                                    <Row>


                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    htmlFor="client_id"
                                                    className="form-label mt-4"
                                                >
                                                    Client
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`input101 ${formik.errors.client_id &&
                                                        formik.touched.client_id
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="client_id"
                                                    name="client_id"
                                                    onChange={(e) => {
                                                        const selectedType = e.target.value;

                                                        formik.setFieldValue("client_id", selectedType);
                                                        setSelectedClientId(selectedType);

                                                        // Reset the selected company and site
                                                        setSelectedCompanyList([]);

                                                        const selectedClient = CompetitorData.data.find(
                                                            (client) => client.id === selectedType
                                                        );

                                                        if (selectedClient) {
                                                            setSelectedCompanyList(
                                                                selectedClient.companies
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <option value="">Select a Client</option>
                                                    {CompetitorData.data &&
                                                        CompetitorData.data.length > 0 ? (
                                                        CompetitorData.data.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.client_name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No Client</option>
                                                    )}
                                                </select>

                                                {formik.errors.client_id &&
                                                    formik.touched.client_id && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.client_id}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>

                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label htmlFor="company_id" className="form-label mt-4">
                                                    Company
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`input101 ${formik.errors.company_id &&
                                                        formik.touched.company_id
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="company_id"
                                                    name="company_id"
                                                    onChange={(e) => {
                                                        const selectedCompany = e.target.value;

                                                        formik.setFieldValue("company_id", selectedCompany);
                                                        setSelectedCompanyId(selectedCompany);
                                                        setSelectedSiteList([]);
                                                        const selectedCompanyData =
                                                            selectedCompanyList.find(
                                                                (company) => company.id === selectedCompany
                                                            );

                                                        if (selectedCompanyData) {
                                                            setSelectedSiteList(selectedCompanyData.sites);
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
                                                </select>
                                                {formik.errors.company_id &&
                                                    formik.touched.company_id && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.company_id}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>


                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label htmlFor="site_id" className="form-label mt-4">
                                                    Site Name
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`input101 ${formik.errors.site_id &&
                                                        formik.touched.site_id
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="site_id"
                                                    name="site_id"
                                                    onChange={(e) => {
                                                        const selectedsite_id = e.target.value;

                                                        formik.setFieldValue("site_id", selectedsite_id);
                                                        setSelectedSiteId(selectedsite_id);
                                                        const selectedSiteData =
                                                            selectedSiteList.find(
                                                                (site) => site.id === selectedsite_id
                                                            );
                                                    }}
                                                >
                                                    <option value="">Select a Site</option>
                                                    {selectedSiteList.length > 0 ? (
                                                        selectedSiteList.map((site) => (
                                                            <option key={site.id} value={site.id}>
                                                                {site.site_name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No Site</option>
                                                    )}
                                                </select>
                                                {formik.errors.site_id &&
                                                    formik.touched.site_id && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.site_id}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="text-end">
                                        <button type="submit" className="btn btn-primary">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row >


                {/* here is my listing data table */}
                {CompetitorList ? <>
                    <Row className=" row-sm">
                        <Col lg={12}>
                            <Card>
                                <Card.Header>
                                    <h3 className="card-title">Competitor Listing Data</h3>
                                </Card.Header>
                                <Card.Body>
                                    <div className="table-responsive deleted-table">
                                        {/* <DataTableExtensions {...tableDatas}>
                                            <DataTable
                                                columns={columns}
                                                data={CompetitorList}
                                                noHeader
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                striped={true}
                                                persistTableHead
                                                pagination
                                                highlightOnHover
                                                searchable={false}

                                            />
                                        </DataTableExtensions> */}
                                        <DataTable
                                            columns={columns}
                                            data={CompetitorList}
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            striped={true}
                                            persistTableHead
                                            pagination
                                            highlightOnHover
                                            searchable={false}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </> : ""}


            </>
        </>
    )
}

export default withApi(Competitor);