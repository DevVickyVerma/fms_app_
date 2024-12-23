import React, { useState } from 'react';
import { Tabs, Tab, Container, Card } from 'react-bootstrap';
import PriceLogTable from '../../Dashboard/PriceLogTable';
import { PriceLogsFilterValue } from '../../../Utils/commonFunctions/commonFunction';
import { PriceLogs } from '../../../Utils/commonFunctions/CommonData';

const TabDesign = () => {
    const [PriceLogsvalue, setPriceLogsvalue] = useState(PriceLogsFilterValue[0]?.value); // state for selected site

    return (

        <>
            <Tabs
                defaultActiveKey="Competitor"
                id="uncontrolled-tab-example"
                className="mb-3"
                style={{ backgroundColor: "#fff" }}
            >
                <Tab eventKey="Competitor" title="Competitor">
                    <Card>
                        <Card.Body>
                            <table
                                className="table table-modern tracking-in-expand"
                                style={{ width: "100%" }}
                            >
                                <thead>
                                    <tr>

                                        <th scope="col">Img</th>
                                        <th scope="col">Site </th>
                                        <th scope="col">Compitior </th>
                                        <th scope="col">Date</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {PriceLogs?.priceLogs?.map((log) => (
                                        <tr key={log.id}>
                                            <td className="py-2">{log.name}</td>
                                            <td>{log.site}</td>
                                            <td>{log.name}</td>

                                            <td>{log.created}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card.Body>
                    </Card>

                </Tab>
                <Tab eventKey="FMS" title="FMS">
                    <Card>
                        <Card.Body>
                            <table
                                className="table table-modern tracking-in-expand"
                                style={{ width: "100%" }}
                            >
                                <thead>
                                    <tr>

                                        <th scope="col">Logo</th>
                                        <th scope="col">Site </th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Details</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {PriceLogs?.priceLogs?.map((log) => (
                                        <tr key={log.id}>
                                            <td className="py-2">{log.name}</td>
                                            <td>{log.site}</td>
                                            <td>{log.created}</td>
                                            <td>{log.type}</td>


                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="OV" title="OV" >
                    <Card>
                        <Card.Body>
                            <table
                                className="table table-modern tracking-in-expand"
                                style={{ width: "100%" }}
                            >
                                <thead>
                                    <tr>

                                        <th scope="col">Img</th>
                                        <th scope="col">Site </th>
                                        <th scope="col">Compitior </th>
                                        <th scope="col">Date</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {PriceLogs?.priceLogs?.map((log) => (
                                        <tr key={log.id}>
                                            <td className="py-2">{log.name}</td>
                                            <td>{log.site}</td>
                                            <td>{log.name}</td>

                                            <td>{log.created}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>





        </>

    );
};

export default TabDesign;
