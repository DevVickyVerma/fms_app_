import { useEffect, useState } from 'react';
import { Col, Row, Card, Breadcrumb } from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";

const AddSitePump = (props) => {
  const { isLoading, getData, postData } = props;
  const [selectedClientId, setSelectedClientId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);

  const handleSubmit1 = async (values) => {
    try {
      const tank = {
        site_id: values.site_id,
        client_id: values.client_id,
        company_id: values.company_id,
      };

      localStorage.setItem("SitePump", JSON.stringify(tank));
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("code", values.code);
      formData.append("status", values.status);
      formData.append("site_id", values.site_id);
      formData.append("client_id", values.client_id);
      formData.append("company_id", values.company_id);

      const postDataUrl = "/site-pump/add";

      const navigatePath = "/managesitepump";
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };




  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      status: "1",
      client_id: "",
      site_id: "",
      company_id: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
      site_id: Yup.string().required("Site is required"),
      name: Yup.string().required(" Site Pump Name is required"),

      code: Yup.string()
        .required("Site Pump Code is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "code must not contain special characters",
          excludeEmptyString: true,
        }),

      status: Yup.string().required(
        "Site Pump Status is required"
      ),
    }),

    onSubmit: (values) => {
      handleSubmit1(values);
    },
  });

  const fetchCommonListData = async () => {
    try {
      const response = await getData("/common/client-list");

      const { data } = response;
      if (data) {
        setClientList(response.data);

        const clientId = localStorage.getItem("superiorId");
        if (clientId) {
          setSelectedClientId(clientId);


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

          setCompanyList(response?.data?.data);
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

  const GetSiteList = async (values) => {
    try {
      if (values) {
        const response = await getData(`common/site-list?company_id=${values}`);

        if (response) {

          setSiteList(response?.data?.data);
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

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData()
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId)
    }
  }, []);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Site Pump</h1>

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
                  linkProps={{ to: "/managesitepump" }}
                >
                  Manage Site Pumps
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Add Site Pump
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Site Pump</Card.Title>
                </Card.Header>
                <Card.Body>
                  <form onSubmit={formik.handleSubmit}>
                    <Row>

                      {localStorage.getItem("superiorRole") !== "Client" && (
                        <Col lg={4} md={6}>
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

                      <Col lg={4} md={6}>
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

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="site_id" className="form-label mt-4">
                            Site Name
                            <span className="text-danger">*</span>
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


                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="name"
                          >
                            Site Pump Name
                            <span className="text-danger">*</span>
                          </label>

                          <input
                            type="text"
                            autoComplete="off"
                            // className="form-control"
                            className={`input101 ${formik.errors.name && formik.touched.name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="name"
                            name="name"
                            placeholder="Site Pump Name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                          />
                          {formik.errors.name &&
                            formik.touched.name && (
                              <div className="invalid-feedback">
                                {formik.errors.name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="code"
                          >
                            Site Pump Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.code && formik.touched.code
                              ? "is-invalid"
                              : ""
                              }`}
                            id="code"
                            name="code"
                            placeholder="Site Pump Code"
                            onChange={formik.handleChange}
                            value={formik.values.code}
                          />
                          {formik.errors.code &&
                            formik.touched.code && (
                              <div className="invalid-feedback">
                                {formik.errors.code}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label className="form-label mt-4" htmlFor="status">
                            Site Pump Status
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.status && formik.touched.status ? "is-invalid" : ""}`}
                            id="status"
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          {formik.errors.status && formik.touched.status && (
                            <div className="invalid-feedback">
                              {formik.errors.status}
                            </div>
                          )}
                        </div>
                      </Col>


                    </Row>
                    <Card.Footer className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to="/managesitepump"
                      >
                        Cancel
                      </Link>
                      <button className="btn btn-primary me-2" type="submit">
                        Add
                      </button>
                    </Card.Footer>
                  </form>
                </Card.Body>

              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(AddSitePump);
