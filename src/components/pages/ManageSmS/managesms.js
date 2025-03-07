import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Breadcrumb, Card, Col, Modal, Row, Tab, Tabs } from "react-bootstrap";
import * as Yup from "yup";
import withApi from "../../../Utils/ApiHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Loaderimg from "../../../Utils/Loader";
import { useFormik } from "formik";
import { ErrorAlert } from "../../../Utils/ToastUtils";
import { useSelector } from "react-redux";
import CustomPagination from "../../../Utils/CustomPagination";

const ManageSiteTank = (props) => {
  const { apidata, getData, postData, isLoading } = props;
  const [data, setData] = useState();
  const [mybalance, setbalance] = useState();
  const [BuyMoree, setBuyMore] = useState();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [Tabvalue, setTabvalue] = useState("");
  const [selectedClientIdOnSubmit, setSelectedClientIdOnSubmit] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [activeTab, setActiveTab] = useState("tab5"); // 'tab5' is the default active tab
  const [permissionsArray, setPermissionsArray] = useState([]);
  const UserPermissions = useSelector((state) => state?.data?.data);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const issmsPermissionAvailable = permissionsArray?.includes("sms-invoice");
  useEffect(() => {
    if (selectedClientIdOnSubmit) {
      handleTabSelect(activeTab);
    }
  }, [currentPage]);

  const handleSubmit1 = async (values) => {
    setTabvalue(values?.client_id);
    setSelectedClientIdOnSubmit(values);
    const { client_id } = values;
    try {
      const response = await getData(
        `/sms/list?client_id=${client_id}&page=${currentPage}`
      );

      if (response && response.data && response.data.data) {
        setData(response?.data?.data);
        setbalance(response?.data?.data?.balance);
        setBuyMore(response?.data?.data?.buy_more);

        setCurrentPage(response?.data?.data?.currentPage || 1);
        setLastPage(response?.data?.data?.lastPage || 1);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const statusColors = {
    0: "red", // Failed
    1: "green", // Delivered
    2: "orange", // Undelivered
    3: "yellow", // Rejected
    4: "blue", // Expired
  };
  const fetchInvoiceData = async (invoiceId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/sms/invoice-detail/${invoiceId}`,
        {
          method: "GET", // Change to "GET" if you are fetching data
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Adjust the following based on your API response format
      const data = await response.json(); // Assuming the response is JSON
      return data;
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      // Handle the error as needed
      return null;
    }
  };
  const handleDownloadInvoice = async (row) => {
    try {
      // Fetch the invoice data
      const invoiceData = await fetchInvoiceData(row);

      // Save the invoice data to state
      // setDownloadedInvoice(invoiceData);
      // Pass the logo URL when calling generateAndDownloadPDF
      generateAndDownloadPDF(
        invoiceData,
        "invoice.pdf",
        invoiceData?.data.logo
      );
    } catch (error) {
      console.error("Error downloading invoice:", error);
      // Handle the error as needed
    }
  };

  const generateAndDownloadPDF = async (data, fileName, logoUrl) => {
    // Create a new jsPDF instance
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.width;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    const textWidth =
      (pdf.getStringUnitWidth("Invoice") * pdf.getFontSize()) /
      pdf.internal.scaleFactor;
    const xCoordinate = (pdfWidth - textWidth) / 2;

    // pdf.addImage(data?.data?.logo, "JPEG", 15);

    pdf.text("INVOICE", xCoordinate, 15);

    // Set back to regular font for the rest of the content
    pdf.setFont("helvetica", "normal");

    // Add a line under the header
    pdf.line(10, 20, 200, 20);
    const lineHeight = 6;
    // Display recipient and sender details with bold labels
    pdf.setFont("helvetica", "bold");
    pdf.text("Name:", 20, 30);
    pdf.text("Email:", 20, 30 + lineHeight);
    if (
      data &&
      data.data &&
      data.data.invoice_to &&
      data.data.invoice_to.address !== "N/A"
    ) {
      pdf.text("Address: ", 20, 30 + 2 * lineHeight);
    }

    pdf.text("Name:", 120, 30);
    pdf.text("Email:", 120, 30 + lineHeight);

    if (
      data &&
      data.data &&
      data.data.invoice_from &&
      data.data.invoice_from.address !== "N/A"
    ) {
      pdf.text("Address:", 120, 30 + 2 * lineHeight);
    }

    // Reset font size to 12px for the address lines
    pdf.setFontSize(11);

    // Display recipient and sender details with normal font
    pdf.setFont("helvetica", "normal");
    pdf.text(`${data?.data.invoice_to.name}`, 33, 30);
    pdf.text(`${data?.data.invoice_to.email}`, 33, 30 + lineHeight);
    // pdf.text(`${data?.data.invoice_to.address}`, 41, 50 + 2 * lineHeight);
    if (
      data &&
      data.data &&
      data.data.invoice_to &&
      data.data.invoice_to.address !== "N/A"
    ) {
      const invoiceinvoice_toLines = pdf.splitTextToSize(
        data?.data.invoice_to.address,
        60
      );
      for (let i = 0; i < invoiceinvoice_toLines.length; i++) {
        pdf.text(invoiceinvoice_toLines[i], 20, 30 + (3 + i) * lineHeight);
      }
    }

    pdf.text(`${data?.data.invoice_from.name}`, 133, 30);
    pdf.text(`${data?.data.invoice_from.email}`, 133, 30 + lineHeight);
    // pdf.text(`${data?.data.invoice_from.address}`, 140, 50 + 2 * lineHeight);
    // Display Invoice From address with multiple lines

    if (
      data &&
      data.data &&
      data.data.invoice_from &&
      data.data.invoice_from.address !== "N/A"
    ) {
      const invoiceFromAddressLines = pdf.splitTextToSize(
        data?.data.invoice_from.address,
        60
      );
      for (let i = 0; i < invoiceFromAddressLines.length; i++) {
        pdf.text(invoiceFromAddressLines[i], 120, 30 + (3 + i) * lineHeight);
      }
    }
    // Add logo if provided
    if (logoUrl) {
      // Fetch the logo as a blob
      try {
        const logoResponse = await fetch(logoUrl);
        const logoBlob = await logoResponse.blob();

        // Create a data URL from the logo blob
        const logoDataUrl = URL.createObjectURL(logoBlob);

        // Add the logo to the PDF
        pdf.addImage(logoDataUrl, "PNG", 150, 10, 40, 15);
      } catch (error) {
        console.error("Error loading logo:", error);
        // Handle the error as needed
      }
    }

    // Display data in a table using autoTable
    pdf.autoTable({
      startY: 40 + 2 * 20,
      head: [[" SMS Credited", "Price", "Total", "Date"]],
      body: [
        [
          data?.data.credit,
          data?.data.price,
          data?.data.total,
          data?.data.created_date,
        ],
      ],
      headStyles: {
        fillColor: [98, 89, 202],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        font: "helvetica", // Specify the font family here
      },
      bodyStyles: {
        font: "helvetica", // Specify the font family here
      },
    });

    // Reset font to normal for the footer
    pdf.setFont("helvetica", "normal");

    // Add a footer with a line
    pdf.line(
      10,
      pdf.autoTable.previous.finalY + 5,
      200,
      pdf.autoTable.previous.finalY + 5
    );

    // Calculate the width of the page
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Calculate the width of the text
    const ThankWidth =
      (pdf.getStringUnitWidth("Thank you for your business!") *
        pdf.internal.getFontSize()) /
      pdf.internal.scaleFactor;

    // Calculate the x-coordinate to center the text
    const ThankxCoordinate = (pageWidth - ThankWidth) / 2;

    // Add the centered text to the footer
    pdf.text(
      "Thank you for your business!",
      ThankxCoordinate,
      pdf.autoTable.previous.finalY + 15
    );
    const footerHeight = 10; // Adjust as needed
    const footerY = pdf.internal.pageSize.height - footerHeight - 15; // Adjust as needed

    // Set background color for the footer
    const footerBackgroundColor = "#2D8BA8"; // Specify your desired color
    pdf.setFillColor(footerBackgroundColor);
    pdf.rect(10, footerY, pdf.internal.pageSize.width - 20, footerHeight, "F"); // "F" means "fill"

    // Add content to the footer
    pdf.setTextColor(255, 255, 255); // Set text color to white

    // Add the centered text to the footer
    const footerText = "Copyright © 2023 Credentia. ";
    const footertextWidth =
      pdf.getStringUnitWidth(footerText) * pdf.internal.getFontSize();
    const textX = pdf.internal.pageSize.width - footertextWidth + 15; // Adjust the offset as needed
    const textY = footerY + 6;

    pdf.text(footerText, textX, textY);
    // Save the PDF as a Blob
    const pdfBlob = pdf.output("blob");

    // Trigger the download
    downloadFile(pdfBlob, fileName);
  };

  const downloadFile = (data, fileName) => {
    const blob = new Blob([data], { type: "application/pdf" });

    // Create a link element
    const link = document.createElement("a");

    // Set the download attribute and create an object URL for the blob
    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);

    // Append the link to the document and trigger the click event
    document.body.appendChild(link);
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };
  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      //  width: "6%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Credited By",
      selector: (row) => [row.credit],
      sortable: false,
      //  width: "23.5",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6
              className={`mb-0 fs-14 fw-semibold btn text-${row.bgColor} btn-sm`}
              style={{ cursor: "pointer" }}
            >
              {row.credit} {row.type}
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Site",
      selector: (row) => [row.site],
      sortable: false,
      //  width: "23.5",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.site}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "SMS Status",
      selector: (row) => [row.status],
      sortable: false,
      //  width: "23.5",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            {row.status === 0 && (
              <h6
                className={`mb-0 fs-14 fw-semibold btn btn-${statusColors[0]} btn-sm`}
              >
                Failed
              </h6>
            )}
            {row.status === 1 && (
              <h6
                className={`mb-0 fs-14 fw-semibold btn btn-${statusColors[1]} btn-sm`}
              >
                Delivered
              </h6>
            )}
            {row.status === 2 && (
              <h6
                className={`mb-0 fs-14 fw-semibold btn btn-${statusColors[2]} btn-sm`}
              >
                Undelivered
              </h6>
            )}
            {row.status === 3 && (
              <h6
                className={`mb-0 fs-14 fw-semibold btn btn-${statusColors[3]} btn-sm`}
              >
                Rejected
              </h6>
            )}
            {row.status === 4 && (
              <h6
                className={`mb-0 fs-14 fw-semibold btn btn-${statusColors[4]} btn-sm`}
              >
                Expired
              </h6>
            )}
          </div>
        </div>
      ),
    },

    {
      name: "SMS By",
      selector: (row) => [row.creator],
      sortable: false,
      //  width: "23.5",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.creator}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row) => [row.created_date],
      sortable: false,
      //  width: "23.5",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
  ];
  const columns2 = [
    {
      name: "Sr. No",
      selector: (row, index) => index + 1,
      sortable: false,
      //  width: "6%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Credited By",
      selector: (row) => [row.creator],
      sortable: false,
      //  width: "23.5",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.creator}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "SMS ",
      selector: (row) => [row.credit],
      sortable: false,
      //  width: "23.5",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6
              className={`mb-0 fs-14 fw-semibold btn text-${row.bgColor} btn-sm`}
              style={{ cursor: "pointer" }}
            >
              {row.credit} {row.type}
            </h6>
          </div>
        </div>
      ),
    },

    {
      name: "Date",
      selector: (row) => [row.created_date],
      sortable: false,
      //  width: "23.5",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
          </div>
        </div>
      ),
    },

    issmsPermissionAvailable
      ? {
          name: "Invoice",
          selector: (row) => [row.id],
          sortable: false,
          width: "23.5",
          cell: (row) => (
            <div className="d-flex">
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                <button onClick={() => handleDownloadInvoice(row.id)}>
                  <i className="fa fa-download" aria-hidden="true" />
                </button>
              </div>
            </div>
          ),
        }
      : "",
  ];

  const formik = useFormik({
    initialValues: {
      client_id: "",
    },
    onSubmit: (values) => {
      if (values.client_id) {
        handleSubmit1(values);
      } else {
        ErrorAlert("please Select a client");
      }
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

  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData();
    } else {
      const userclient = {
        client_id: clientId,
      };
      handleSubmit1(userclient);
      setSelectedClientId(clientId);
    }
  }, []);

  const handleClearForm = async () => {
    formik.setFieldValue("site_id", "");
    formik.setFieldValue("start_date", "");
    formik.setFieldValue("client_id", "");
    formik.setFieldValue("company_id", "");
    setData();
    setbalance();
    setTabvalue("");

    setSelectedClientId("");

    const clientId = localStorage.getItem("superiorId");
    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData();
    } else {
      formik.setFieldValue("client_id", clientId);
      // GetCompanyList(clientId);
    }
  };

  const BuyMore = () => {
    setShowModal(true);
    formik.setFieldValue("smsamount", "");
  };
  const Smsvalidation = Yup.object().shape({
    smsamount: Yup.string().required("Amount is required"),
  });

  const Smsformik = useFormik({
    initialValues: {
      smsamount: "", // Initial value for the authentication code
    },
    validationSchema: Smsvalidation,
    onSubmit: (values) => {
      BuySmS(values);
    },
  });
  const BuySmS = async (values) => {
    try {
      const formData = new FormData();

      formData.append("credit", values.smsamount);
      formData.append("client_id", selectedClientId);

      const postDataUrl = "sms/update-credit";
      // eslint-disable-next-line no-unused-vars
      const response = await postData(postDataUrl, formData);

      if (apidata.api_response === "success") {
        setShowModal(false);

        const userclient = {
          client_id: selectedClientId,
        };
        formik.setFieldValue("smsamount", ""); // Assuming "smsamount" is the field name you want to clear

        handleSubmit1(userclient);
      }
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };

  const handleTabSelect = async (selectedTab) => {
    setActiveTab(selectedTab);
    const { client_id } = selectedClientIdOnSubmit;

    let url;
    setData();
    setbalance();

    if (selectedTab === "tab6") {
      url = `/sms/list?client_id=${client_id}&page=${currentPage}&type=credit`;
    } else {
      url = `/sms/list?client_id=${client_id}&page=${currentPage}`;
    }
    // Check if the selected tab is "Credit Log"
    try {
      const response = await getData(url);
      if (response && response.data && response.data.data) {
        setData(response?.data?.data);
        setbalance(response?.data?.data?.balance);
        setBuyMore(response?.data?.data?.buy_more);
        setCurrentPage(response?.data?.data?.currentPage || 1);
        setLastPage(response?.data?.data?.lastPage || 1);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Manage Sms</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Manage Sms
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        {localStorage.getItem("superiorRole") !== "Client" && (
          <Row>
            <Col md={12} xl={12}>
              <Card>
                <Card.Body>
                  <form onSubmit={formik.handleSubmit}>
                    <Card.Body>
                      <Row>
                        <Col lg={6} md={6}>
                          <div className="form-group">
                            <label
                              htmlFor="client_id"
                              className="form-label mt-4"
                            >
                              Client
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`input101 ${
                                formik.errors.client_id &&
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
                                  formik.setFieldValue(
                                    "client_id",
                                    selectedType
                                  );
                                  setSelectedClientId(selectedType);

                                  formik.setFieldValue("company_id", "");
                                  formik.setFieldValue("site_id", "");
                                } else {
                                  formik.setFieldValue("client_id", "");
                                  formik.setFieldValue("company_id", "");
                                  formik.setFieldValue("site_id", "");
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
                      </Row>
                    </Card.Body>
                    <Card.Footer className="text-end">
                      <button
                        className="btn btn-danger me-2"
                        type="button" // Set the type to "button" to prevent form submission
                        onClick={() => handleClearForm()} // Call a function to clear the form
                      >
                        Reset
                      </button>
                      <button className="btn btn-primary me-2" type="submit">
                        Submit
                      </button>
                    </Card.Footer>
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header className="d-flex justify-content-space-between">
                <h3 className="card-title">Manage Sms </h3>
                <span>
                  <button
                    className="btn btn-success me-2"
                    type="button" // Set the type to "button" to prevent form submission
                    style={{ cursor: "pointer" }}
                  >
                    Balance:{mybalance ? mybalance : "0"}
                  </button>
                  {BuyMoree ? (
                    <button
                      className="btn btn-danger me-2"
                      type="button" // Set the type to "button" to prevent form submission
                      onClick={BuyMore}
                    >
                      Buy More
                    </button>
                  ) : (
                    ""
                  )}{" "}
                </span>
              </Card.Header>

              <Card.Body>
                {Tabvalue ? (
                  <>
                    <Row>
                      <Col xl={12}>
                        <Card>
                          <div className="tabs-menu ">
                            <Tabs
                              className=" nav panel-tabs"
                              variant="pills"
                              defaultActiveKey={activeTab}
                              onSelect={handleTabSelect}
                            >
                              <Tab
                                eventKey="tab5"
                                className="me-1"
                                title="SMS Logs"
                              >
                                <div className="table-responsive deleted-table mobile-first-table">
                                  {data?.history.length > 0 ? (
                                    <DataTable
                                      columns={columns}
                                      data={data?.history}
                                      noHeader={true}
                                      defaultSortField="id"
                                      defaultSortAsc={false}
                                      striped={true}
                                      persistTableHead={true}
                                      highlightOnHover={true}
                                    />
                                  ) : (
                                    <img
                                      src={require("../../../assets/images/commonimages/no_data.png")}
                                      alt="MyChartImage"
                                      className="all-center-flex nodata-image"
                                    />
                                  )}
                                </div>
                              </Tab>
                              &nbsp;
                              <Tab
                                eventKey="tab6"
                                className="  me-1"
                                title="Credit Log"
                              >
                                {data?.history.length > 0 ? (
                                  <div className="table-responsive deleted-table mobile-first-table">
                                    <DataTable
                                      columns={columns2}
                                      data={data?.history}
                                      noHeader={true}
                                      defaultSortField="id"
                                      defaultSortAsc={false}
                                      striped={true}
                                      persistTableHead={true}
                                      highlightOnHover={true}
                                    />
                                  </div>
                                ) : (
                                  <img
                                    src={require("../../../assets/images/commonimages/no_data.png")}
                                    alt="MyChartImage"
                                    className="all-center-flex nodata-image"
                                  />
                                )}
                              </Tab>
                            </Tabs>
                          </div>
                          {data?.history?.length > 0 && lastPage > 1 && (
                            <CustomPagination
                              currentPage={currentPage}
                              lastPage={lastPage}
                              handlePageChange={handlePageChange}
                            />
                          )}
                        </Card>
                      </Col>
                    </Row>
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
              </Card.Body>
            </Card>

            <Modal
              show={showModal}
              onHide={handleCloseModal}
              centered={true}
              style={{ paddingBottom: "0px" }}
              className="custom-modal-width custom-modal-height big-modal "
            >
              <Modal.Header className="p-0 m-0 d-flex justify-content-between align-items-center">
                {" "}
                <span
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  className="ModalTitle"
                >
                  <span>Buy Sms</span>
                  <span onClick={handleCloseModal}>
                    <button className="close-button">
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </span>
                </span>
              </Modal.Header>
              <Modal.Body
                className="Disable2FA-modalsss "
                style={{ paddingBottom: "0px" }}
              >
                <div className="modal-contentDisable2FAsss">
                  <div className="card">
                    <div className="card-body" style={{ padding: "10px" }}>
                      <form onSubmit={Smsformik.handleSubmit}>
                        <label htmlFor="start_date" className="form-label mt-4">
                          Amount
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="input101 authentication-code-input mb-2"
                          id="smsamount"
                          name="smsamount"
                          placeholder="Amount"
                          onChange={Smsformik.handleChange}
                          onBlur={Smsformik.handleBlur}
                        />
                        {Smsformik.touched.smsamount &&
                          Smsformik.errors.smsamount && (
                            <div className="error-message">
                              {Smsformik.errors.smsamount}
                            </div>
                          )}

                        <div className="mt-4 d-flex flex-column justify-content-between">
                          <div />
                          <div className="mt-4 d-flex flex-column">
                            <span className=" text-muted d-flex justify-content-between">
                              <strong>Your Quantity </strong>{" "}
                              {Smsformik.values.smsamount
                                ? Smsformik.values.smsamount
                                : 0}
                            </span>
                            <span className="text-muted d-flex justify-content-between">
                              <strong>Cost To purchase An SMS</strong> £ 0.08
                            </span>
                            <span className="mt-4 d-flex justify-content-between">
                              <strong>Final Amount </strong> £{" "}
                              {(Smsformik.values.smsamount * 0.008).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="text-end mt-4">
                          <button
                            type="button"
                            className="btn btn-danger mx-4"
                            onClick={handleCloseModal}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary ml-4 verify-button"
                            type="submit"
                            disabled={!formik.isValid}
                          >
                            Buy Now
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageSiteTank);
