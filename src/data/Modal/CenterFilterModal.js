import { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import Loaderimg from "../../Utils/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Card, Col, Row, } from "react-bootstrap";
import { Dialog, DialogActions } from "@mui/material";
import { ErrorAlert, handleError } from "../../Utils/ToastUtils";
const CenterFilterModal = (props) => {
  const {
    visible,
    onClose,
    onSubmit,
    centerFilterModalOpen,
    setCenterFilterModalOpen,

  } = props;


  const [myclientID] = useState(localStorage.getItem("superiorId"));
  const [myClientRole] = useState(localStorage.getItem("superiorRole"));
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);



  const isNotClient = localStorage.getItem("superiorRole") !== "Client";

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handlesubmitvalues = (values) => {
    handleClose();
    onClose();
    onSubmit(values);
  };

  const handleClose = () => {
    setCenterFilterModalOpen(false);
  };


  const fetchCommonListData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/common/client-list");
      setIsLoading(true); // Set isLoading to true to indicate the loading state
      const { data } = response;
      if (data) {
        setClientList(response.data);
        const clientId = localStorage.getItem("superiorId");
        if (clientId) {
          setSelectedClientId(clientId);


        }
      }
      setIsLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      ErrorAlert(error);
      console.error("API error:", error);
      setIsLoading(false); // Set isLoading to false if there is an error
    }
  };

  const GetCompanyList = async (values) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`common/company-list?client_id=${values}`);
      setIsLoading(true); // Set isLoading to true to indicate the loading state
      if (response) {
        setCompanyList(response?.data?.data);
      }
      setIsLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
      setIsLoading(false); // Set isLoading to false if there is an error
    }
  };

  const GetSiteList = async (values) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`common/site-list?company_id=${values}`);
      setIsLoading(true); // Set isLoading to true to indicate the loading state
      if (response) {
        setSiteList(response?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
      setIsLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      ErrorAlert(error);
      console.error("API error:", error);
      setIsLoading(false); // Set isLoading to false if there is an error
    }
  };

  useEffect(() => {

    if (myClientRole !== "Client") {
      fetchCommonListData()
    } else {
      setTimeout(() => {
        GetCompanyList(myclientID)
        setSelectedClientId(myclientID);
      }, 500);
    }
    console.clear()
  }, [myclientID, myClientRole]);



  const formik = useFormik({
    initialValues: {
      client_id: "",
      client_name: "",
      company_id: "",
      company_name: "",
      site_id: "",
      site_name: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required(
        "Company is required"
      ),
      client_id: isNotClient
        ? Yup.string().required("Client is required")
        : Yup.mixed().notRequired(),
    }),

    onSubmit: (values) => {
      handlesubmitvalues(values);
    },
  });

  useEffect(() => {
    const mySearchData = JSON.parse(localStorage.getItem('mySearchData'));
    if (mySearchData) {
      formik.setFieldValue('client_id', mySearchData?.client_id);
      formik.setFieldValue('client_name', mySearchData?.client_name);
      formik.setFieldValue('company_id', mySearchData?.company_id);
      formik.setFieldValue('company_name', mySearchData?.company_name);
      formik.setFieldValue('site_id', mySearchData?.site_id);
      formik.setFieldValue('site_name', mySearchData?.site_name);


      GetCompanyList(mySearchData?.client_id);
      GetSiteList(mySearchData?.company_id)
    } else {
      formik.resetForm()
    }
  }, [centerFilterModalOpen]);



  return (
    <div>
      <Dialog
        open={centerFilterModalOpen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        className="ModalTitle"
      >
        <span
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
          className="ModalTitle"
        >
          <span>
            Filter
          </span>
          <span onClick={handleClose} >
            <button className="close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </span>
        </span>

        <>
          {isLoading ? <Loaderimg /> : null}
          <>
            <div
              className={`${visible ? "visible" : ""}`}
            >
              <form onSubmit={formik.handleSubmit}>
                <Card.Body>
                  <Row>
                    {localStorage.getItem("superiorRole") !== "Client" && (
                      <Col lg={12} md={12}>
                        <div className="form-group">
                          <label
                            htmlFor="client_id"
                            className="form-label mt-4"
                          >
                            Client
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.client_id &&
                              formik.touched.client_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="client_id"
                            name="client_id"
                            value={formik.values.client_id}
                            onChange={(e) => {
                              const selectedType = e.target.value;
                              if (selectedType) {
                                GetCompanyList(selectedType);
                                formik.setFieldValue("client_id", selectedType);

                                setSelectedClientId(selectedType);
                                setSiteList([]);
                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("site_id", "");
                                // setSelectedClientFullData(selectedType)

                                const selectedClient =
                                  ClientList?.data?.find(
                                    (client) =>
                                      client.id === selectedType
                                  );
                                if (selectedClient) {
                                  formik.setFieldValue("client_name", selectedClient?.client_name);
                                }
                              } else {
                                formik.setFieldValue("client_id", "");
                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("site_id", "");
                                setSiteList([]);
                                setCompanyList([]);
                              }
                            }}
                          >
                            <option value="">Select a Client</option>
                            {ClientList.data && ClientList.data.length > 0 ? (
                              ClientList.data.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.client_name}
                                </option>
                              ))
                            ) : (
                              <option disabled={true}>No Client</option>
                            )}
                          </select>

                          {formik.errors.client_id &&
                            formik.touched.client_id && (
                              <div className="invalid-feedback">
                                {formik.errors.client_id}
                              </div>
                            )}
                        </div>
                      </Col>
                    )}

                    <Col lg={6} md={6}>
                      <div className="form-group">
                        <label htmlFor="company_id" className="form-label mt-4">
                          Company
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`input101 ${formik.errors.company_id &&
                            formik.touched.company_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="company_id"
                          name="company_id"
                          value={formik.values.company_id}
                          onChange={(e) => {
                            const selectcompany = e.target.value;

                            if (selectcompany) {
                              GetSiteList(selectcompany);
                              formik.setFieldValue("site_id", "");
                              formik.setFieldValue("company_id", selectcompany);

                              const selectedCompanyData =
                                CompanyList?.find(
                                  (company) =>
                                    company?.id ===
                                    selectcompany
                                );
                              if (selectedCompanyData) {
                                formik.setFieldValue("company_name", selectedCompanyData?.company_name);
                                formik.setFieldValue("company_id", selectedCompanyData?.id);
                                // setSelectedCompanyFullData(selectedCompanyData)
                              }
                            } else {
                              formik.setFieldValue("company_id", "");
                              formik.setFieldValue("site_id", "");
                              setSiteList([]);
                            }
                          }}
                        >
                          <option value="">Select a Company</option>
                          {selectedClientId && CompanyList.length > 0 ? (
                            <>
                              {CompanyList.map((company) => (
                                <option key={company.id} value={company.id}>
                                  {company.company_name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <option disabled={true}>No Company</option>
                          )}
                        </select>
                        {formik.errors.company_id &&
                          formik.touched.company_id && (
                            <div className="invalid-feedback">
                              {formik.errors.company_id}
                            </div>
                          )}
                      </div>
                    </Col>

                    <Col lg={6} md={6}>
                      <div className="form-group">
                        <label htmlFor="site_id" className="form-label mt-4">
                          Site Name
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <select
                          className={`input101 ${formik.errors.site_id && formik.touched.site_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="site_id"
                          name="site_id"
                          value={formik.values.site_id}
                          onChange={(e) => {
                            const selectedsite_id = e.target.value;

                            formik.setFieldValue("site_id", selectedsite_id);

                            const selectedSiteData =
                              SiteList.find(
                                (site) =>
                                  site.id === selectedsite_id
                              );
                            if (selectedSiteData) {
                              formik.setFieldValue(
                                "site_name",
                                selectedSiteData.site_name
                              ); // Set site_name using setFieldValue
                            }
                          }}
                        >
                          <option value="">Select a Site</option>
                          {CompanyList && SiteList.length > 0 ? (
                            SiteList.map((site) => (
                              <option key={site.id} value={site.id}>
                                {site.site_name}
                              </option>
                            ))
                          ) : (
                            <option disabled={true}>No Site</option>
                          )}
                        </select>
                        {formik.errors.site_id && formik.touched.site_id && (
                          <div className="invalid-feedback">
                            {formik.errors.site_id}
                          </div>
                        )}
                      </div>
                    </Col>

                  </Row>
                </Card.Body>
                <hr />
                <DialogActions>
                  <button
                    className="btn btn-primary me-2"
                    type="submit"
                  >
                    Submit
                  </button>
                </DialogActions>
              </form>

            </div>
          </>
        </>
      </Dialog>
    </div >
  );
};

CenterFilterModal.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  // searchListstatus: PropTypes.bool.isRequired,
};

export default CenterFilterModal;
