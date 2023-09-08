import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import {
    Breadcrumb,
    Card,
    Col,
    Form,
    FormGroup,
    OverlayTrigger,
    Row,
    Tooltip,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";


const Competitor = (props) => {
    const { apidata, isLoading, error, getData, postData } = props;
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
    // const [storedDataInLocal, setStoredDataInLocal] = useState();

    console.log("selectedClientId", selectedClientId);

    const UserPermissions = useSelector((state) => state?.data?.data);

    const [permissionsArray, setPermissionsArray] = useState([]);

    useEffect(() => {
        if (UserPermissions) {
            setPermissionsArray(UserPermissions?.permissions);
        }
    }, [UserPermissions]);

    const isAddPermissionAvailable =
        permissionsArray?.includes("competitor-create");

    const isStatusPermissionAvailable = permissionsArray?.includes(
        "competitor-edit"
    );
    const isDeletePermissionAvailable =
        permissionsArray?.includes("competitor-delete");
    const isEditPermissionAvailable = permissionsArray?.includes("competitor-edit");
    const isLoginPermissionAvailable = permissionsArray?.includes(
        "client-account-access"
    );
    const isAddonPermissionAvailable =
        permissionsArray?.includes("addons-assign");


    const isReportsPermissionAvailable =
        permissionsArray?.includes("report-assign");
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

    console.log("selectedSiteList", selectedSiteList);

    const storedDataString = localStorage.getItem("competitorId");

    // Parse the JSON string into an object
    const storedDataInLocal = (JSON.parse(storedDataString));

    console.log("storedDatainLocal", storedDataInLocal);



    useEffect(() => {
        // if (localStorage.getItem("competitorId")) {
        //     formik.setFieldValue(localStorage.getItem("competitorId"))
        // }
        // if (storedDataInLocal) {
        //     console.log(storedDataInLocal.client_id, "storedDataInLocal.client_id");
        //     // formik.setFieldValue(localStorage.getItem(storedDataInLocal))

        //     handleSubmit(storedDataInLocal)
        // }



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

            company_id: Yup.string().required("Company is required"),
            site_id: Yup.string().required("Site  is required"),
        }),

        onSubmit: (values) => {

            console.log(values, "useFormik");


            const formData = {
                client_id: values.client_id,
                company_id: values.company_id,
                site_id: values.site_id,
            };
            // Serialize the object to a JSON string
            const competitorId = JSON.stringify(formData);

            // Store the JSON string in local storage
            localStorage.setItem("competitorId", competitorId);

            handleSubmit(values);

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

                // if (storedDataInLocal) {
                //     // setSelectedClientId(storedDataInLocal.client_id);
                //     formik.setFieldValue("client_id", storedDataInLocal.client_id)
                //     formik.setFieldValue("site_id", storedDataInLocal.site_id)
                //     formik.setFieldValue("company_id", storedDataInLocal.company_id)
                // }

                // setSelectedClientId(storedDataInLocal);

                const clientId = localStorage.getItem("superiorId");
                // if (clientId) {
                //     setSelectedClientId(clientId);

                //     setSelectedCompanyList([]);

                //     // setShowButton(false);
                //     console.log(clientId, "clientId");
                //     console.log(AddSiteData, "AddSiteData");

                //     if (response?.data) {
                //         const selectedClient = response?.data?.data?.find(
                //             (client) => client.id === clientId
                //         );
                //         if (selectedClient) {
                //             setSelectedCompanyList(selectedClient?.companies);
                //         }
                //     }
                //     // }
                // }
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    console.log(CompetitorData, "CompetitorData");

    useEffect(() => {
        fetchCommonListData();
    }, []);

    // const handleSubmit = async (values) => {


    //     try {
    //         const storedSiteId = localStorage.getItem("site_id");


    //         // const response = await getData(
    //         //     `site/competitor/list?site_id=${(values?.site_id)}`
    //         // );
    //         const response = await getData(
    //             `site/competitor/list?site_id=${(storedDataInLocal?.site_id)}`
    //         );
    //         if (response && response.data && response.data.data) {
    //             setCompetitorList(response.data.data.competitors);
    //         } else {
    //             throw new Error("No data available in the response");
    //         }
    //     } catch (error) {
    //         console.error("API error:", error);
    //     }

    // };

    const handleSubmit = async (values) => {
        console.log(values, "handleSubmit")
        try {
            // Retrieve the site_id from local storage
            const storedDataString = localStorage.getItem("competitorId");
            const storedData = JSON.parse(storedDataString);

            console.log(storedData, "storedData");
            if (storedData) {
                const response = await getData(
                    `site/competitor/list?site_id=${storedData?.site_id}`
                );

                if (response && response.data && response.data.data) {
                    setCompetitorList(response.data.data.competitors);
                } else {
                    throw new Error("No data available in the response");
                }
            } else {
                console.error("No site_id found ");
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };


    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this item!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem("token");

                const formData = new FormData();
                formData.append("id", id);

                const axiosInstance = axios.create({
                    baseURL: process.env.REACT_APP_BASE_URL,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
                const DeleteRole = async () => {
                    try {
                        const response = await axiosInstance.post(
                            "/site/competitor/delete",
                            formData
                        );
                        setCompetitorList(response.data.data);
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your item has been deleted.",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        handleSubmit();
                        // FetchmannegerList();
                    } catch (error) {
                        handleError(error);
                    } finally {
                    }
                    // setIsLoading(false);
                };
                DeleteRole();
            }
        });
    };
    const toggleActive = (row) => {
        const formData = new FormData();
        formData.append("id", row.id);

        const newStatus = row.status === 1 ? 0 : 1;
        formData.append("status", newStatus);

        ToggleStatus(formData);
    };

    const ToggleStatus = async (formData) => {
        try {
            const response = await postData(
                "/site/competitor/update-status",
                formData
            );
            console.log(response, "response"); // Console log the response
            if (apidata.api_response === "success") {
                handleSubmit();
            }
        } catch (error) {
            handleError(error);
        }
    };

    const columns = [
        {
            name: "S.No",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "7%",
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
            width: "15%",
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
            width: "18%",
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
            width: "15%",
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
            selector: (row) => [row.address],
            // selector: "created_date",
            sortable: true,
            width: "20%",
            cell: (row, index) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.address}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: "Status",
            selector: (row) => [row.status],
            sortable: true,
            width: "10%",
            cell: (row) => (
                <span className="text-muted fs-15 fw-semibold text-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
                        {row.status === 1 ? (
                            <button
                                className="btn btn-success btn-sm"
                                onClick={
                                    isEditPermissionAvailable ? () => toggleActive(row) : null
                                }
                            >
                                Active
                            </button>
                        ) : row.status === 0 ? (
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={
                                    isEditPermissionAvailable ? () => toggleActive(row) : null
                                }
                            >
                                Inactive
                            </button>
                        ) : (
                            <button
                                className="badge"
                                onClick={
                                    isEditPermissionAvailable ? () => toggleActive(row) : null
                                }
                            >
                                Unknown
                            </button>
                        )}
                    </OverlayTrigger>
                </span>
            ),
        },
        {
            name: "Action",
            selector: (row) => [row.action],
            sortable: false,
            width: "25%",
            cell: (row) => (
                <span className="text-center">
                    {isEditPermissionAvailable ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <Link
                                to={`/edit-competitor/${row.id}`}
                                className="btn btn-primary btn-sm rounded-11 me-2"
                            >
                                <i>
                                    <svg
                                        className="table-edit"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        width="16"
                                    >
                                        <path d="M0 0h24v24H0V0z" fill="none" />
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" />
                                    </svg>
                                </i>
                            </Link>
                        </OverlayTrigger>
                    ) : null}
                    {isDeletePermissionAvailable ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Link
                                to="#"
                                className="btn btn-danger btn-sm rounded-11"
                                onClick={() => handleDelete(row.id)}
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
                    ) : null}
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

                    {isAddPermissionAvailable ? (
                        <Link
                            to="/addCompetitor/"
                            className="btn btn-primary ms-2 addclientbtn"
                        >
                            Add Competitor
                            <AddCircleOutlineIcon />
                        </Link>
                    ) : null}
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
                                        {localStorage.getItem("superiorRole") !== "Client" && (

                                            <Col lg={4} md={6}>
                                                <div className="form-group">
                                                    <label htmlFor="client_id" className="form-label mt-4">
                                                        Client
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        className={`input101 ${formik.errors.client_id && formik.touched.client_id
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="client_id"
                                                        name="client_id"
                                                        value={formik.values.client_id}
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
                                                                setSelectedCompanyList(selectedClient.companies);
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

                                                        {/* </>} */}

                                                    </select>

                                                    {formik.errors.client_id &&
                                                        formik.touched.client_id && (
                                                            <div className="invalid-feedback">
                                                                {formik.errors.client_id}
                                                            </div>
                                                        )}
                                                </div>
                                            </Col>
                                        )}

                                        <Col Col lg={4} md={6}>
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
                                                    value={formik.values.company_id}
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
                                                    className={`input101 ${formik.errors.site_id && formik.touched.site_id
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="site_id"
                                                    name="site_id"
                                                    value={formik.values.site_id}
                                                    onChange={(e) => {
                                                        const selectedsite_id = e.target.value;

                                                        formik.setFieldValue("site_id", selectedsite_id);
                                                        setSelectedSiteId(selectedsite_id);
                                                        const selectedSiteData = selectedSiteList.find(
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
                                                {formik.errors.site_id && formik.touched.site_id && (
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
                </Row>

                {/* here is my listing data table */}
                {CompetitorList ? (
                    <>
                        <Row className=" row-sm">
                            <Col lg={12}>
                                <Card>
                                    <Card.Header>
                                        <h3 className="card-title">Competitor Listing Data</h3>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="table-responsive deleted-table">
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
                    </>
                ) : (
                    <>
                        <Row className=" row-sm">
                            <Col lg={12}>
                                <Card>
                                    <Card.Header>
                                        <h3 className="card-title">Competitor Listing Data</h3>
                                    </Card.Header>
                                    <Card.Body>There is no data to show</Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </>
        </>
    );
};

export default withApi(Competitor);
