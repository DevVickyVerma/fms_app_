import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap"; // You might need to install 'react-bootstrap' if not already installed
import { AiOutlineClose } from "react-icons/ai";
import { ErrorAlert } from "../../../Utils/ToastUtils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";

const MapDepartmentItems = ({
  showModal,
  handleClose,
  modalTitle,
  itemid,
  companyid,
}) => {
  const navigate = useNavigate();
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }
  const [data, setData] = useState();
  const token = localStorage.getItem("token");
  const defaultHead = {
    id: "",
    sage_export_type: "",
    account_code: "",
    nominal_code: "",
    positive_nominal_type_id: "",
    negative_nominal_type_id: "",
    nominal_tax_code_id: "",
  };
  
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const GetSiteData = async () => {
    try {
      const response = await axiosInstance.get(
        `sage/item/heads?company_id=${companyid}&item_id=${itemid}`
      );

      if (response.data) {
        console.log(response.data.data, "columnIndex");
        setData(response?.data?.data);
        if (response.data.data.heads.length == 0) {
          // If empty, push the defaultHead into the array
          response.data.data.heads.push(defaultHead);
        }
        console.log( response.data.data.heads, "+ response.data.data.heads")
}
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    try {
      if (companyid && itemid) {
        GetSiteData();
      }
    } catch (error) {
      handleError(error);
    }
    // console.clear()
    console.clear();
  }, [companyid, itemid]);

  const formik = useFormik({
    initialValues: {
      sage_export_type: "",
      account_code: "",
      nominal_code: "",
      positive_nominal_type_id: "",
      negative_nominal_type_id: "",
      nominal_tax_code_id: "",
    },
    onSubmit: (values) => {
      // Handle form submission logic here
      console.log(values);
    },
  });

  const setFieldValuesFromHeads = (head) => {
    formik.setFieldValue('sage_export_type', head?.sage_export_type || '');
    formik.setFieldValue('positive_nominal_type_id', head?.positive_nominal_type_id || '');
    formik.setFieldValue('negative_nominal_type_id', head?.negative_nominal_type_id || '');
    formik.setFieldValue('nominal_tax_code_id', head?.nominal_tax_code_id || '');
    formik.setFieldValue('account_code', head?.account_code || '');
    formik.setFieldValue('nominal_code', head?.nominal_code || '');
  };


 

  
  useEffect(() => {
    if (data?.heads?.length > 0) {
      // Loop through each head and set field values
      data.heads.forEach((head, index) => {
        setFieldValuesFromHeads(head);
        
      });
    }
  }, [data]); 
  

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header
        style={{
          color: "#fff",
          background: "#6259ca",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ paddingBottom: "0px" }}>
          <Modal.Title style={{ margin: "0px" }}>{modalTitle}</Modal.Title>
        </div>
        <div>
          <span
            className="modal-icon close-button"
            onClick={handleClose}
            style={{ cursor: "pointer" }}
          >
            <AiOutlineClose />
          </span>
        </div>
      </Modal.Header>
      <Modal.Body>
      {data?.heads.map((head) => (
        <form key={head.id} onSubmit={formik.handleSubmit}>
          <div className="card-body">
            <Row>
              <Col lg={2} md={2}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor={`sage_export_type-${head.id}`}>
                    Export Types<span className="text-danger">*</span>
                  </label>
                  <select
                    type="text"
                    autoComplete="off"
                    className={`input101 ${
                      formik.errors.sage_export_type && formik.touched.sage_export_type
                        ? 'is-invalid'
                        : ''
                    }`}
                    id={`sage_export_type-${head.id}`}
                    name={`sage_export_type-${head.id}`}
                    placeholder="sage_export_type"
                    onChange={formik.handleChange}
                    value={formik.values.sage_export_type}
                  >
                    <option value="" label="Select Sage Export" />
                    {data?.sageExport.map((option) => (
                      <option key={option.id} value={option.id} label={option.name} />
                    ))}
                  </select>
                  {formik.errors.sage_export_type && formik.touched.sage_export_type && (
                    <div className="invalid-feedback">{formik.errors.sage_export_type}</div>
                  )}
                </div>
              </Col>
              <Col lg={2} md={2}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor={`account_code-${head.id}`}>
                    Account Code<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    className={`input101 ${
                      formik.errors.account_code && formik.touched.account_code ? 'is-invalid' : ''
                    }`}
                    id={`account_code-${head.id}`}
                    name={`account_code-${head.id}`}
                    placeholder="account_code"
                    onChange={formik.handleChange}
                    value={formik.values.account_code}
                  />
                  {formik.errors.account_code && formik.touched.account_code && (
                    <div className="invalid-feedback">{formik.errors.account_code}</div>
                  )}
                </div>
              </Col>
              {/* Add similar code for other form fields */}
              <Col lg={2} md={2}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor={`nominal_code-${head.id}`}>
                    Nominal Code<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    className={`input101 ${
                      formik.errors.nominal_code && formik.touched.nominal_code ? 'is-invalid' : ''
                    }`}
                    id={`nominal_code-${head.id}`}
                    name={`nominal_code-${head.id}`}
                    placeholder="nominal_code"
                    onChange={formik.handleChange}
                    value={formik.values.nominal_code}
                  />
                  {formik.errors.nominal_code && formik.touched.nominal_code && (
                    <div className="invalid-feedback">{formik.errors.nominal_code}</div>
                  )}
                </div>
              </Col>
              <Col lg={2} md={2}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor={`positive_nominal_type_id-${head.id}`}>
                    Positive Types<span className="text-danger">*</span>
                  </label>
                  <select
                    type="text"
                    autoComplete="off"
                    className={`input101 ${
                      formik.errors.positive_nominal_type_id &&
                      formik.touched.positive_nominal_type_id
                        ? 'is-invalid'
                        : ''
                    }`}
                    id={`positive_nominal_type_id-${head.id}`}
                    name={`positive_nominal_type_id-${head.id}`}
                    placeholder="positive_nominal_type_id"
                    onChange={formik.handleChange}
                    value={formik.values.positive_nominal_type_id}
                  >
                    <option value="" label="Select Sage Positive Types" />
                    {data?.types.map((option) => (
                      <option key={option.id} value={option.id} label={option.name} />
                    ))}
                  </select>
                  {formik.errors.positive_nominal_type_id &&
                    formik.touched.positive_nominal_type_id && (
                      <div className="invalid-feedback">
                        {formik.errors.positive_nominal_type_id}
                      </div>
                    )}
                </div>
              </Col>
              <Col lg={2} md={2}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor={`negative_nominal_type_id-${head.id}`}>
                    Negative Types<span className="text-danger">*</span>
                  </label>
                  <select
                    type="text"
                    autoComplete="off"
                    className={`input101 ${
                      formik.errors.negative_nominal_type_id &&
                      formik.touched.negative_nominal_type_id
                        ? 'is-invalid'
                        : ''
                    }`}
                    id={`negative_nominal_type_id-${head.id}`}
                    name={`negative_nominal_type_id-${head.id}`}
                    placeholder="negative_nominal_type_id"
                    onChange={formik.handleChange}
                    value={formik.values.negative_nominal_type_id}
                  >
                    <option value="" label="Select Sage Negative Types" />
                    {data?.types.map((option) => (
                      <option key={option.id} value={option.id} label={option.name} />
                    ))}
                  </select>
                  {formik.errors.negative_nominal_type_id &&
                    formik.touched.negative_nominal_type_id && (
                      <div className="invalid-feedback">
                        {formik.errors.negative_nominal_type_id}
                      </div>
                    )}
                </div>
              </Col>
              <Col lg={2} md={2}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor={`nominal_tax_code_id-${head.id}`}>
                    Tax Code<span className="text-danger">*</span>
                  </label>
                  <select
                    type="text"
                    autoComplete="off"
                    className={`input101 ${
                      formik.errors.nominal_tax_code_id &&
                      formik.touched.nominal_tax_code_id
                        ? 'is-invalid'
                        : ''
                    }`}
                    id={`nominal_tax_code_id-${head.id}`}
                    name={`nominal_tax_code_id-${head.id}`}
                    placeholder="nominal_tax_code_id"
                    onChange={formik.handleChange}
                    value={formik.values.nominal_tax_code_id}
                  >
                    <option value="" label="Select Sage Export" />
                    {data?.taxCodes.map((option) => (
                      <option key={option.id} value={option.id} label={option.name} />
                    ))}
                  </select>
                  {formik.errors.nominal_tax_code_id &&
                    formik.touched.nominal_tax_code_id && (
                      <div className="invalid-feedback">
                        {formik.errors.nominal_tax_code_id}
                      </div>
                    )}
                </div>
              </Col>
              <Col lg={2} md={2}>
                <div className="text-end">
                  <button
                    className="btn btn-primary me-2"
                    type="submit"
                
                  >
                    Update
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        </form>    ))}
      </Modal.Body>
    </Modal>
  );
};

export default MapDepartmentItems;
