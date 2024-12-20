import React from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';

const TabDesign = () => {
    return (

        <Tabs
            defaultActiveKey="Competitor"
            id="uncontrolled-tab-example"
            className="mb-3"
            style={{ backgroundColor: "#fff" }}
        >
            <Tab eventKey="Competitor" title="Competitor">
                <div className="p-3">
                    <h4>Competitor Tab</h4>

                </div>
            </Tab>
            <Tab eventKey="FMS" title="FMS">
                <div className="p-3">
                    <h4> FMS</h4>
                </div>
            </Tab>
            <Tab eventKey="OV" title="OV" >
                <div className="p-3">
                    <h4>OV </h4>
                </div>
            </Tab>
        </Tabs>

    );
};

export default TabDesign;
