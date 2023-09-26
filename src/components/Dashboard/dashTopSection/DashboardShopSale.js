import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'

const DashboardShopSale = ({ getSiteDetails }) => {

    const renderTableHeader = () => {
        return (
            <tr className="fuelprice-tr" style={{ padding: "0px" }}>
                <th className='dashboard-shopSale-table-width dashboard-shopSale-table-th'>Name</th>
                <th className='dashboard-shopSale-table-width dashboard-shopSale-table-th'>Gross Sales</th>
                <th className='dashboard-shopSale-table-width dashboard-shopSale-table-th'>Net Sales</th>
                <th className='dashboard-shopSale-table-width dashboard-shopSale-table-th'>Profit</th>
            </tr>
        );
    };

    const renderTableData = () => {
        return getSiteDetails?.shop_sales?.data?.map((item) => (
            <tr className="fuelprice-tr" key={item.id} style={{ padding: "0px" }}>

                <td className='dashboard-shopSale-table-width dashboard-shopSale-table-td'>
                    <div className="d-flex align-items-center justify-center h-100">
                        <div className="d-flex">
                            <div className="ms-2 mt-0 mt-sm-2 d-block">
                                <h6 className="mb-0 fs-15 fw-semibold ">{item?.name}</h6>
                            </div>
                        </div>
                    </div>
                </td>


                <td className='dashboard-shopSale-table-width dashboard-shopSale-table-td'>
                    <div className="d-flex align-items-center h-100 ">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <h6 className="mb-0 fs-14 fw-semibold ">
                                {item?.gross_sales}
                            </h6>


                        </div>
                    </div>
                </td>

                <td className='dashboard-shopSale-table-width dashboard-shopSale-table-td'>

                    <div className="d-flex">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <h6 className="mb-0 fs-14 fw-semibold">
                                {item?.nett_sales}
                            </h6>

                        </div>
                    </div>
                </td>

                <td className='dashboard-shopSale-table-width dashboard-shopSale-table-td'>
                    <div className="d-flex">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <h6 className="mb-0 fs-14 fw-semibold">
                                {item?.profit}
                            </h6>
                        </div>
                    </div>
                </td>
            </tr>
        ));
    };
    return (
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
                                // style={{ height: "700px", overflowY: "auto" }}
                                style={{
                                    overflowY: "auto",
                                    maxHeight: "calc(100vh - 376px )",
                                }}
                            // height:"245"
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
    )
}

export default DashboardShopSale