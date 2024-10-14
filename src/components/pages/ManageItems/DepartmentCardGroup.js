import { useEffect, useState } from 'react';
import Loaderimg from '../../../Utils/Loader'
import withApi from '../../../Utils/ApiHelper'
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useFormik } from 'formik'
import * as Yup from "yup";
import DataTable from 'react-data-table-component'
import { useSelector } from 'react-redux'
import { AiOutlineEye } from "react-icons/ai";
import DepartmentCardGroupCenterModal from './DepartmentCardGroupCenterModal'
import NewFilterTab from '../Filtermodal/NewFilterTab';
import { handleFilterData } from '../../../Utils/commonFunctions/commonFunction';
import useCustomDelete from '../../../Utils/useCustomDelete';

const DepartmentCardGroup = ({ isLoading, getData, postData, apidata }) => {
    const [data, setData] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showAddButton, setShowAddButton] = useState(false);
    const [detailApiData, setDetailApiData] = useState()
    const ReduxFullData = useSelector((state) => state?.data?.data);
    const UserPermissions = useSelector((state) => state?.data?.data?.permissions || []);
    const isEditPermissionAvailable = UserPermissions?.includes("department-item-group");
    const isAddPermissionAvailable = UserPermissions?.includes("department-item-group");
    const isDeletePermissionAvailable = UserPermissions?.includes("department-item-group-delete");


    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        company_id: Yup.string().required("Company is required"),
    });


    const { customDelete } = useCustomDelete();

    const handleDelete = (id) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'department-item/group/delete', formData, handleSuccess);
    };





    const handleSuccess = () => {
        handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
    }


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




    const handleClearForm = async () => {
        setData(null)
    };

    const handleSubmit1 = async (values) => {
        try {
            const response = await getData(
                `/department-item/group/list?company_id=${values.company_id}`
            );
            setData(response?.data?.data?.itemGroups);
            setShowAddButton(true);
        } catch (error) {
            console.error("API error:", error);
        }
    };




    const fetchUpdateCardDetail = async (rowId) => {
        try {
            const response = await getData(`/department-item/group/detail/${rowId}`);

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
            name: "Item Group",
            selector: (row) => [row.name],
            sortable: false,
            width: "40%",
            cell: (row) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block ">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Items",
            selector: (row) => [row.name],
            sortable: false,
            width: "30%",
            cell: (row) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold " style={{ cursor: "pointer" }} onClick={() => fetchUpdateCardDetail(row.id)}><AiOutlineEye size={24} /></h6>
                    </div>
                </div>
            ),
        },

        {
            name: "Action",
            selector: (row) => [row.action],
            sortable: false,
            width: "20%",
            cell: (row) => (
                <span className="text-center d-flex justify-content-center gap-1 flex-wrap">
                    {isEditPermissionAvailable ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <Link
                                to={`/department-item-group/${row.id}`}
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

    let storedKeyName = "localFilterModalData";

    useEffect(() => {
        handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
    }, []);


    const handleApplyFilters = (values) => {
        if (values?.start_date && values?.company_id) {
            handleSubmit1(values)
        }
    }


    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div className="page-header ">
                <div>
                    <h1 className="page-title">Department Item Group</h1>
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
                            Department Item Group
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>



            <DepartmentCardGroupCenterModal
                showModal={showModal}
                setShowModal={setShowModal}
                detailApiData={detailApiData}
            />

            <Row>
                <Col md={12} xl={12}>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title"> Fuel Price </h3>
                        </Card.Header>

                        <NewFilterTab
                            getData={getData}
                            isLoading={isLoading}
                            isStatic={true}
                            onApplyFilters={handleApplyFilters}
                            validationSchema={validationSchemaForCustomInput}
                            storedKeyName={storedKeyName}
                            lg="4"
                            showStationValidation={false}
                            showMonthInput={false}
                            showDateInput={false}
                            showStationInput={false}
                            ClearForm={handleClearForm}
                        />

                    </Card>
                </Col>
            </Row>




            <Row className=" row-sm">
                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">
                                Item Group
                            </h3>

                            <div className="ms-auto pageheader-btn  d-flex align-items-center">
                                <div className="input-group">
                                    {isAddPermissionAvailable && showAddButton && formik?.values?.company_id ? (
                                        <Link
                                            to={`/department-add-group/${formik?.values?.company_id}`}
                                            className="btn btn-primary ms-2"
                                            style={{ borderRadius: "4px" }}
                                        >
                                            Add items Group     <i className="ph ph-plus ms-1 ph-plus-icon" />
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                        </Card.Header>

                        <Card.Body>
                            {data?.length > 0 ? (
                                <>
                                    <div className="table-responsive deleted-table">
                                        <DataTable
                                            columns={columns}
                                            data={data}
                                            noHeader={true}
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            striped={true}
                                            persistTableHead={true}
                                            highlightOnHover={true}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={require("../../../assets/images/commonimages/no_data.png")}
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

export default withApi(DepartmentCardGroup);