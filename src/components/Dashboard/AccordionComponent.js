import { Accordion } from 'react-bootstrap';
import CEODashboardCompetitor from './CEODashboardCompetitor';
import { useState } from 'react';
import { staticCompiCEOValues } from '../../Utils/commonFunctions/commonFunction';

const AccordionComponent = () => {
    const [getCompetitorsPrice, setGetCompetitorsPrice] =
        useState(staticCompiCEOValues);
    // An array to map over for 10 Accordion items
    const accordionItems = new Array(10).fill(null).map((_, index) => ({
        eventKey: `item-${index + 1}`,  // Unique key for each Accordion item
        header: `0${index + 1}-12-2024`,  // Header text
        content: `This is the content for Accordion Item #${index + 1}`,  // Content for each item
    }));

    return (
        <Accordion defaultActiveKey="0">
            {accordionItems.map((item, index) => (
                <Accordion.Item eventKey={item.eventKey} key={index} className="mb-2">
                    <Accordion.Header style={{ background: "#fff" }}>
                        {item.header}
                    </Accordion.Header>
                    <Accordion.Body>
                        <CEODashboardCompetitor
                            getCompetitorsPrice={getCompetitorsPrice}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
};

export default AccordionComponent;
