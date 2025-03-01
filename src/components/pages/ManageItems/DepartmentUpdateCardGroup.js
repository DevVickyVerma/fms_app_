import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import * as Yup from "yup";

const DepartmentUpdateCardGroup = ({ isLoading, getData, postData }) => {
  const [cardData, setCardData] = useState();
  let updatedStoredData = JSON.parse(
    localStorage.getItem("localFilterModalData")
  );

  const paramId = useParams();

  useEffect(() => {
    fetchUpdateCardDetail();
  }, []);

  const initialValues = {
    cardData: cardData,
    AssignFormikCards: [],
    card_name: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      card_name: Yup.string().required("Item group name is required"),
    }),
    onSubmit: (values) => {
      handleSettingSubmit(values);
    },
    // ... Add other Formik configuration options as needed
  });

  const fetchUpdateCardDetail = async () => {
    try {
      const response = await getData(
        `/department-item/group/detail/${paramId?.id}`
      );

      const { data } = response;
      if (data) {
        setCardData(data?.data ? data.data.items : []);
        formik.setFieldValue("AssignFormikCards", data?.data?.items);
        formik.setFieldValue("card_name", data?.data?.name);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSettingSubmit = async (values) => {
    try {
      let index = 1;
      // Create a new FormData object
      const formData = new FormData();

      for (const obj of values.AssignFormikCards) {
        const { id, checked } = obj;
        // const card_valueKey = `card_id`;

        if (checked) {
          formData.append(`item_id[${index}]`, id);
          index++; // Increment index for the next iteration
        }
      }
      formData.append("company_id", updatedStoredData?.company_id);
      formData.append("name", values?.card_name);
      formData.append("group_id", paramId.id);

      const postDataUrl = "/department-item/group/update";
      const navigatePath = "/department-item-group";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
      // await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };

  const cardDataColumn = [
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      center: false,
      width: "15%",
      cell: (row, index) => (
        <div className="all-center-flex" style={{ margin: "auto" }}>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`AssignFormikCards[${index}].checked`}
            className="form-check-input cursor-pointer"
            checked={
              formik.values?.AssignFormikCards?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Items",
      selector: (row) => row.name,
      sortable: false,
      //  width: "85%",
      cell: (row) => (
        <div className="d-flex">
          <div className=" my-2 d-flex justify-content-center align-items-center gap-1 all-center-flex">
            <span
              className="all-center-flex"
              style={{
                width: "40px",
                height: "25px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* <img src={row?.logo} alt='' /> */}
            </span>
            <h6 className="mb-0 fs-14 fw-semibold all-center-flex">
              {row.name}
            </h6>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div className="page-header ">
        <div>
          <h1 className="page-title">Edit Group</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard" }}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item breadcrumds"
              aria-current="page"
              linkAs={Link}
              linkProps={{ to: "/department-item-group" }}
            >
              Manage Item Group
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Edit Item Group
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Card>
        <Card.Body>
          <Row>
            <form onSubmit={formik.handleSubmit}>
              <Col lg={12} md={12}>
                <div lg={4} md={6}>
                  <div className="form-group">
                    <label className="form-label mt-4" htmlFor="card_name">
                      Item Group Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      className={`input101 ${
                        formik.errors.card_name && formik.touched.card_name
                          ? "is-invalid"
                          : ""
                      }`}
                      id="card_name"
                      name="card_name"
                      placeholder="Item Group Name"
                      onChange={formik.handleChange}
                      value={formik.values.card_name}
                    />
                    {formik.errors.card_name && formik.touched.card_name && (
                      <div className="invalid-feedback">
                        {formik.errors.card_name}
                      </div>
                    )}
                  </div>
                </div>
                <Card.Header className="cardheader-table">
                  <h3 className="card-title">Assign items</h3>
                </Card.Header>
                {cardData?.length > 0 ? (
                  <>
                    <div className="module-height">
                      <DataTable
                        columns={cardDataColumn}
                        data={cardData}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead={true}
                        highlightOnHover={true}
                        searchable={false}
                        responsive={true}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={require("../../../assets/images/commonimages/no_data.png")}
                      alt="MyChartImage"
                      className="all-center-flex nodata-image"
                    />
                  </>
                )}

                <Card.Footer className="text-end">
                  <Link
                    type="submit"
                    className="btn btn-danger me-2 "
                    to={`/department-item-group/`}
                  >
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary me-2 ">
                    Submit
                  </button>
                </Card.Footer>
              </Col>
            </form>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default withApi(DepartmentUpdateCardGroup);
