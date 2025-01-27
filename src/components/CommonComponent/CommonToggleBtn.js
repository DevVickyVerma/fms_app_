import React, { useState } from "react";
import { Row, Col } from "react-bootstrap"; // Assuming you're using reactstrap or a similar library
import Switch from "react-switch"; // Replace with your Switch library if different

const CommonToggleBtn = () => {
    const [toggleValue, setToggleValue] = useState(false);

    const handleToggleChange = () => {
        setToggleValue(!toggleValue);
    };

    return (
        <Row>
            <Col lg={12} md={12}>
                <div className="form-group">
                    <label className="form-label mt-4">Get Reports By Date</label>
                    <Switch
                        id="customToggle"
                        checked={toggleValue}
                        onChange={handleToggleChange}
                        onColor="#28a745" // Green for "ON"
                        offColor="#dc3545" // Red for "OFF"
                        onHandleColor="#ffffff" // White handle
                        offHandleColor="#ffffff" // White handle
                        checkedIcon={false} // No text inside the toggle
                        uncheckedIcon={false}
                    />
                </div>
            </Col>
        </Row>
    );
};

export default CommonToggleBtn;
