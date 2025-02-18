import { Modal } from "react-bootstrap";
import { BestvsWorst, GraphfilterOptions } from "../../Utils/commonFunctions/commonFunction";
import { useFormik } from "formik";

const TitanTankFilter = ({ show, handleClose, PriceGraphData, onSubmit }) => {
    // Initialize Formik for tank filter
    const tankFormik = useFormik({
        initialValues: {
            tableBWValue: '',
            tablefilterOptions: '',
            tableselectedSite: '',
            selectedSiteDetails: {},
            tableselectedGrade: '',
            selectedGradeDetails: {},
            tableselectedTank: '',
            selectedTankDetails: ''
        },
        onSubmit: async (values) => {
            // Call onSubmit (this will call the function passed from the parent)
            onSubmit(values);
            console.log("Form values: ", values);
            // Handle submit action (e.g., API call or state update)
        }
    });

    const siteList = PriceGraphData?.fuel_mapping?.map(site => ({
        id: site.site_id,
        name: site.name,
        fuel: site?.fuel // Extract fuel types
    }));

    const handleGradeChange = async (selectedId) => {
        const tableselectedSite = tankFormik.values?.selectedSiteDetails?.fuel?.find(site => site.id == selectedId);
        if (tableselectedSite) {
            await tankFormik.setFieldValue("tableselectedGrade", selectedId);
            await tankFormik.setFieldValue("selectedGradeDetails", tableselectedSite);
        } else {
            await tankFormik.setFieldValue("tableselectedGrade", "");
            await tankFormik.setFieldValue("selectedGradeDetails", "");
        }
    };

    const handleTankChange = async (selectedId) => {
        const tableselectedSite = tankFormik.values?.selectedGradeDetails?.tanks?.find(site => site.id == selectedId);
        if (tableselectedSite) {
            await tankFormik.setFieldValue("tableselectedTank", selectedId);
            await tankFormik.setFieldValue("selectedTankDetails", tableselectedSite);
        } else {
            await tankFormik.setFieldValue("tableselectedTank", "");
            await tankFormik.setFieldValue("selectedTankDetails", "");
        }
    };

    const onSiteSelect = async (selectedId) => {
        const tableselectedSite = siteList?.find(site => site.id === selectedId);
        try {
            if (tableselectedSite) {
                await tankFormik.setFieldValue("tableselectedSite", tableselectedSite?.id);
                await tankFormik.setFieldValue("selectedSiteDetails", tableselectedSite);
            } else {
                await tankFormik.setFieldValue("tableselectedSite", "");
                await tankFormik.setFieldValue("selectedSiteDetails", "");
            }
        } catch (error) {
            console.error("Error in handleSiteChange:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Filter </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>Best vs Worst</label>
                        <select
                            value={tankFormik.values.tableBWValue}
                            onChange={(e) => tankFormik.setFieldValue("tableBWValue", e.target.value)}
                            className="form-control"
                        >
                            {BestvsWorst?.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Duration</label>
                        <select
                            value={tankFormik.values.tablefilterOptions}
                            onChange={(e) => tankFormik.setFieldValue("tablefilterOptions", e.target.value)}
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
                            value={tankFormik.values.tableselectedSite}
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
                            value={tankFormik.values.tableselectedGrade}
                            onChange={(e) => handleGradeChange(e.target.value)}
                            className="form-control"
                        >
                            <option value="">--Select a Grade--</option>
                            {tankFormik.values?.selectedSiteDetails?.fuel?.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Tank</label>
                        <select
                            value={tankFormik.values.tableselectedTank}
                            onChange={(e) => handleTankChange(e.target.value)}
                            className="form-control"
                        >
                            <option value="">--Select a Tank--</option>
                            {tankFormik.values?.selectedGradeDetails?.tanks?.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-danger" variant="secondary" onClick={handleClose}>Close</button>
                <button className="btn btn-primary" variant="primary" onClick={tankFormik.handleSubmit}>Apply</button>
            </Modal.Footer>
        </Modal>
    );
};

export default TitanTankFilter;
