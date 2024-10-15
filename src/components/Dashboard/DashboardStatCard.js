
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Card, Col, Modal, Row } from "react-bootstrap";
import { useFormik } from "formik";

const DashboardStatCard = ({ getData, isOpen, onClose, }) => {
  const [data, setData] = useState();
  const [filters, setFilters] = useState();

  const FetchmannegerList = async (filters) => {

    if (!filters?.client_id || !filters?.company_id || !filters?.site_id) {
      setData(null);
      return;
    }
    try {
      const response = await getData(`/dashboard/get-live-margin?client_id=${filters?.client_id}&company_id=${filters.company_id}&site_id=${filters.site_id}`);
      if (response && response.data) {
        setData(response?.data?.data)
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    if (filters?.site_id && filters?.client_id && filters.company_id) {
      FetchmannegerList(filters);
    } else {
      setData(null)
    }
  }, [filters?.site_id]);

  const request = [
    {
      id: 1,
      data: "ℓ 23,536",
      data1: "Gross Volume",
      color: "primary",
      icon: "fa-bar-chart",
    },
    {
      id: 2,
      data: "£ 45,789",
      data1: "Fuel Sales",
      color: "secondary",
      icon: "fa-bar-chart",
    },
    {
      id: 3,
      data: "£ 89,786",
      data1: "Gross profit",
      color: "success",
      icon: "fa-bar-chart",
    },
    {
      id: 4,
      data: "PPl 43,336",
      data1: "Gross Margin",
      color: "info",
      icon: "fa-bar-chart",
    },
    {
      id: 5,
      data: "£ 23,536",
      data1: "Shop Sales",
      color: "primary",
      icon: "fa-bar-chart",
    },
    {
      id: 6, // Fixed duplicate id for the last item
      data: " £ 23,536",
      data1: " Shop Profit",
      color: "primary",
      icon: "fa-bar-chart",
    },
  ];



  const storedKeyName = 'localFilterModalData'

  useEffect(() => {

    const storedData = localStorage.getItem(storedKeyName);
    if (storedData) {
      let parsedData = JSON.parse(storedData);
      formik.setValues(parsedData)
      setFilters(parsedData)
      // handleApplyFilters(parsedData);
    }
  }, [])

  const formik = useFormik({
    initialValues: {
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
    onSubmit: () => {
      console.clear()
    },
  });

  const handleSiteChange = (e) => {
    const selectedSiteId = e.target.value;
    formik.setFieldValue("site_id", selectedSiteId);
    const selectedSiteData = formik?.values?.sites?.find(site => site?.id === selectedSiteId);
    formik.setFieldValue('site_name', selectedSiteData?.site_name || "");
  };


  useEffect(() => {
    setFilters(formik?.values)
  }, [formik?.values?.site_id])

  return (

    <>
      <Modal show={isOpen} onHide={onClose} centered className='' >
        <div>
          <Modal.Header
            style={{
              color: "#fff",
            }}
            className='p-0 m-0 d-flex justify-content-between align-items-center'
          >

            <span className="ModalTitle d-flex justify-content-between w-100  fw-normal"  >
              <span>
                <img
                  src={require("../../assets/images/commonimages/LiveIMg.gif")}
                  alt="Live Img"
                  className="Liveimage"
                />{" "}{" "}

                <small>
                  <span> Last Updated On  {data?.last_updated}</span>
                  <span className="text-mute">
                    {" "}
                    {data?.last_updated_time && <>
                      ({data?.last_updated_time})
                    </>}
                  </span>
                </small>
              </span>
              <span onClick={onClose} >
                <button className="close-button">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            </span>
          </Modal.Header>

          <>
            <Card.Body className="card-body pb-0">
              <Row>
                {formik?.values?.sites?.length > 0 && (<>
                  <Col lg={12}>
                    <div className={`form-group`}>
                      <label htmlFor="site_id" className='mb-2'>
                        Site <span className="text-danger">*</span>
                      </label>
                      <select
                        id="site_id"
                        name="site_id"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleSiteChange(e); // If you have additional logic to handle
                        }}
                        onBlur={formik.handleBlur}
                        value={formik?.values?.site_id}
                        className="input101 form-input"
                      >
                        <option key={""} value={''}>Please Select Site</option>
                        {formik?.values?.sites?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.site_name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.site_id && formik.errors.site_id && (
                        <div className="text-danger mt-1">{formik.errors.site_id}</div>
                      )}
                    </div>
                  </Col>
                </>)}





                <Col sm={12} md={6} lg={6} xl={4}>
                  <Card
                    className={`card dash-plates-1 img-card box-${request[0].color}-shadow`}
                  >
                    <Card.Body>
                      <div className="d-flex">
                        <div className="text-white">
                          <h2 className="mb-0 number-font"><span className="l-sign">ℓ</span>  {data?.gross_volume || 0}</h2>
                          <p className="text-white mb-0">Gross Volume</p>
                        </div>
                        <div className="ms-auto">
                          <i className="ph ph-drop text-white fs-30"></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={12} md={6} lg={6} xl={4}>
                  <Card
                    className={`card  dash-plates-2 img-card box-${request[1].color}-shadow`}
                  >
                    <Card.Body>
                      <div className="d-flex">
                        <div className="text-white">
                          <h2 className="mb-0 number-font"> £  {data?.fuel_sales || 0}</h2>
                          <p className="text-white mb-0">Fuel Sales</p>
                        </div>
                        <div className="ms-auto">

                          <i className="ph ph-shopping-bag text-white fs-30"></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={12} md={6} lg={6} xl={4}>
                  <Card
                    className={`card  dash-plates-3 img-card box-${request[2].color}-shadow`}
                  >
                    <Card.Body>
                      <div className="d-flex">
                        <div className="text-white">
                          <h2 className="mb-0 number-font">£  {data?.gross_profit || 0}</h2>
                          <p className="text-white mb-0">Gross Profit</p>
                        </div>
                        <div className="ms-auto">

                          <i className="ph ph-currency-gbp text-white fs-30"></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={12} md={6} lg={6} xl={4}>
                  <Card
                    className={`card  dash-plates-1 img-card box-${request[3].color}-shadow`}
                  >
                    <Card.Body>
                      <div className="d-flex">
                        <div className="text-white">
                          <h2 className="mb-0 number-font">   {data?.gross_margin} ppl</h2>
                          <p className="text-white mb-0">Gross Margin</p>
                        </div>
                        <div className="ms-auto">
                          <i className="ph ph-lightning text-white fs-30"></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={12} md={6} lg={6} xl={4}>
                  <Card
                    className={`card  dash-plates-2 img-card box-${request[4].color}-shadow`}
                  >
                    <Card.Body>
                      <div className="d-flex">
                        <div className="text-white">
                          <h2 className="mb-0 number-font">£  {data?.shop_sales || 0}</h2>
                          <p className="text-white mb-0">Shop Sales</p>
                        </div>
                        <div className="ms-auto">
                          <i className="ph ph-shopping-bag text-white fs-30"></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={12} md={6} lg={6} xl={4}>
                  <Card
                    className={`card  dash-plates-3 img-card box-${request[5].color}-shadow`}
                  >
                    <Card.Body>
                      <div className="d-flex">
                        <div className="text-white">
                          <h2 className="mb-0 number-font">£  {data?.shop_profit || 0}</h2>
                          <p className="text-white mb-0">Shop Profit</p>
                        </div>
                        <div className="ms-auto">
                          <i className="ph ph-currency-gbp text-white fs-30"></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </>
        </div>
      </Modal>
    </>

  );
};

export default DashboardStatCard;
