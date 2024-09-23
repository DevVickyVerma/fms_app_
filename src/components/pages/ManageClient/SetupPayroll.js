import { useEffect, useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import Loaderimg from "../../../Utils/Loader";
import { handleError } from "../../../Utils/ToastUtils";

const validationSchema = Yup.object().shape({
  tree1: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required("ID is required"),
      text: Yup.string().required("Text is required"),
      checked: Yup.boolean(),
      children: Yup.array().of(
        Yup.object().shape({
          id: Yup.string().required("ID is required"),
          text: Yup.string().required("Text is required"),
          checked: Yup.boolean(),
        })
      ),
    })
  ),
  tree2: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required("ID is required"),
      text: Yup.string().required("Text is required"),
      checked: Yup.boolean(),
      children: Yup.array().of(
        Yup.object().shape({
          id: Yup.string().required("ID is required"),
          text: Yup.string().required("Text is required"),
          checked: Yup.boolean(),
        })
      ),
    })
  ),
});
const initialValues = {
  tree1: [],
  tree2: [],
};

const TreeForm = (props) => {
  const { isLoading, getData, postData } = props;
  const [tree1, setCompanyList] = useState([]);
  const [data, setData] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    try {
      GetSiteData();
    } catch (error) {
      handleError(error);
    }
  }, [id]);

  const GetSiteData = async () => {
    try {
      const response = await getData(`/payroll/setup/${id}`);

      if (response) {
        setCompanyList(response?.data?.data);
        setData(response?.data?.data);
        formik.setFieldValue("tree1", response?.data?.data?.companies);
        formik.setFieldValue("tree2", response?.data?.data?.roles);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(formik.values);
    },
  });
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Initialize counters
      let companyIndex = 0;
      let siteIndex = 0;
      let roleIndex = 0;
      let userIndex = 0;

      // Process tree1
      if (values.tree1 && values.tree1.length > 0) {
        values.tree1.forEach((company) => {
          if (company.checked) {
            // Append company_id
            formData.append(`company_id[${companyIndex}]`, company.id);

            // Process children of the company
            if (company.children && company.children.length > 0) {
              company.children.forEach((child) => {
                if (child.checked) {
                  // Append site_id
                  formData.append(`site_id[${siteIndex}]`, child.id);
                  siteIndex++;
                }
              });
            }
            companyIndex++;
          }
        });
      }

      // Process tree2
      if (values.tree2 && values.tree2.length > 0) {
        values.tree2.forEach((company) => {
          if (company.checked) {
            // Append roles
            formData.append(`roles[${roleIndex}]`, company.id);

            // Process children of the company
            if (company.children && company.children.length > 0) {
              company.children.forEach((child) => {
                if (child.checked) {
                  // Append users
                  formData.append(`users[${userIndex}]`, child.id);
                  userIndex++;
                }
              });
            }
            roleIndex++;
          }
        });
      }

      // Append client_id
      formData.append("client_id", id);

      // Example: Log form data before submitting
      for (const pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      // Perform the API call
      const postDataUrl = "/payroll/save-setup";
      const navigatePath = `/clients`;
      await postData(postDataUrl, formData, navigatePath);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleParentCheckboxChange = (index, treeKey) => {
    const newTree = [...formik.values[treeKey]];
    newTree[index] = {
      ...newTree[index],
      checked: !newTree[index].checked,
      children: newTree[index].children.map((child) => ({
        ...child,
        checked: child.hasOwnProperty("isCheckable")
          ? child.isCheckable
            ? !newTree[index].checked
            : child.checked
          : true,
      })),
    };

    formik.setFieldValue(treeKey, newTree);

    if (newTree[id].checked) {
      setOpenDropdownId((prevId) => (prevId === id ? null : id));
    }

  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={12}>
              <Card>
                <Card.Header>Setup Payroll - {data?.text}</Card.Header>
                <Card.Body>
                  {tree1?.companies?.length > 0 ? (
                    <Row>
                      <Col lg={6} xl={6}>
                        <Card>
                          <Card.Header>Company</Card.Header>
                          <Card.Body>
                            <ul className="Ul-parentsiteList">
                              {formik.values.tree1?.map((node, index) => (
                                <li
                                  key={index}
                                  className="Ul-parentsiteList-childlist"
                                >
                                  <label>
                                    <input
                                      type="checkbox"
                                      name={`tree1[${index}].checked`}
                                      checked={node.checked}
                                      onChange={() =>
                                        handleParentCheckboxChange(
                                          index,
                                          "tree1"
                                        )
                                      }
                                      className="form-check-input mb-2"
                                      style={{ marginLeft: "10px" }}
                                    />
                                    <span className="tree-label">
                                      {node.text}
                                    </span>
                                  </label>
                                  {node.children &&
                                    node.children.length > 0 && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => toggleDropdown(node.id)}
                                          style={{ float: "right" }}
                                        >
                                          {openDropdownId === node.id ? (
                                            <span>
                                              <i
                                                className="fa fa-chevron-up"
                                                aria-hidden="true"
                                                style={{ color: "#fff" }}
                                              ></i>
                                            </span>
                                          ) : (
                                            <span>
                                              <i
                                                className="fa fa-chevron-down"
                                                aria-hidden="true"
                                                style={{ color: "#fff" }}
                                              ></i>
                                            </span>
                                          )}
                                        </button>
                                        {openDropdownId === node.id && (
                                          <ul
                                            style={{
                                              background: "#fff",
                                              color: "#000",
                                            }}
                                            className="Ul-childsiteList p-2"
                                          >
                                            {node.children.map(
                                              (child, childIndex) => (
                                                <li
                                                  key={childIndex}
                                                  className={`ms-2 ${!child.isCheckable
                                                    ? "disabled-checkbox"
                                                    : ""
                                                    }`}
                                                >
                                                  <label className="ms-2">
                                                    <input
                                                      type="checkbox"
                                                      name={`tree1[${index}].children[${childIndex}].checked`}
                                                      checked={child.checked}
                                                      onChange={
                                                        formik.handleChange
                                                      }
                                                      className="form-check-input mb-2"
                                                      style={{
                                                        marginLeft: "10px",
                                                      }}
                                                      disabled={
                                                        !child.isCheckable
                                                      }
                                                    />
                                                    <span className="tree-label">
                                                      {child.text}
                                                    </span>
                                                  </label>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        )}
                                      </>
                                    )}
                                </li>
                              ))}
                            </ul>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col lg={6} xl={6}>
                        <Card>
                          <Card.Header>Roles</Card.Header>
                          <Card.Body>
                            <ul className="Ul-parentsiteList">
                              {formik.values.tree2?.map((node, index) => (
                                <li
                                  key={index}
                                  className="Ul-parentsiteList-childlist"
                                >
                                  <label>
                                    <input
                                      type="checkbox"
                                      name={`tree2[${index}].checked`}
                                      checked={node.checked}
                                      onChange={() =>
                                        handleParentCheckboxChange(
                                          index,
                                          "tree2"
                                        )
                                      }
                                      className="form-check-input mb-2"
                                      style={{ marginLeft: "10px" }}
                                    />

                                    <span className="tree-label">
                                      {node.text}
                                    </span>
                                  </label>
                                  {node.children &&
                                    node.children.length > 0 && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => toggleDropdown(node.id)}
                                          style={{ float: "right" }}
                                        >
                                          {openDropdownId === node.id ? (
                                            <span>
                                              <i
                                                className="fa fa-chevron-up"
                                                aria-hidden="true"
                                                style={{ color: "#fff" }}
                                              ></i>
                                            </span>
                                          ) : (
                                            <span>
                                              <i
                                                className="fa fa-chevron-down"
                                                aria-hidden="true"
                                                style={{ color: "#fff" }}
                                              ></i>
                                            </span>
                                          )}
                                        </button>
                                        {openDropdownId === node.id && (
                                          <ul
                                            style={{
                                              background: "#fff",
                                              color: "#000",
                                            }}
                                            className="Ul-childsiteList p-2"
                                          >
                                            {node.children.map(
                                              (child, childIndex) => (
                                                <li key={childIndex}>
                                                  <label className="ms-2">
                                                    <input
                                                      type="checkbox"
                                                      name={`tree2[${index}].children[${childIndex}].checked`}
                                                      checked={child.checked}
                                                      onChange={
                                                        formik.handleChange
                                                      }
                                                      className="form-check-input mb-2"
                                                      style={{
                                                        marginLeft: "10px",
                                                      }}
                                                    />

                                                    <span className="tree-label">
                                                      {child.text}
                                                    </span>
                                                  </label>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        )}
                                      </>
                                    )}
                                </li>
                              ))}
                            </ul>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  ) : (
                    <>
                      <img
                        src={require("../../../assets/images/commonimages/no_data.png")}
                        alt="MyChartImage"
                        className="all-center-flex nodata-image"
                      />
                    </>
                  )}
                </Card.Body>
                <Card.Footer>
                  {tree1?.companies?.length > 0 ? (
                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </form>
      </>
    </>
  );
};

export default TreeForm;
