import React, { useEffect, useState } from 'react'
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from "yup";
import DataTable from 'react-data-table-component'
import DataTableExtensions from "react-data-table-component-extensions";
import { useSelector } from 'react-redux'
import { AiOutlineEye } from "react-icons/ai";
import Loaderimg from '../../../../Utils/Loader';
import CardGroupCenterModal from '../../ManageCards/CardGroupCenterModal';
import CustomClient from '../../../../Utils/CustomClient';
import CustomCompany from '../../../../Utils/CustomCompany';
import withApi from '../../../../Utils/ApiHelper';
import { handleError } from '../../../../Utils/ToastUtils';
import Swal from 'sweetalert2';

const Types = ({ isLoading, getData, postData, apidata }) => {
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [selectedSiteId, setSelectedSiteId] = useState("");
    const [ClientList, setClientList] = useState([]);
    const [CompanyList, setCompanyList] = useState([]);
    const [SiteList, setSiteList] = useState([]);
    const [selectedCompanyList, setSelectedCompanyList] = useState([]);
    const [data, setData] = useState();
    const [permissionsArray, setPermissionsArray] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAddButton, setShowAddButton] = useState(false);
    const [detailApiData, setDetailApiData] = useState()
    const UserPermissions = useSelector((state) => state?.data?.data);
    const isEditPermissionAvailable = permissionsArray?.includes("type-edit");
    const isAddPermissionAvailable = permissionsArray?.includes("type-create");
    const isDeletePermissionAvailable = permissionsArray?.includes("type-delete");
    const navigate = useNavigate();

    const isstatusPermissionAvailable =
        permissionsArray?.includes("type-edit");

    useEffect(() => {
        if (UserPermissions) {
            setPermissionsArray(UserPermissions.permissions);
        }
    }, [UserPermissions])

    const formik = useFormik({
        initialValues: {
            client_id: "",
            company_id: "",
        },
        validationSchema: Yup.object({
            company_id: Yup.string().required("Company is required"),
        }),

        onSubmit: (values) => {
            handleSubmit1(values);
        },
    });

    const handleSubmit1 = async (values) => {
        try {
            const response = await getData(
                `/payroll/types/list?company_id=${values.company_id}`
            );
            setSelectedCompanyId(values?.company_id)
            setData(response?.data?.data?.balances);
            setShowAddButton(true);
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const afterUpdateListApi = async () => {
        try {
            const response = await getData(
                `/payroll/types/list?company_id=${selectedCompanyId}`
            );
            setData(response?.data?.data?.balances);
            setShowAddButton(true);
        } catch (error) {
            console.error("API error:", error);
        }
    };



    useEffect(() => {
        const clientId = localStorage.getItem("superiorId");

        if (localStorage.getItem("superiorRole") !== "Client") {
            fetchCommonListData()
        } else {
            setSelectedClientId(clientId);
            GetCompanyList(clientId)
        }
    }, []);

    const fetchCommonListData = async () => {
        try {
            const response = await getData("/common/client-list");

            const { data } = response;
            if (data) {
                setClientList(response.data);

                const clientId = localStorage.getItem("superiorId");
                if (clientId) {
                    setSelectedClientId(clientId);
                    setSelectedCompanyList([]);

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
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const GetCompanyList = async (values) => {
        try {
            if (values) {
                const response = await getData(
                    `common/company-list?client_id=${values}`
                );

                if (response) {

                    setCompanyList(response?.data?.data);
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

    console.log(data, "mydata");


    const GetSiteList = async (values) => {
        try {
            if (values) {
                const response = await getData(`common/site-list?company_id=${values}`);

                if (response) {

                    setSiteList(response?.data?.data);
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

    const toggleActiveEdit = (row) => {
        navigate(`/update-type-list/${row.id}`)
    }




    const toggleActive = (row) => {
        const formData = new FormData();
        formData.append("id", row.id);
        formData.append("company_id", selectedCompanyId);


        const newStatus = row.status === 1 ? 0 : 1;
        formData.append("status", newStatus);

        ToggleStatus(formData);
    };

    const ToggleStatus = async (formData) => {
        try {
            const response = await postData("/payroll/types/update-status", formData);
            // Console log the response
            if (apidata.api_response === "success") {
                afterUpdateListApi();
            }
        } catch (error) {
            handleError(error);
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
                const formData = new FormData();
                formData.append("id", id);
                DeleteClient(formData);
            }
        });
    };
    const DeleteClient = async (formData) => {
        try {
            const response = await postData("payroll/types/delete", formData);
            // Console log the response
            if (apidata.api_response === "success") {
                afterUpdateListApi();
            }
        } catch (error) {
            handleError(error);
        }
    };

    const fetchUpdateCardDetail = async (rowId) => {
        try {
            const response = await getData(`/sage/card-group/detail/${rowId}`);

            const { data } = response;
            if (data) {
                setDetailApiData(data?.data ? data.data : [])
                setShowModal(true);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const columns = [
        {
            name: "Sr. No.",
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
            name: "Types",
            selector: (row) => [row.name],
            sortable: true,
            width: "20%",
            cell: (row, index) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block ">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Creator",
            selector: (row) => [row.creator],
            sortable: true,
            width: "20%",
            cell: (row, index) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block ">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.creator}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Created Date",
            selector: (row) => [row.created_date],
            sortable: true,
            width: "20%",
            cell: (row, index) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block ">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: "Status",
            selector: (row) => [row.status],
            sortable: true,
            width: "20%",
            cell: (row) => (
                <span className="text-muted fs-15 fw-semibold text-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
                        {row.status === 1 ? (
                            <button
                                className="btn btn-success btn-sm"
                                onClick={
                                    isstatusPermissionAvailable ? () => toggleActive(row) : null
                                }
                            >
                                Active
                            </button>
                        ) : row.status === 0 ? (
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={
                                    isstatusPermissionAvailable ? () => toggleActive(row) : null
                                }
                            >
                                Inactive
                            </button>
                        ) : (
                            <button
                                className="badge"
                                onClick={
                                    isstatusPermissionAvailable ? () => toggleActive(row) : null
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
            sortable: true,
            width: "20%",
            cell: (row) => (
                <span className="text-center d-flex justify-content-center gap-1 flex-wrap">
                    {isEditPermissionAvailable ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <Link
                                to={`/update-type-list/${row.id}`}
                                className="btn btn-primary btn-sm rounded-11 me-2 responsive-btn"
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
                                className="btn btn-danger btn-sm rounded-11 responsive-btn"
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
    ]


    const tableDatas = {
        columns,
        data,
    };

    localStorage.setItem("cardsCompanyId", selectedCompanyId)

    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div className="page-header ">
                <div>
                    <h1 className="page-title">Types</h1>
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
                            Types
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>




            <>
                <Row>
                    <Col md={12} xl={12}>
                        <Card>
                            <form onSubmit={formik.handleSubmit}>
                                <Card.Header>
                                    <h3 className="card-title">
                                        Types
                                    </h3>
                                </Card.Header>
                                <Card.Body>
                                    <Row>

                                        <CustomClient
                                            formik={formik}
                                            lg={4}
                                            md={4}
                                            ClientList={ClientList}
                                            setSelectedClientId={setSelectedClientId}
                                            setSiteList={setSiteList}
                                            setCompanyList={setCompanyList}
                                            GetCompanyList={GetCompanyList}
                                        />

                                        <CustomCompany
                                            formik={formik}
                                            lg={4}
                                            md={4}
                                            CompanyList={CompanyList}
                                            setSelectedCompanyId={setSelectedCompanyId}
                                            setSiteList={setSiteList}
                                            selectedClientId={selectedClientId}
                                            GetSiteList={GetSiteList}
                                        />


                                    </Row>
                                </Card.Body>

                                <Card.Footer className="text-end">
                                    <Link
                                        type="submit"
                                        className="btn btn-danger me-2 "
                                        to={`/dashboard`}
                                    >
                                        Cancel
                                    </Link>
                                    <button className="btn btn-primary m-2 " type="submit">
                                        Submit
                                    </button>
                                </Card.Footer>
                            </form>

                        </Card>
                    </Col>
                </Row>
            </>

            <Row className=" row-sm">
                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">
                                Types
                            </h3>

                            <div className="ms-auto pageheader-btn  d-flex align-items-center">
                                <div className="input-group">
                                    {isAddPermissionAvailable && showAddButton ? (
                                        <Link
                                            to={`/add-type-list`}
                                            className="btn btn-primary ms-2"
                                            style={{ borderRadius: "4px" }}
                                        >
                                            Add Types
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                        </Card.Header>

                        <Card.Body>
                            {data?.length > 0 ? (
                                <>
                                    <div className="table-responsive deleted-table">
                                        <DataTableExtensions {...tableDatas}>
                                            <DataTable
                                                columns={columns}
                                                data={data}
                                                noHeader
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                striped={true}
                                                // center={true}
                                                persistTableHead
                                                pagination
                                                paginationPerPage={20}
                                                highlightOnHover
                                                searchable={true}
                                            />
                                        </DataTableExtensions>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={require("../../../../assets/images/noDataFoundImage/noDataFound.jpg")}
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
    )
}

export default withApi(Types);
