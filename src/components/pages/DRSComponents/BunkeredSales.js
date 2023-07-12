import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";

const DepartmentShop = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate } = props;

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [dataList, setDataList] = useState();

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      SuccessToast("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorToast(errorMessage);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        const response = await axiosInstance.get(
          `/bunkered-sale/details/?site_id=U2dXNXN4OG5rSkdsOGZ0TXhTR0ZQZz09&drs_date=2023-07-01`
        );

        const { data } = response;
        if (data) {
          setDataList(data);
          setData(data);
          console.log(data, "datadatadata");
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [SiteID, ReportDate]);

  const chargesColumns = [
    {
      name: "SUPPLIER",
      width: "16.6%",
      selector: (row) => row.charge_name,
      sortable: true,
      cell: (row, index) => (
        <h1>hlo</h1>
        // <select
        //   className="input101"
        //   id="client_id"
        //   name="client_id"
        
        // >
        //   <option value="">Select a Client</option>
        //   {dataList.fuelSuppliers && dataList.fuelSuppliers.length > 0 ? (
        //     dataList.fuelSuppliers.map((item) => (
        //       <option key={item.id} value={item.id}>
        //         {item.supplier_name}
        //       </option>
        //     ))
        //   ) : (
        //     <option disabled>No Client</option>
        //   )}
        // </select>
      ),
    },
    {
      name: "TANK",
      width: "16.6%",
      selector: (row) => row.charge_name,
      sortable: true,
      cell: (row, index) => (
        <h1>hlo</h1>
        // <select
        //   className="input101"
        //   id="client_id"
        //   name="client_id"
        
        // >
        //   <option value="">Select a Client</option>
        //   {dataList.fuelSuppliers && dataList.fuelSuppliers.length > 0 ? (
        //     dataList.fuelSuppliers.map((item) => (
        //       <option key={item.id} value={item.id}>
        //         {item.supplier_name}
        //       </option>
        //     ))
        //   ) : (
        //     <option disabled>No Client</option>
        //   )}
        // </select>
      ),
    },
    {
      name: "FUEL",
      width: "16.6%",
      selector: (row) => row.charge_name,
      sortable: true,
      cell: (row, index) => (
        <h1>hlo</h1>
        // <select
        //   className="input101"
        //   id="client_id"
        //   name="client_id"
        
        // >
        //   <option value="">Select a Client</option>
        //   {dataList.fuelSuppliers && dataList.fuelSuppliers.length > 0 ? (
        //     dataList.fuelSuppliers.map((item) => (
        //       <option key={item.id} value={item.id}>
        //         {item.supplier_name}
        //       </option>
        //     ))
        //   ) : (
        //     <option disabled>No Client</option>
        //   )}
        // </select>
      ),
    },
    {
      name: "VOLUME",
      width: "16.6%",
      selector: (row) => row.charge_name,
      sortable: true,
      cell: (row, index) => (
        <h1>hlo</h1>
        // <select
        //   className="input101"
        //   id="client_id"
        //   name="client_id"
        
        // >
        //   <option value="">Select a Client</option>
        //   {dataList.fuelSuppliers && dataList.fuelSuppliers.length > 0 ? (
        //     dataList.fuelSuppliers.map((item) => (
        //       <option key={item.id} value={item.id}>
        //         {item.supplier_name}
        //       </option>
        //     ))
        //   ) : (
        //     <option disabled>No Client</option>
        //   )}
        // </select>
      ),
    },
    {
      name: "VALUE",
      width: "16.6%",
      selector: (row) => row.charge_name,
      sortable: true,
      cell: (row, index) => (
        <h1>hlo</h1>
        // <select
        //   className="input101"
        //   id="client_id"
        //   name="client_id"
        
        // >
        //   <option value="">Select a Client</option>
        //   {dataList.fuelSuppliers && dataList.fuelSuppliers.length > 0 ? (
        //     dataList.fuelSuppliers.map((item) => (
        //       <option key={item.id} value={item.id}>
        //         {item.supplier_name}
        //       </option>
        //     ))
        //   ) : (
        //     <option disabled>No Client</option>
        //   )}
        // </select>
      ),
    },
    {
      name: "ACTION",
      width: "16.6%",
      selector: (row) => row.charge_name,
      sortable: true,
      cell: (row, index) => (
        <h1>hlo</h1>
        // <select
        //   className="input101"
        //   id="client_id"
        //   name="client_id"
        
        // >
        //   <option value="">Select a Client</option>
        //   {dataList.fuelSuppliers && dataList.fuelSuppliers.length > 0 ? (
        //     dataList.fuelSuppliers.map((item) => (
        //       <option key={item.id} value={item.id}>
        //         {item.supplier_name}
        //       </option>
        //     ))
        //   ) : (
        //     <option disabled>No Client</option>
        //   )}
        // </select>
      ),
    },
  ];

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Bunkered Sales</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={6} md={6}>
                    <DataTable
                      columns={chargesColumns}
                      data={data}
                      noHeader
                      defaultSortField="id"
                      defaultSortAsc={false}
                      striped={true}
                      persistTableHead
                      highlightOnHover
                      searchable={false}
                      responsive
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default DepartmentShop;
