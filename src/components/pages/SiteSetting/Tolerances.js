import { useEffect, useState } from 'react';

import {
  Col,
  Row,
  Card,
  Breadcrumb,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import FormikSelect from "../../Formik/FormikSelect";
import { useMyContext } from "../../../Utils/MyContext";
import { handleFilterData } from "../../../Utils/commonFunctions/commonFunction";
import useErrorHandler from '../../CommonComponent/useErrorHandler';

const SiteSettings = (props) => {
  const { contextClients, setcontextClients } = useMyContext();
  const ReduxFullData = useSelector((state) => state?.data?.data);
  const { isLoading, getData, postData } = props;
  const [permissionsArray, setPermissionsArray] = useState([]);
  const { handleError } = useErrorHandler();
  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const isEditPermissionAvailable = permissionsArray?.includes("tolerance-update");




  const FetchFilterData = async (filters) => {
    let { client_id, company_id, site_id, client_name, company_name } = filters;

    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = ReduxFullData?.superiorId;
      client_name = ReduxFullData?.full_name;
    }

    if (ReduxFullData?.company_id && !company_id) {
      company_id = ReduxFullData?.company_id;
      company_name = ReduxFullData?.company_name;
    }

    const updatedFilters = {
      ...filters,
      client_id,
      client_name,
      company_id,
      company_name,
    };


    if (client_id) {
      try {
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append("client_id", client_id);
        if (company_id) queryParams.append("company_id", company_id);
        if (site_id) queryParams.append("site_id", site_id);

        const queryString = queryParams.toString();
        const response = await getData(`tolerance/?${queryString}`);
        if (response && response.data && response.data.data) {
          formik.setValues((prevValues) => ({
            ...prevValues, // Keep existing form values
            ...response.data.data,  // Add/overwrite new data from the API response
          }));
        }
        localStorage.setItem(storedKeyName, JSON.stringify(updatedFilters));
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
  }, []);



  const handleApplyFilters = ((values) => {
    if (!values?.start_date) {
      // If start_date does not exist, set it to the current date
      const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
      values.start_date = currentDate;
      // Update the stored data with the new start_date
      localStorage.setItem(storedKeyName, JSON.stringify(values));
    }
    if (values?.site_id) {
      FetchFilterData(values);
    }
  });

  const handleSubmit = async (values) => {


    try {
      const formData = new FormData();

      formData.append("max_dip_gain_loss_variance", values.max_dip_gain_loss_variance);
      formData.append("max_banking_variance", values.max_banking_variance);
      formData.append("max_fuel_inv_sale_variance", values.max_fuel_inv_sale_variance);
      formData.append("max_bunkering_variance", values.max_bunkering_variance);
      formData.append("low_tank_limit", values.low_tank_limit);
      formData.append("client_id", values?.client_id);
      formData.append("company_id", values?.company_id);
      formData.append("site_id", values?.site_id);
      formData.append("max_dip_gain_loss_variance_lt", "0");
      // formData.append("vat_rate", values.vat_rate);
      // formData.append("average_ppl", values.average_ppl);

      const postDataUrl = "tolerance/update";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      max_dip_gain_loss_variance: "",
      max_banking_variance: "",
      max_fuel_inv_sale_variance: "",
      max_bunkering_variance: "",
      low_tank_limit: "",
      vat_rate: "",
      average_ppl: "",
      client_id: "",
      client_name: "",
      company_id: "",
      company_name: "",
      start_month: "",
      site_id: "",
      site_name: "",
      clients: [],
      companies: [],
      sites: [],
    },
    validationSchema: Yup.object({
      max_dip_gain_loss_variance: Yup.string()

        .required("Max Dips Gians/Loss Variance is required"),
      max_banking_variance: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required(" Max Banking Variance is required"),
      max_bunkering_variance: Yup.string().required(
        "Bunkring Tolerance is required"
      ),
      low_tank_limit: Yup.string().required("Low Tank Limit is required"),

      max_fuel_inv_sale_variance: Yup.string().required("Max Fuel is required"),
      // vat_rate: Yup.string().required("Vat Rate is required"),
      // average_ppl: Yup.string().required("Use Avg Ppl is required"),
    }),
    onSubmit: handleSubmit,
  });


  useEffect(() => {
    if (contextClients?.length === 0) {
      fetchClientList();
    } else if (contextClients?.length > 0) {
      formik.setFieldValue('clients', contextClients || []);
    }
  }, [contextClients, formik?.values?.clients]);


  const fetchClientList = async () => {
    try {
      const response = await getData('/common/client-list');
      const clients = response?.data?.data;
      setcontextClients(clients);
      formik.setFieldValue('clients', clients);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchCompanyList = async (clientId) => {
    try {
      const response = await getData(`common/company-list?client_id=${clientId}`);
      formik.setFieldValue('companies', response?.data?.data);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchSiteList = async (companyId) => {
    try {
      const response = await getData(`common/site-list?company_id=${companyId}`);
      formik.setFieldValue('sites', response?.data?.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    formik.setFieldValue('client_id', clientId);

    if (clientId) {
      fetchCompanyList(clientId);
      const selectedClient = formik.values.clients.find(client => client?.id === clientId);
      formik.setFieldValue('client_name', selectedClient?.client_name || "");
      formik.setFieldValue('companies', selectedClient?.companies || []);
      formik.setFieldValue('sites', []);
      formik.setFieldValue('company_id', "");
      formik.setFieldValue('site_id', "");
    } else {
      formik.setFieldValue('client_name', "");
      formik.setFieldValue('companies', []);
      formik.setFieldValue('sites', []);
      formik.setFieldValue('company_id', "");
      formik.setFieldValue('site_id', "");
    }
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    formik.setFieldValue('company_id', companyId);

    if (companyId) {
      fetchSiteList(companyId);
      formik.setFieldValue('site_id', "");
      const selectedCompany = formik?.values?.companies?.find(company => company?.id === companyId);
      formik.setFieldValue('company_name', selectedCompany?.company_name || "");
    } else {
      formik.setFieldValue('company_name', "");
      formik.setFieldValue('sites', []);
      formik.setFieldValue('site_id', "");
      formik.setFieldValue('site_name', "");
    }
  };

  const handleSiteChange = (e) => {
    const selectedSiteId = e.target.value;
    formik.setFieldValue("site_id", selectedSiteId);
    const selectedSiteData = formik?.values?.sites?.find(site => site?.id === selectedSiteId);
    formik.setFieldValue('site_name', selectedSiteData?.site_name || "");



    // Create the updated filters with the new site_id
    const updatedFilters = {
      ...formik?.values,
      site_id: selectedSiteId,  // Ensure the new site_id is included in the updated filters
      site_name: selectedSiteData?.site_name,
    };

    if (selectedSiteId) {
      FetchFilterData(updatedFilters)
    }
  };


  let storedKeyName = "localFilterModalData";

  useEffect(() => {
    const storedDataString = localStorage.getItem(storedKeyName);

    if (storedDataString) {
      const parsedData = JSON.parse(storedDataString);
      formik.setValues(parsedData);

      if (!parsedData?.selectedSites) {
        formik?.setFieldValue("selectedSites", [])
      }

      if (parsedData?.client_id) {
        fetchCompanyList(parsedData?.client_id);
      }

      if (parsedData?.company_id) {
        fetchSiteList(parsedData?.company_id);
      }
    }

    if (!storedDataString && localStorage.getItem("superiorRole") === "Client") {
      const clientId = localStorage.getItem("superiorId");
      if (clientId) {
        handleClientChange({ target: { value: clientId } });
      }
    }

  }, []);



  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Tolerances</h1>

            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item  breadcrumds"
                aria-current="page"
                linkAs={Link}
                linkProps={{ to: "/sites" }}
              >
                Tolerances
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Tolerances</Card.Title>
              </Card.Header>

              <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                  <Row>


                    {localStorage.getItem('superiorRole') !== 'Client' && (
                      <Col lg={4} md={6} className=" mt-4">
                        <FormikSelect
                          formik={formik}
                          name="client_id"
                          label="Client"
                          options={formik?.values?.clients?.map((item) => ({ id: item?.id, name: item?.full_name }))}
                          className="form-input "
                          onChange={handleClientChange}
                        />
                      </Col>
                    )}


                    <Col lg={4} md={6} className=" mt-4">
                      <FormikSelect
                        formik={formik}
                        name="company_id"
                        label="Company"
                        options={formik?.values?.companies?.map((item) => ({ id: item?.id, name: item?.company_name }))}
                        className="form-input"
                        onChange={handleCompanyChange}
                      />
                    </Col>

                    <Col lg={4} md={6} className=" mt-4">
                      <FormikSelect
                        formik={formik}
                        name="site_id"
                        label="Site"
                        options={formik?.values?.sites?.map((item) => ({ id: item?.id, name: item?.site_name }))}
                        className="form-input"
                        onChange={handleSiteChange}
                      />
                    </Col>


                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          className="form-label mt-4"
                          htmlFor="max_banking_variance"
                        >
                          Max Banking Variance
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${formik.errors.max_banking_variance &&
                            formik.touched.max_banking_variance
                            ? "is-invalid"
                            : ""
                            }`}
                          id="max_banking_variance"
                          name="max_banking_variance"
                          placeholder=" Max Banking Variance"
                          onChange={formik.handleChange}
                          value={formik.values.max_banking_variance}
                        />
                        {formik.errors.max_banking_variance &&
                          formik.touched.max_banking_variance && (
                            <div className="invalid-feedback">
                              {formik.errors.max_banking_variance}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          className="form-label mt-4"
                          htmlFor="max_dip_gain_loss_variance"
                        >
                          Max Dips Gians/Loss Variance
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          id="max_dip_gain_loss_variance"
                          name="max_dip_gain_loss_variance"
                          type="number"
                          autoComplete="off"
                          className={`input101 ${formik.errors.max_dip_gain_loss_variance &&
                            formik.touched.max_dip_gain_loss_variance
                            ? "is-invalid"
                            : ""
                            }`}
                          placeholder=" Max Dips Gians/Loss Variance"
                          onChange={formik.handleChange}
                          value={formik.values.max_dip_gain_loss_variance}
                        />
                        {formik.errors.max_dip_gain_loss_variance &&
                          formik.touched.max_dip_gain_loss_variance && (
                            <div className="invalid-feedback">
                              {formik.errors.max_dip_gain_loss_variance}
                            </div>
                          )}
                      </div>
                    </Col>

                    <Col lg={4} md={6}>
                      <label
                        htmlFor="max_fuel_inv_sale_variance"
                        className="form-label mt-4"
                      >
                        Max Fuel Inventory/Sales Variance
                      </label>
                      <input
                        type="number"
                        autoComplete="off"
                        className={`input101 ${formik.errors.max_fuel_inv_sale_variance &&
                          formik.touched.max_fuel_inv_sale_variance
                          ? "is-invalid"
                          : ""
                          }`}
                        id="max_fuel_inv_sale_variance"
                        name="max_fuel_inv_sale_variance"
                        placeholder="  Max Fuel Inventory/Sales Variance"
                        onChange={formik.handleChange}
                        value={formik.values.max_fuel_inv_sale_variance}
                      />
                      {formik.errors.max_fuel_inv_sale_variance &&
                        formik.touched.max_fuel_inv_sale_variance && (
                          <div className="invalid-feedback">
                            {formik.errors.max_fuel_inv_sale_variance}
                          </div>
                        )}
                    </Col>

                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="low_tank_limit"
                          className="form-label mt-4"
                        >
                          Low Tank Limit
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${formik.errors.low_tank_limit &&
                            formik.touched.low_tank_limit
                            ? "is-invalid"
                            : ""
                            }`}
                          id="low_tank_limit"
                          name="low_tank_limit"
                          placeholder="Low Tank Limit"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.low_tank_limit}
                        />
                        {formik.errors.low_tank_limit &&
                          formik.touched.low_tank_limit && (
                            <div className="invalid-feedback">
                              {formik.errors.low_tank_limit}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="max_bunkering_variance"
                          className="form-label mt-4"
                        >
                          Bunkering Tolerance
                          <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex">
                          <input
                            type="number"
                            autoComplete="off"
                            className={`input101 ${formik.errors.max_bunkering_variance &&
                              formik.touched.max_bunkering_variance
                              ? "is-invalid"
                              : ""
                              }`}
                            id="max_bunkering_variance"
                            name="max_bunkering_variance"
                            placeholder="Bunkering Tolerance"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.max_bunkering_variance}
                          />
                        </div>

                        {formik.errors.max_bunkering_variance &&
                          formik.touched.max_bunkering_variance && (
                            <div className="invalid-feedback">
                              {formik.errors.max_bunkering_variance}
                            </div>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <div className="text-end">

                    {isEditPermissionAvailable ? (

                      <>
                        <Link
                          type="sussbmit"
                          className="btn btn-danger me-2 "
                          to={`/sites/`}
                        >
                          Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>

                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </form>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default withApi(SiteSettings);
