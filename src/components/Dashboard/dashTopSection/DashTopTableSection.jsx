import React, { useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DashTopSubHeading from "./DashTopSubHeading";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import { Slide, toast } from "react-toastify";
import withApi from "../../../Utils/ApiHelper";

const DashTopTableSection = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [data, setData] = useState();

  const navigate = useNavigate();
  // http://192.168.1.169:5000/get-details?client_id=3&company_id=1&end_date=2023-07-31&start_date=2023-07-01
  const FetchTableData = async () => {
    try {
      const response = await getData("/dashboard/get-details");
      // const data = response?.data?.data?.data?.sites
      // console.log(response.data.data.data.sites, "my response");

      if (response && response.data && response.data.data) {
        setData(response?.data?.data?.data?.sites);
        // setSearchvalue(response.data.data.charges);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchTableData();
    console.log("checking");
  }, []);

  console.log(",my fatched data available in the response", data);

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "10%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Client",
      selector: (row) => [row.name],
      sortable: true,
      width: "15%",
      cell: (row, index) => (
        <Link to={"/DashBoardSubChild"}>
          <div className="d-flex">
            <div className="ms-2 mt-0 mt-sm-2 d-block">
              <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
            </div>
          </div>
        </Link>
      ),
    },
    {
      name: "Fuel Volume",
      selector: (row) => [row.fuel_volume.gross_volume],
      sortable: true,
      width: "15%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">
              {row.fuel_volume.gross_volume}
            </h6>

            <p
              className={`me-1 ${
                row.fuel_volume?.status === "up"
                  ? "text-success"
                  : "text-danger"
              }`}
              data-tip={`${row.fuel_volume.percentage}%`}
            >
              {row.fuel_volume?.status === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="text-success">
                    {row.fuel_volume.percentage}%
                  </span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="text-danger">
                    {row.fuel_volume.percentage}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Fuel Sales",
      selector: (row) => [row.fuel_sales.total_value],
      sortable: true,
      width: "15%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              {row.fuel_sales.total_value}
            </h6>
            <p
              className={`me-1 ${
                row.fuel_sales?.status === "up"
                  ? "text-success"
                  : "text-danger"
              }`}
              data-tip={`${row.fuel_sales.percentage}%`}
            >
              {row.fuel_sales?.status === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="text-success">
                    {row.fuel_sales.percentage}%
                  </span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="text-danger">
                    {row.fuel_sales.percentage}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Gross Profit",
      selector: (row) => [row.gross_profit.gross_profit],
      sortable: true,
      width: "15%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              {row.gross_profit.gross_profit}
            </h6>
            <p
              className={`me-1 ${
                row.gross_profit?.status === "up"
                  ? "text-success"
                  : "text-danger"
              }`}
              data-tip={`${row.gross_profit.percentage}%`}
            >
              {row.gross_profit?.status === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="text-success">
                    {row.gross_profit.percentage}%
                  </span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="text-danger">
                    {row.gross_profit.percentage}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Shop Sales",
      selector: (row) => [row.shop_sales.shop_sales],
      sortable: true,
      width: "25%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              {row.shop_sales.shop_sales}
            </h6>
            <p
              className={`me-1 ${
                row.shop_sales?.status === "up"
                  ? "text-success"
                  : "text-danger"
              }`}
              data-tip={`${row.shop_sales.percentage}%`}
            >
              {row.shop_sales?.status === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="text-success">
                    {row.shop_sales.percentage}%
                  </span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="text-danger">
                    {row.shop_sales.percentage}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <Row class="mb-5 ">
        {/* <DashTopSubHeading /> */}

        <DataTable
          // title="Station List"
          columns={columns}
          data={data}
          pagination
          // paginationPerPage={5}
          highlightOnHover={true}
          fixedHeader={true}
          responsive={true}
          pointerOnHover={true}
          striped={true}
          // subHeader={true}
          // selectableRows={true}
          selectableRowsHighlight={true}
        />
      </Row>
    </>
  );
};

export default withApi(DashTopTableSection);
