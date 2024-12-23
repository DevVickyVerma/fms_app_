import { useEffect, useState } from "react";
import { Col, Row, Card, Breadcrumb } from "react-bootstrap";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import useErrorHandler from "../../CommonComponent/useErrorHandler";
import FormikSelect from "../../Formik/FormikSelect";
import FormikInput from "../../Formik/FormikInput";
import { ReactMultiEmail } from "react-multi-email";
import * as Yup from "yup";
import {
  activeInactiveOptions,
  AutomaticManualOptions,
  EVOBOSOptions,
  SalesSummary,
  StartEndDate,
  yesNoOptions,
} from "../../../Utils/commonFunctions/commonFunction";
import { useSelector } from "react-redux";
const AddSite = (props) => {
  const { isLoading, postData, getData } = props;

  const ReduxFullData = useSelector((state) => state?.data?.data);
  const { handleError } = useErrorHandler();
  const [AddSiteData, setAddSiteData] = useState([]);
  const [showToEmailError, setShowToEmailError] = useState(true);
  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
  const GetSiteData = async () => {
    try {
      const response = await getData("site/common-data-list");
      if (response.data) {
        setAddSiteData(response.data.data);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const AddSiteinitialValues = {
    site_code: "",
    site_name: "",
    clients: [],
    site_Address: "",
    site_status: "",
    bussiness_Type: "",
    data_import_type_id: "",
    supplier: "",
    DRS_Start_Date: "",
    display_name: "",
    Saga_department_code: "",
    Saga_department_name: "",
    Bp_nctt_site_no: "",
    bank_ref: "",
    site_report_status: "",
    site_report_date_type: "",
    consider_keyfules_cards: "",
    Fuel_commission_type: "",
    Paper_work_status: "",
    Bunkered_sale_status: "",
    Drs_upload_status: "",
    client_id: "",
    company_id: "",
    lottery_commission: "",
    instant_lottery_commission: "",
    e_code: "",
    paypoint_commission: "",
    cashback_enable: 0,
    shop_commission: 0,
    paidout: 0,
    apply_sc: 0,
    is_reconciled: 0,
    auto_dayend: 0,
    ignore_tolerance: 0,
    d_deduction: 1,
    display_all_sales: 1,
    security_amount: "",
    loomis_status: 0,
    cashback_status: 0,
    fuel_discount: 0,
    vat_summary: 0,
    include_bunkered_sales: 0,
    show_admin_sale: 0,
    send_auto_report: 0,
    consider_fuel_sales: 1,
    shop_sale_file_upload: 1,
    update_tlm_price: 0,
    manual_upload: 0,
    show_evobos_type: false,
    change_back_date_price: 0,
    to_emails: [],
    cc_emails: [],
    mobile: "",
  };
  const formik = useFormik({
    initialValues: AddSiteinitialValues,
    validationSchema: Yup.object({
      client_id: isNotClient
        ? Yup.string().required("Client is required")
        : Yup.mixed().notRequired(),
      site_code: Yup.string().required("Site Code is required"),
      e_code: Yup.string().required("Site ID is required"),
      site_name: Yup.string()
        .max(150, "Must be 150 characters or less")
        .required("Site Name is required"),
      site_Address: Yup.string().required("Site Address is required"),
      company_id: Yup.string().required("Company is required"),
      site_status: Yup.string().required("Site Status is required"),
      display_name: Yup.string().required("Display Name is required"),
      bussiness_Type: Yup.string().required("Business Type is required"),
      consider_keyfules_cards: Yup.string().required(
        "Consider Keyfules Cards is required"
      ),
      supplier: Yup.string().required("Supplier is required"),
      DRS_Start_Date: Yup.string().required("DRS Start Date is required"),
      data_import_type_id: Yup.string().required(
        "Data Import Types is required"
      ),
      Saga_department_code: Yup.string().required(
        "Sage Department Code is required"
      ),
      Saga_department_name: Yup.string().required(
        "Saga Department Name is required"
      ),
      Drs_upload_status: Yup.string().required("Drs Upload Status is required"),
      Bp_nctt_site_no: Yup.string().required("Bp Nctt Site No is required"),
      bank_ref: Yup.string().required("Bank Reference is required"),
      security_amount: Yup.string().required("Security Amount is required"),
      loomis_status: Yup.string().required("Loomis Status is required"),
      cashback_status: Yup.string().required("Cashback Status is required"),
      apply_sc: Yup.string().required("Apply Add Shop is required"),
      is_reconciled: Yup.string().required("Reconciled Data is required"),
      d_deduction: Yup.string().required("Deduct Deduction is required"),
      display_all_sales: Yup.string().required("Display All Sales is required"),
      cashback_enable: Yup.string().required("Cashback Enable is required"),
      // update_tlm_price: Yup.string().required("Update TLM Price is required"),
      // to_emails: Yup.array()
      //   .of(Yup.string().email("Invalid email format"))
      //   .min(1, "At least one email is required"),
    }),
    onSubmit: (values) => {
      handleSubmit1(values);
    },
  });

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();

      if (localStorage.getItem("superiorRole") === "Client") {
        formData.append("client_id", ReduxFullData?.superiorId);
      } else {
        formData.append("client_id", values.client_id);
      }

      formData.append("business_type_id", values.bussiness_Type);
      formData.append("data_import_type_id", values.data_import_type_id);
      formData.append("site_code", values.site_code);
      formData.append("site_name", values.site_name);
      formData.append("site_display_name", values.display_name);
      formData.append("site_address", values.site_Address);
      formData.append("start_date", values.DRS_Start_Date);
      formData.append("department_sage_code", values.Saga_department_name);
      formData.append("bp_credit_card_site_no", values.Bp_nctt_site_no);
      formData.append("bank_ref", values.bank_ref);
      formData.append("supplier_id", values.supplier);
      formData.append("site_report_status", values.site_report_status);
      formData.append("site_report_date_type", values.site_report_date_type);
      formData.append(
        "consider_keyfules_cards",
        values.consider_keyfules_cards
      );
      formData.append("sage_department_id", values.Saga_department_code);
      formData.append("drs_upload_status", values.Drs_upload_status);
      formData.append("site_status", values.site_status);
      formData.append("security_amount", values.security_amount);
      formData.append("bunker_upload_status", values.Bunkered_sale_status);
      formData.append(
        "fuel_commission_calc_status",
        values.Fuel_commission_type
      );
      formData.append("manual_upload", values.manual_upload);
      formData.append("paperwork_status", values.Paper_work_status);
      formData.append("company_id", values.company_id);
      formData.append("lottery_commission", 0);
      formData.append("paypoint_commission", values.paypoint_commission);
      formData.append(
        "instant_lottery_commission",
        values.instant_lottery_commission
      );
      formData.append("shop_commission", 0);
      formData.append("paidout", values.paidout);
      formData.append("apply_sc", values.apply_sc);
      formData.append("loomis_status", values.loomis_status);
      formData.append("cashback_status", values.cashback_status);
      formData.append("auto_dayend", values.auto_dayend);
      formData.append("ignore_tolerance", values.ignore_tolerance);
      formData.append("d_deduction", values.d_deduction);
      formData.append("display_all_sales", values.display_all_sales);
      formData.append("is_reconciled", values.is_reconciled);
      formData.append("fuel_discount", values.fuel_discount);
      formData.append("vat_summary", values.vat_summary);
      formData.append("include_bunkered_sales", values.include_bunkered_sales);
      formData.append("show_admin_sale", values.show_admin_sale);
      formData.append("send_auto_report", values.send_auto_report);
      formData.append("consider_fuel_sales", values.consider_fuel_sales);
      formData.append("shop_sale_file_upload", values.shop_sale_file_upload);
      formData.append("update_tlm_price", values.update_tlm_price);
      formData.append("change_back_date_price", values.change_back_date_price);
      formData.append("cashback_enable", values.cashback_enable);
      formData.append("e_code", values.e_code);

      if (values?.to_emails && values?.to_emails.length > 0) {
        values?.to_emails.forEach((client, index) => {
          formData.append(`to_emails[${index}]`, client);
        });
      } else {
        formData.append(`to_emails`, []);
      }

      if (values?.cc_emails && values?.cc_emails.length > 0) {
        values?.cc_emails.forEach((client, index) => {
          formData.append(`cc_emails[${index}]`, client);
        });
      } else {
        formData.append(`cc_emails`, []);
      }

      const postDataUrl = "/site/add";

      const navigatePath = "/sites";
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };

  const fetchCommonListData = async () => {
    try {
      const response = await getData("/common/client-list");

      const { data } = response;

      if (response?.data?.data) {
        formik.setFieldValue("clients", response?.data?.data);
      }
      if (data) {
        const clientId = localStorage.getItem("superiorId");
        if (clientId) {
          if (response?.data) {
            const selectedClient = response?.data?.data?.find(
              (client) => client.id === clientId
            );
            if (selectedClient) {
            }
          }
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const GetCompanyList = async (values) => {
    try {
      if (values) {
        const response = await getData(
          `common/company-list?client_id=${values}`
        );

        if (response) {
          formik.setFieldValue("companies", response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    formik.setFieldValue("client_id", clientId);

    if (clientId) {
      GetCompanyList(clientId);

      const selectedClient = formik.values.clients.find(
        (client) => client?.id === clientId
      );
      formik.setFieldValue("client_name", selectedClient?.client_name || "");
      formik.setFieldValue("companies", selectedClient?.companies || []);
      formik.setFieldValue("company_id", "");
    } else {
      formik.setFieldValue("client_name", "");
      formik.setFieldValue("companies", []);
      formik.setFieldValue("company_id", "");
    }
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    formik.setFieldValue("company_id", companyId);

    if (companyId) {
      const selectedCompany = formik.values.companies.find(
        (company) => company?.id === companyId
      );
      formik.setFieldValue("company_name", selectedCompany?.company_name || "");
    } else {
      formik.setFieldValue("company_name", "");
    }
  };
  let storedKeyName = "localFilterModalData";

  useEffect(() => {
    const storedDataString = localStorage.getItem(storedKeyName);
    GetSiteData();
    if (storedDataString) {
      const parsedData = JSON.parse(storedDataString);
      // formik.setValues(parsedData);

      if (!parsedData?.report) {
        formik?.setFieldValue("report", "");
      }
      if (!parsedData?.selectedSites) {
        formik?.setFieldValue("selectedSites", []);
      }

      if (parsedData?.client_id) {
        GetCompanyList(parsedData?.client_id);
      }
    }

    if (
      !storedDataString &&
      localStorage.getItem("superiorRole") === "Client"
    ) {
      const clientId = localStorage.getItem("superiorId");
      if (clientId) {
        handleClientChange({ target: { value: clientId } });
      }
    }
    if (
      !storedDataString &&
      localStorage.getItem("superiorRole") !== "Client"
    ) {
      fetchCommonListData();
    }
  }, []);

  const handleTLMPriceChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue("update_tlm_price", value); // Update the field value

    if (value === "0") {
      // Clear the values of cc_emails, to_emails, and mobile when "No" is selected
      formik.setFieldValue("cc_emails", []);
      formik.setFieldValue("to_emails", []);
      formik.setFieldValue("mobile", "");
      setShowToEmailError(false);
    } else {
      setShowToEmailError(true);
    }
  };

  const handleToEmailChange = (newEmails) => {
    // Update Formik state when email input changes
    formik.setFieldValue("to_emails", newEmails);
  };

  const renderToEmailTag = (email, index, removeEmail) => (
    <div key={index} className="renderEmailTag">
      {email}
      <span className="closeicon" onClick={() => removeEmail(index)}>
        ×
      </span>
    </div>
  );
  const handleCCEmailChange = (newEmails) => {
    // Update Formik state when email input changes
    formik.setFieldValue("cc_emails", newEmails);
  };
  const renderCCEmailTag = (email, index, removeEmail) => (
    <div key={index} className="renderEmailTag">
      {email}
      <span className="closeicon" onClick={() => removeEmail(index)}>
        ×
      </span>
    </div>
  );


  return (
    <>
      {isLoading ? (
        <Loaderimg />
      ) : (
        <>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Site</h1>

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
                  Manage Sites
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Add Site
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Site</Card.Title>
                </Card.Header>
                <Card.Body>
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      {localStorage.getItem("superiorRole") !== "Client" && (
                        <Col lg={4} md={6}>
                          <FormikSelect
                            formik={formik}
                            name="client_id"
                            label="Client"
                            options={formik?.values?.clients?.map((item) => ({
                              id: item?.id,
                              name: item?.full_name,
                            }))}
                            className="form-input "
                            onChange={handleClientChange}
                          />
                        </Col>
                      )}

                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="company_id"
                          label="Company"
                          options={formik?.values?.companies?.map((item) => ({
                            id: item?.id,
                            name: item?.company_name,
                          }))}
                          className="form-input"
                          onChange={handleCompanyChange}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="supplier"
                          label="supplier"
                          options={AddSiteData?.suppliers?.map((item) => ({
                            id: item?.id,
                            name: item?.supplier_name,
                          }))}
                          className="form-input"
                        // onChange={handleCompanyChange}
                        />
                      </Col>
                      <Col lg={4}>
                        <FormikInput
                          formik={formik}
                          type="text"
                          name="site_code"
                        />
                      </Col>
                      <Col lg={4}>
                        <FormikInput
                          formik={formik}
                          type="text"
                          name="site_name"
                        />
                      </Col>
                      <Col lg={4}>
                        <FormikInput
                          formik={formik}
                          type="text"
                          label="Site Id"
                          name="e_code"
                        />
                      </Col>
                      <Col lg={4}>
                        <FormikInput
                          formik={formik}
                          type="text"
                          name="display_name"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="site_status"
                          label="Site Status"
                          options={AddSiteData.site_status?.map((item) => ({
                            id: item?.value,
                            name: item?.name,
                          }))}
                          className="form-input"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="bussiness_Type"
                          label="Bussiness Type"
                          options={AddSiteData.busines_types?.map((item) => ({
                            id: item?.id,
                            name: item?.name,
                          }))}
                          className="form-input"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikInput
                          formik={formik}
                          type="number"
                          label="Saga Department Code"
                          name="Saga_department_code"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikInput
                          formik={formik}
                          type="text"
                          label="Saga Department Name"
                          name="Saga_department_name"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikInput
                          formik={formik}
                          type="number"
                          label="Bp_nctt_site_no"
                          name="Bp_nctt_site_no"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikInput
                          formik={formik}
                          type="text"
                          label="bank_ref"
                          name="bank_ref"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikInput
                          formik={formik}
                          min={"2023-01-01"}
                          type="date"
                          label="DRS_Start_Date"
                          name="DRS_Start_Date"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="site_report_status"
                          label="Report Generation Status"
                          options={activeInactiveOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="site_report_date_type"
                          label="site_report_date_type"
                          options={StartEndDate?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="consider_keyfules_cards"
                          label="consider_keyfules_cards"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="Fuel_commission_type"
                          label="Fuel_commission_type"
                          options={activeInactiveOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="Paper_work_status"
                          label="Paper_work_status"
                          options={activeInactiveOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="Bunkered_sale_status"
                          label="Bunkered_sale_status"
                          options={activeInactiveOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="Drs_upload_status"
                          label="Drs_upload_status"
                          options={AutomaticManualOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikInput
                          formik={formik}
                          type="textarea"
                          label="site_Address"
                          name="site_Address"
                        />
                      </Col>

                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="data_import_type_id"
                          label="Select Data Import Types"
                          options={AddSiteData.data_import_types?.map(
                            (item) => ({
                              id: item?.id,
                              name: item?.import_type_name,
                            })
                          )}
                          onChange={(e) => {
                            const selectedId = e.target.value;

                            // Find the selected import type from AddSiteData
                            const selectedImportType =
                              AddSiteData?.data_import_types?.find(
                                (item) => item.id === selectedId
                              );

                            // Update the formik value for 'data_import_type_id'
                            formik.setFieldValue(
                              "data_import_type_id",
                              selectedId
                            );

                            // Check if the selected type is EVOBOS
                            if (
                              selectedImportType?.import_type_code === "EVOBOS"
                            ) {
                              // Add the 'show_evobos_type' field to formik if EVOBOS is selected
                              formik.setFieldValue("show_evobos_type", true); // Default to
                              formik.setFieldValue("manual_upload", 0); // Default to
                            } else {
                              // Reset 'show_evobos_type' if it's not EVOBOS
                              formik.setFieldValue("show_evobos_type", false);
                              formik.setFieldValue("manual_upload", 0); // Default to
                            }
                          }}
                          className="form-input"
                        />
                      </Col>

                      {formik?.values?.show_evobos_type && (
                        <>
                          <Col lg={4} md={6}>
                            <FormikSelect
                              formik={formik}
                              name="manual_upload"
                              label="EVOBOS Type"
                              options={EVOBOSOptions?.map((item) => ({
                                id: item?.value,
                                name: item?.label,
                              }))}
                              className="form-input"
                              isHideDefaultSelectOption={true}
                            />
                          </Col>
                        </>
                      )}

                      <Col lg={4} md={6}>
                        <FormikInput
                          formik={formik}
                          type="number"
                          label="security_amount"
                          name="security_amount"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikInput
                          formik={formik}
                          type="number"
                          label="shop_commission"
                          name="shop_commission"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikInput
                          formik={formik}
                          type="number"
                          label="lottery_commission"
                          name="lottery_commission"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikInput
                          formik={formik}
                          type="number"
                          label="instant_lottery_commission"
                          name="instant_lottery_commission"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikInput
                          formik={formik}
                          type="number"
                          label="paypoint_commission"
                          name="paypoint_commission"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="apply_sc"
                          label="apply_sc"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="is_reconciled"
                          label="is_reconciled"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="paidout"
                          label="paidout"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="loomis_status"
                          label="loomis_status"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="cashback_status"
                          label="cashback_status"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="auto_dayend"
                          label="auto_dayend"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="ignore_tolerance"
                          label="ignore_tolerance"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="d_deduction"
                          label="d_deduction"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="display_all_sales"
                          label="display_all_sales"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="fuel_discount"
                          label="fuel_discount"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="vat_summary"
                          label="vat_summary"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="include_bunkered_sales"
                          label="include_bunkered_sales"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="show_admin_sale"
                          label="Select Show Owner Shop Sales(in CLDO)"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="send_auto_report"
                          label="send_auto_report"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="cashback_enable"
                          label="cashback_enable"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="consider_fuel_sales"
                          label="consider_fuel_sales"
                          options={SalesSummary?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="shop_sale_file_upload"
                          label="shop_sale_file_upload"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="change_back_date_price"
                          label="Update Previous Date Price"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          isRequired={false}
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <FormikSelect
                          formik={formik}
                          name="update_tlm_price"
                          label="update_tlm_price"
                          options={yesNoOptions?.map((item) => ({
                            id: item?.value,
                            name: item?.label,
                          }))}
                          className="form-input"
                          onChange={handleTLMPriceChange}
                          isRequired={false}
                        />
                      </Col>

                      {formik.values.update_tlm_price == "1" && (
                        <>
                          <Col lg={4} md={6}>
                            <FormikInput
                              formik={formik}
                              isRequired={false}
                              type="number"
                              label="Mobile"
                              name="mobile"
                            />
                          </Col>

                          <Col lg={4} md={6}>
                            <label htmlFor="to_emails">To Email</label>
                            <div className="email-input">
                              <ReactMultiEmail
                                emails={formik.values?.to_emails}
                                onChange={handleToEmailChange}
                                getLabel={renderToEmailTag}
                                minTags={1}
                                onBlur={() =>
                                  formik.setFieldTouched("to_emails", true)
                                }
                              />
                            </div>
                            {formik.touched.to_emails &&
                              formik.errors.to_emails ? (
                              <div className="error invalid-feedback">
                                {formik.errors.to_emails}
                              </div>
                            ) : null}
                            <span className="fairbank-title">
                              {" "}
                              * You can add multiple email IDs by using{" "}
                              <strong>,</strong>
                            </span>
                          </Col>

                          <Col lg={4} md={6}>
                            <label htmlFor="cc_emails">CC Email</label>
                            <div className="email-input">
                              <ReactMultiEmail
                                emails={formik.values?.cc_emails}
                                onChange={handleCCEmailChange}
                                getLabel={renderCCEmailTag}
                                minTags={1}
                                onBlur={() =>
                                  formik.setFieldTouched("cc_emails", true)
                                }
                              />
                              {formik.touched.cc_emails &&
                                formik.errors.cc_emails ? (
                                <div className="error">
                                  {formik.errors.cc_emails}
                                </div>
                              ) : null}
                            </div>
                            <span className="fairbank-title">
                              {" "}
                              * You can add multiple email IDs by using{" "}
                              <strong>,</strong>
                            </span>
                          </Col>
                        </>
                      )}
                    </Row>
                    <Card.Footer className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/sites/`}
                      >
                        Cancel
                      </Link>

                      <button
                        type="submit"
                        className="btn btn-primary me-2 "
                      // disabled={Object.keys(errors).length > 0}
                      >
                        Save
                      </button>
                    </Card.Footer>
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
export default withApi(AddSite);
