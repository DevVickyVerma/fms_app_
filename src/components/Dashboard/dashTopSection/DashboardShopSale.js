import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { AiFillEye } from "react-icons/ai";
import DashboardShopSaleCenterModal from './DashboardShopSaleCenterModal';
import { toast } from 'react-toastify';
import axios from 'axios';
import Item from 'antd/es/list/Item';
import { useNavigate, useParams } from 'react-router-dom';
import Loaderimg from '../../../Utils/Loader';

const DashboardShopSale = ({ getSiteDetails }) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [shopPerformanceData, setShopPerformanceData] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();




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

    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const handleOpenModal = async (item) => {

        setIsLoading(true)

        try {
            const response = await axiosInstance.get(`/dashboard/get-site-shop-performance?start_date=${getSiteDetails?.fuel_site_timings?.opening_time}&end_date=${getSiteDetails?.fuel_site_timings?.closing_time}&site_id=${id}&category_id=${item.id}`);
            if (response.data) {

                setShopPerformanceData(response?.data?.data)
                setShowModal(true);
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            handleError(error);
        }
        setIsLoading(false)
    };


    console.clear();

    const renderTableHeader = () => {
        return (
            <tr className="fuelprice-tr" style={{ padding: "0px" }}>
                <th className='dashboard-shopSale-table-width dashboard-shopSale-table-th' style={{ width: "25%" }}>Name</th>
                <th className='dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center' style={{ width: "15%" }}>Gross Sales</th>
                <th className='dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center' style={{ width: "15%" }}>Net Sales</th>
                <th className='dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center' style={{ width: "15%" }}>Profit</th>
                <th className='dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center' style={{ width: "15%" }}>Total transaction </th>
                <th className='dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center' style={{ width: "15%" }}>Details</th>
            </tr>
        );
    };

    const renderTableData = () => {
        return getSiteDetails?.shop_sales?.data?.map((item) => (
            <tr className="fuelprice-tr " key={item.id} style={{ padding: "0px" }}>
                <td className='dashboard-shopSale-table-width dashboard-shopSale-table-td ' style={{ minWidth: "25%" }}>
                    <div className="d-flex align-items-center justify-center h-100">
                        <div className="d-flex">
                            <div className="ms-2 mt-0 mt-sm-2 d-block">
                                <h6 className="mb-0 fs-15 fw-semibold ">{item?.name}</h6>
                            </div>
                        </div>
                    </div>
                </td>


                <td className='dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center'>
                    <div className="d-flex align-items-center h-100 ">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <h6 className="mb-0 fs-14 fw-semibold ">
                                {item?.gross_sales}
                            </h6>
                        </div>
                    </div>
                </td>

                <td className='dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center'>

                    <div className="d-flex">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <h6 className="mb-0 fs-14 fw-semibold">
                                {item?.nett_sales}
                            </h6>

                        </div>
                    </div>
                </td>

                <td className='dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center'>
                    <div className="d-flex">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <h6 className="mb-0 fs-14 fw-semibold">
                                {item?.profit}
                            </h6>
                        </div>
                    </div>
                </td>
                <td className='dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center'>
                    <div className="d-flex">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <h6 className="mb-0 fs-14 fw-semibold">
                                {item?.total_transactions}
                            </h6>
                        </div>
                    </div>
                </td>
                {item?.total_transactions > 0 ? <>
                    <td className='dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center'>
                        <div className="d-flex justify-content-center">
                            <div className="ms-2 mt-0 mt-sm-2 d-block">
                                <h6 className="mb-0 fs-14 fw-semibold"
                                    onClick={() => handleOpenModal(item)}
                                >
                                    <span className='dashboard-shop-sale-icon all-center-flex ' style={{ cursor: "pointer" }}>
                                        <AiFillEye size={15} className=' all-center-flex' />
                                    </span>
                                </h6>
                            </div>
                        </div>
                    </td></> : <td className='dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center'>
                    <div className="d-flex justify-content-center">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">

                        </div>
                    </div>
                </td>}

            </tr>
        ));
    };
    return (
        <>
            {isLoading ? <Loaderimg /> : ""}
            <DashboardShopSaleCenterModal showModal={showModal} setShowModal={setShowModal} shopPerformanceData={shopPerformanceData} />
            <Row>
                <Col lg={12} xl={12} md={12} sm={12}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <h3 className="card-title">Shop Sales</h3>
                        </Card.Header>
                        <Card.Body>
                            {getSiteDetails?.shop_sales?.data ? (
                                <div
                                    className="table-container table-responsive"
                                    style={{
                                        overflowY: "auto",
                                        maxHeight: "calc(100vh - 376px )",
                                    }}
                                >
                                    <table className="table">
                                        <thead
                                            style={{
                                                position: "sticky",
                                                top: "0",
                                                width: "100%",
                                            }}
                                        >
                                            <tr className="fuelprice-tr">{renderTableHeader()}</tr>
                                        </thead>
                                        <tbody>{renderTableData()}</tbody>
                                    </table>
                                </div>
                            ) : (
                                <img
                                    src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                                    alt="MyChartImage"
                                    className="all-center-flex nodata-image"
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default DashboardShopSale