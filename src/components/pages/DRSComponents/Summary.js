import { useEffect, useState } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
import { useSelector } from "react-redux";
import useErrorHandler from '../../CommonComponent/useErrorHandler';
import withApi from '../../../Utils/ApiHelper';

const DepartmentShop = (props) => {
  const {
    company_id,
    client_id,
    site_id,
    start_date,
    sendDataToParent,
    getData
  } = props;
  const { handleError } = useErrorHandler();
  const handleButtonClick = () => {
    const allPropsData = {
      company_id,
      client_id,
      site_id,
      start_date,
    };

    // Call the callback function with the object containing all the props
    sendDataToParent(allPropsData);
  };

  const [data, setData] = useState([]);
  const [bankingdata, setbankingData] = useState([]);
  const [summarydata, setsummarydata] = useState([]);
  const [summaryRemarks, setSummaryRemarks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const UserPermissions = useSelector((state) => state?.data?.data?.permissions || []);
  const dayEndPermission = UserPermissions?.includes("drs-day-end")

  useEffect(() => {
    
  }, [UserPermissions])


  useEffect(() => {
    const fetchData = async () => {


      try {
        const response = await getData(
          `/drs/summary/?site_id=${site_id}&drs_date=${start_date}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data?.takings);
          setbankingData(data?.data?.banking);

          setsummarydata(data?.data); //pending
          setSummaryRemarks(data?.data?.summary_of_remarks.summary_remarks);
          // setremarkdata(data?.data?.summary_of_remarks);
        }
      } catch (error) {
        console.error("API error:", error);
        // handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [site_id, start_date]);

  const _renderFunction = () => Object.keys(data)?.map((item,) => {
    const displayName = item
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <div className="Dps-data">
        <p>{displayName}</p>
        <p>{data[item]}</p>
      </div>
    );
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  const _renderFunction1 = () => Object.keys(bankingdata).map((item, index) => {
    // Replace underscores with spaces in the 'item' variable
    const displayName = item
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <div className="Dps-data" key={index}>
        <p>{displayName}</p>
        <p>{bankingdata[item]}</p>
      </div>
    );
  });

  const SubmitSummary = async (values) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const banking_difference = summarydata?.banking["banking_difference"];

      const cash_operator = summarydata?.banking["cash_commited_by_operator"];

      const net_cash_due_banking =
        summarydata?.banking["net_cash_due_for_banking"];

      const formData = new FormData();
      formData.append("net_cash_due_banking", net_cash_due_banking);
      formData.append("banking_difference", banking_difference);
      formData.append("cash_operator", cash_operator);
      formData.append("site_id", site_id);
      formData.append("drs_date", start_date);
      formData.append("summary_remarks", values.Remarks);
      formData.append(
        "summary_of_variances",
        summarydata?.summary_of_variances
      );

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/drs/dayend`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        SuccessAlert(data.message);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsLoading(false);
        handleButtonClick();
      } else {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(" ")
          : data.message;

        ErrorAlert(errorMessage);
        setIsLoading(false);
      }
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };


  const isSummaryRemarksNull = summaryRemarks === null;




  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">SUMMARY OF TAKINGS</h3>
              </Card.Header>
              <Card.Body>{_renderFunction()}</Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <h3 className="card-title">SUMMARY OF BANKING</h3>
              </Card.Header>
              <Card.Body>{_renderFunction1()}</Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <h3 className="card-title">Cash Difference</h3>
              </Card.Header>
              <Card.Body>
                <div className="Dps-data">
                  <p>Cash Difference</p>
                  <p>{summarydata?.cash_difference}</p>
                </div>

                {!isSummaryRemarksNull ? (
                  <div className="Dps-data">
                    <p>Remarks</p>
                    <p>{summaryRemarks}</p>
                  </div>
                ) : (
                  <Formik
                    initialValues={{ Remarks: "" }}
                    validationSchema={Yup.object().shape({
                      Remarks: Yup.string().required("*Remarks is required"),
                    })}
                    onSubmit={(values) => {
                      SubmitSummary(values);
                    }}
                  >
                    <Form>
                      <div className="Dps-data">
                        <label htmlFor="Remarks">
                          Remarks<span className="text-danger">*</span>
                        </label>
                        <Field as="textarea" id="Remarks" name="Remarks" />
                      </div>
                      <div className="text-end">
                        <ErrorMessage
                          name="Remarks"
                          component="div"
                          id="description"
                        />
                      </div>
                      {summarydata?.dayend === true && dayEndPermission ? (
                        <div className="text-end">
                          <button
                            className="btn btn-primary mt-2"
                            type="submit"
                          >
                            Day End
                          </button>
                          <p className="warrningmessage">
                            <span className="text-danger">*</span>On clicking
                            the Day End button, Day End process will be
                            completed and no modification will be allowed for
                            the closed DRS
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                    </Form>
                  </Formik>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default withApi(DepartmentShop);
