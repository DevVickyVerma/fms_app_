import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { Breadcrumb, Card, Col, FormGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MultiSelect } from "react-multi-select-component";

const UpdateCardGroup = ({ isLoading, getData, postData }) => {
  const [cardData, setCardData] = useState();
  const companyId = localStorage.getItem("cardsCompanyId");
  const [selected, setSelected] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const GetSiteList = async (companyId) => {
    try {
      if (companyId) {
        const response = await getData(
          `common/site-list?company_id=${companyId}`
        );

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
  const options = SiteList?.map((site) => ({
    label: site.site_name,
    value: site.id,
  }));
  const paramId = useParams();

  useEffect(() => {
    fetchUpdateCardDetail();
    GetSiteList(companyId)
  }, []);

  const initialValues = {
    cardData: cardData,
    AssignFormikCards: [],
    card_name: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      card_name: Yup.string().required("Card group name is required"),
    }),
    onSubmit: (values) => {
      handleSettingSubmit(values);
    },
    // ... Add other Formik configuration options as needed
  });

  const fetchUpdateCardDetail = async () => {
    try {
      const response = await getData(`/sage/card-group/detail/${paramId?.id}`);

      const { data } = response;
      if (data) {
        setCardData(data?.data ? data.data.cards : []);
        formik.setFieldValue("AssignFormikCards", data?.data?.cards);
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
        const { id, for_tenant, checked, name } = obj;
        // const card_valueKey = `card_id`;

        if (checked) {
          formData.append(`card_id[${index}]`, id);
          index++; // Increment index for the next iteration
        }
      }
      const selectedSiteIds = selected?.map((site) => site.value);

      selectedSiteIds?.forEach((id, index) => {
        formData.append(`site_id[${index}]`, id);
      });
      formData.append("company_id", companyId);
      formData.append("name", values?.card_name);
      formData.append("group_id", paramId.id);

      const postDataUrl = "/sage/card-group/update";
      const navigatePath = "/card-group";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
      // await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const cardDataColumn = [
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      center: true,
      width: "15%",
      cell: (row, index) => (
        <div className="all-center-flex">
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
      name: "Cards",
      selector: (row) => row.name,
      sortable: true,
      width: "85%",
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
              <img
                src={row?.logo}
                alt=""
                style={{
                  // width: "60px",
                  // height: "40px",
                  background: "rgb(225 214 214)",
                  padding: "5px",
                  borderRadius: "8px",
                }}
              />
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
          <h1 className="page-title">Update Card Group</h1>
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
              linkProps={{ to: "/card-group" }}
            >
              Card Group
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Update Card Group
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col md={12} xl={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Update Card Group</h3>
            </Card.Header>
            <Card.Body>
              <form onSubmit={formik.handleSubmit}>
                <Row>
                 
                <Col lg={6} md={6}>
                      <div className="form-group">
                        <label className="form-label mt-4" htmlFor="card_name">
                          Card Group Name
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
                          placeholder="Card Group Name"
                          onChange={formik.handleChange}
                          value={formik.values.card_name}
                        />
                        {formik.errors.card_name &&
                          formik.touched.card_name && (
                            <div className="invalid-feedback">
                              {formik.errors.card_name}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={6} md={6}>
                    <FormGroup>
                      <label className="form-label mt-4">
                        Select Sites
                        <span className="text-danger">*</span>
                      </label>
                      <MultiSelect
                        value={selected}
                        onChange={setSelected}
                        labelledBy="Select Sites"
                        disableSearch="true"
                        options={options}
                        showCheckbox="false"
                      />
                    </FormGroup>
                  </Col>
                    <Col lg={12} md={12}>
                 
                 <Card.Header className="cardheader-table">
                      <h3 className="card-title">Assign Card</h3>
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
                            persistTableHead
                            highlightOnHover
                            
                            responsive
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                          alt="MyChartImage"
                          className="all-center-flex nodata-image"
                        />
                      </>
                    )}

                    <div className="text-end mt-4">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/card-group/`}
                      >
                        Cancel
                      </Link>
                      <button type="submit" className="btn btn-primary me-2 ">
                        Submit
                      </button>
                    </div>
                 </Col>
                 </Row>
              
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default withApi(UpdateCardGroup);
