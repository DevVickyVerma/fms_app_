import { margin } from '@mui/system';
import React from 'react';
import { Card } from 'react-bootstrap';

const SmallLoader = () => {
    const loaderStyle = {
        border: "3px solid #f3f3f3", // Light grey
        borderTop: "3px solid #3498db", // Blue
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        animation: "spin 0.8s linear infinite",
        margin:"auto"
    };

    const spinnerKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

    return (
        <>
            <Card>
                <Card.Body>
                    <style>{spinnerKeyframes}</style>
                    <div style={loaderStyle}></div>
                </Card.Body>

            </Card>
        </>
    );
};

export default SmallLoader;
