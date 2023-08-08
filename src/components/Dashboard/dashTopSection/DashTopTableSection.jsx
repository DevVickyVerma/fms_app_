import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DashTopSubHeading from "./DashTopSubHeading";
import axios from "axios";


const DashTopTableSection = (props) => {
    const columns = [
        {
            name: 'Station',
            selector: 'station',
            sortable: true,
        },
        {
            name: 'Retail Volume',
            selector: 'retailVolume',
            sortable: true,
        },
        {
            name: 'Gross Volume',
            selector: 'grossVolume',
            sortable: true,
        },
        {
            name: 'Net Margin',
            selector: 'netMargin',
            sortable: true,
        },
        {
            name: 'Gross Profit',
            selector: 'grossProfit',
            sortable: true,
        },
    ];
    

    const data = [
        { id: 1, station: 'Station A', retailVolume: 1000, grossVolume: 1200, netMargin: 200, grossProfit: 150 },
        { id: 2, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 3, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 4, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 5, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 6, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 7, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 8, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 9, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 10, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 11, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 12, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 13, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 14, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 15, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 16, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },
        { id: 17, station: 'Station B', retailVolume: 800, grossVolume: 1000, netMargin: 150, grossProfit: 120 },

        // ...more data
    ];

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
    <DashTopSubHeading />
    
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
