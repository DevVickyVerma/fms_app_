import React from "react";
import { useEffect, useState } from 'react';
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import Loaderimg from "../../../Utils/Loader";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import withApi from "../../../Utils/ApiHelper";
import { Box } from "@mui/system";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

const SiteEvobossStatus = (props) => {
  const { isLoading, getData, } = props;
  const [data, setData] = useState();
  const [siteData, setSiteData] = useState();

  useEffect(() => {
    FetchTableData();
    console.clear();
  }, []);

  const FetchTableData = async () => {
    try {
      const response = await getData(`/evobos-site/listing`);
      setData(response?.data?.data?.sites);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleNavigateToNewPage = (rowData) => {
    const FetchSitedata = async (rowData) => {
      try {
        const response = await getData(`/evobos-site/status?id=${rowData?.id}`);
        setSiteData(response?.data?.data);
      } catch (error) {
        console.error("API error:", error);
      }
    };

    FetchSitedata(rowData);
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "15%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Site Name",
      selector: (row) => [row?.site_name],
      sortable: false,
      width: "85%",
      cell: (row, ) => (
        <div
          className="d-flex"
          onClick={() => handleNavigateToNewPage(row)}
          style={{ cursor: "pointer" }}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              {" "}
              {row?.site_name} ({row?.site_code}({row?.site_company_code}))
            </h6>
          </div>
        </div>
      ),
    },
  ];





  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> evoBOS</h1>

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
                Site evoBOS
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Box>
          <Row className=" row-sm">
            <Box display={"flex"} flexDirection={"column"}>
              {" "}
            </Box>
            <Col lg={7}>
              <Card>
                {" "}
                <Card.Header>
                  <h3 className="card-title">evoBOS Status</h3>
                </Card.Header>
                <Card.Body>
                  {siteData ? (
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      minHeight={"513px"}
                      // justifyContent={"center"}
                      gap={"10px"}
                    >
                      <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>
                        {siteData?.[0]?.site_name}
                      </h3>
                      <span>Company - {siteData?.[0]?.company}</span>
                      <span>Company Code - {siteData?.[0]?.company_code}</span>
                      <span> Site Code - {siteData?.[0]?.site_code}</span>
                      <p>
                        Site Status -{" "}
                        <span
                          style={{
                            color: siteData?.[0]?.site_status?.bg_color,
                          }}
                        >
                          {" "}
                          {siteData?.[0]?.site_status?.status}
                          {siteData?.[0]?.site_status?.bg_color === "green" ? (
                            <AiFillCheckCircle
                              size={19}
                              style={{ marginLeft: "2px", marginBottom: "2px" }}
                            />
                          ) : (
                            <AiFillCloseCircle
                              color={"red"}
                              size={19}
                              style={{ marginLeft: "2px", marginBottom: "2px" }}
                            />
                          )}
                        </span>
                      </p>
                    </Box>
                  ) : (
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      minHeight={"513px"}
                      gap={"10px"}
                    >
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                        Please select Any Site Name....
                      </span>
                      <img
                        src={require("../../../assets/images/commonimages/no_data.png")}
                        alt="MyChartImage"
                        className="all-center-flex nodata-image"
                      />
                    </Box>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={5}>
              <Card>
                <Card.Header>
                  <h3 className="card-title">evoBOS Sites</h3>
                </Card.Header>

                <Card.Body>
                  {data?.length > 0 ? (
                    <>
                      <div
                        className="table-responsive deleted-table"
                        style={{ height: "510px" }}
                      >
                        <DataTable
                          columns={columns}
                          data={data}
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
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
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Box>
      </>
    </>
  );
};

export default withApi(SiteEvobossStatus);
