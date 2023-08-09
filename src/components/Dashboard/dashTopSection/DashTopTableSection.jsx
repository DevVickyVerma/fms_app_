import React, { useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DashTopSubHeading from "./DashTopSubHeading";
import axios from "axios";
import { Link } from "react-router-dom";


const DashTopTableSection = (props) => {
  
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
            selector: (row) => [row.data.fuel_volume.gross_volume],
            sortable: true,
            width: "15%",
            cell: (row, index) => (
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">{row.data.fuel_volume.gross_volume}</h6>
                </div>
              </div>
            ),
        },
        {
            name: "Fuel Sales",
            selector: (row) => [row.data.fuel_sales.total_value],
            sortable: true,
            width: "15%",
            cell: (row, index) => (
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">{row.data.fuel_sales.total_value}</h6>
                </div>
              </div>
            ),
        },
        {
            name: "Gross Profit",
            selector: (row) => [row.data.gross_profit.gross_profit],
            sortable: true,
            width: "15%",
            cell: (row, index) => (
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">{row.data.gross_profit.gross_profit}</h6>
                </div>
              </div>
            ),
        },
        {
            name: "Shop Sales",
            selector: (row) => [row.data.shop_sales.shop_sales],
            sortable: true,
            width: "25%",
            cell: (row, index) => (
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">{row.data.shop_sales.shop_sales}</h6>
                </div>
              </div>
            ),
        },
    ]

    const data = [         
        {
        "id" : 3,
        "name" : "Amersham Service Station", 
        "data": {                
                "fuel_volume": {
                    "gross_volume": "227442.96",
                    "bunkered_volume": "0.0",
                    "total_volume": "227442.96",
                    "status": "down",
                    "percentage": "-0.43"
                },
                "fuel_sales": {
                    "gross_value": "337909.54",
                    "bunkered_value": "0.0",
                    "total_value": "337909.54",
                    "status": "down",
                    "percentage": "-0.65"
                },
                "gross_profit": {
                    "gross_profit": 30783.56,
                    "gross_margin": 13.53,
                    "status": "up",
                    "percentage": "51.85"
                },
                "shop_sales": {
                    "shop_sales": "42555.6",
                    "shop_margin": "0.00",
                    "status": "down",
                    "percentage": "-1.98"
                }
            }
        },
        {
        "id" : 5,
        "name" : "Erith Service Station", 
        "data": {                
                "fuel_volume": {
                    "gross_volume": "237442.96",
                    "bunkered_volume": "0.0",
                    "total_volume": "27442.96",
                    "status": "down",
                    "percentage": "-2.43"
                },
                "fuel_sales": {
                    "gross_value": "33309.54",
                    "bunkered_value": "0.0",
                    "total_value": "34909.54",
                    "status": "down",
                    "percentage": "3.65"
                },
                "gross_profit": {
                    "gross_profit": 3783.56,
                    "gross_margin": 143.53,
                    "status": "down",
                    "percentage": "32.85"
                },
                "shop_sales": {
                    "shop_sales": "42155.6",
                    "shop_margin": "1.00",
                    "status": "up",
                    "percentage": "45.98"
                }
            }
        },
        {
          "id" : 7,
          "name" : "Amersham Service Station", 
          "data": {                
                  "fuel_volume": {
                      "gross_volume": "227442.96",
                      "bunkered_volume": "0.0",
                      "total_volume": "227442.96",
                      "status": "down",
                      "percentage": "-0.43"
                  },
                  "fuel_sales": {
                      "gross_value": "337909.54",
                      "bunkered_value": "0.0",
                      "total_value": "337909.54",
                      "status": "down",
                      "percentage": "-0.65"
                  },
                  "gross_profit": {
                      "gross_profit": 30783.56,
                      "gross_margin": 13.53,
                      "status": "up",
                      "percentage": "51.85"
                  },
                  "shop_sales": {
                      "shop_sales": "42555.6",
                      "shop_margin": "0.00",
                      "status": "down",
                      "percentage": "-1.98"
                  }
              }
          },
          {
          "id" : 9,
          "name" : "Erith Service Station", 
          "data": {                
                  "fuel_volume": {
                      "gross_volume": "237442.96",
                      "bunkered_volume": "0.0",
                      "total_volume": "27442.96",
                      "status": "down",
                      "percentage": "-2.43"
                  },
                  "fuel_sales": {
                      "gross_value": "33309.54",
                      "bunkered_value": "0.0",
                      "total_value": "34909.54",
                      "status": "down",
                      "percentage": "3.65"
                  },
                  "gross_profit": {
                      "gross_profit": 3783.56,
                      "gross_margin": 143.53,
                      "status": "down",
                      "percentage": "32.85"
                  },
                  "shop_sales": {
                      "shop_sales": "42155.6",
                      "shop_margin": "1.00",
                      "status": "up",
                      "percentage": "45.98"
                  }
              }
          }
      ]


    const [apiResponse, setApiResponse] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // API URL and query parameters
            const apiUrl = 'http://192.168.1.169:5000/get-details';
            const params = {
                client_id: '3',
                company_id: '1',
                end_date: '2023-07-31',
                start_date: '2023-07-01',
            };

            try {
                const response = await axios.get(apiUrl, { params });
                setApiResponse(response?.data);
            } catch (error) {
                console.error('API error:', error);
            }
        };

        fetchData();
    }, []);
  

    console.log("response" ,apiResponse);
    // console.log("data that I fatched", apiResponse);
  return (
    <Row class="mb-5 ">
    {/* <DashTopSubHeading /> */}
    
      <DataTable
        // title="Station List"
        columns={columns}
        data={data}
        pagination
        // paginationPerPage={5}
        highlightOnHover= {true}
        fixedHeader ={true}
        responsive={true}
        pointerOnHover={true}
        striped={true} 
        // subHeader={true}
        // selectableRows={true}
        selectableRowsHighlight={true}
      />
    </Row>
  );
};

export default DashTopTableSection;
