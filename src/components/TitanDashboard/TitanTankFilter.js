import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const TitanTankFilter = ({ show, handleClose, formik, siteList, BestvsWorst, GraphfilterOptions, onSiteSelect, handleGradeChange, handleTankChange, PriceGraphData }) => {

    console.log(PriceGraphData, "PriceGraphData");
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Filter Options</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>Best vs Worst</label>
                        <select
                            value={formik.values.tableBWValue}
                            onChange={(e) => formik.setFieldValue("tableBWValue", e.target.value)}
                            className="form-control"
                        >
                            {BestvsWorst?.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Graph Filter Options</label>
                        <select
                            value={formik.values.tablefilterOptions}
                            onChange={(e) => formik.setFieldValue("tablefilterOptions", e.target.value)}
                            className="form-control"
                        >
                            {GraphfilterOptions?.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Site</label>
                        <select
                            value={formik.values.tableselectedSite}
                            onChange={(e) => onSiteSelect(e.target.value)}
                            className="form-control"
                        >
                            <option value="">--Select a Site--</option>
                            {siteList?.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Grade</label>
                        <select
                            value={formik.values.tableselectedGrade}
                            onChange={(e) => handleGradeChange(e.target.value)}
                            className="form-control"
                        >
                            <option value="">--Select a Grade--</option>
                            {formik.values?.selectedSiteDetails?.fuel?.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Tank</label>
                        <select
                            value={formik.values.tableselectedTank}
                            onChange={(e) => handleTankChange(e.target.value)}
                            className="form-control"
                        >
                            <option value="">--Select a Tank--</option>
                            {formik.values?.selectedGradeDetails?.tanks?.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={formik.handleSubmit}>Apply Filters</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default TitanTankFilter;