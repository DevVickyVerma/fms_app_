// // DashboardStatCard.js
// import React, { useEffect } from "react";
// import { Card, Col, ProgressBar, Row } from "react-bootstrap";

// const DashboardStatCard = ({ getData, isLoading }) => {
//   console.log(isLoading, "isLoading");

//   const FetchmannegerList = async () => {
//     try {
//       const response = await getData(`/company/auto-report/list`);

//       if (response && response.data) {
//         console.log(response.data, "response.data");
//       } else {
//         throw new Error("No data available in the response");
//       }
//     } catch (error) {
//       console.error("API error:", error);
//     }
//   };

//   //   useEffect(() => {
//   //     FetchmannegerList();
//   //   }, []);
//   const request = [
//     {
//       id: 1,
//       data: "ℓ 23,536",
//       data1: " Gross Volume",
//       color: "primary",
//       icon: "fa-send-o",
//     },
//     {
//       id: 2,
//       data: "£ 45,789",
//       data1: "Fuel Sales",
//       color: "secondary",
//       icon: "fa-bar-chart",
//     },
//     {
//       id: 3,
//       data: "£ 89,786",
//       data1: "Gross profit",
//       color: "success",
//       icon: "fa-dollar",
//     },
//     {
//       id: 4,
//       data: " PPl 43,336",
//       data1: "Gross Margin",
//       color: "info",
//       icon: "fa-cart-plus",
//     },
//     {
//       id: 5,
//       data: "£ 23,536",
//       data1: "Shop Sales",
//       color: "primary",
//       icon: "fa-send-o",
//     },
//     {
//       id: 5,
//       data: "23,536",
//       data1: "£ Shop Profit",
//       color: "primary",
//       icon: "fa-send-o",
//     },
//   ];
//   return (
//     <Card>
//       <Card.Header className="card-header">
//         <h4 className="card-title">Total Transactions</h4>
//       </Card.Header>
//       <Card.Body className="card-body pb-0">
//         <Row>
//           {request?.map((requests) => (
//             <Col sm={12} md={6} lg={6} xl={4} key={Math.random()}>
//               <Card
//                 className={`card bg-${requests?.color} img-card box-${requests?.color}-shadow`}
//               >
//                 <Card.Body className="">
//                   <div className="d-flex">
//                     <div className="text-white">
//                       <h2 className="mb-0 number-font">{requests?.data}</h2>
//                       <p className="text-white mb-0">{requests?.data1} </p>
//                     </div>
//                     <div className="ms-auto">
//                       <i
//                         className={`fa ${requests?.icon} text-white fs-30 me-2 mt-2`}
//                       ></i>
//                     </div>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Card.Body>
//     </Card>
//   );
// };

// export default DashboardStatCard;

// DashboardStatCard.js
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

const DashboardStatCard = ({ getData, isLoading }) => {
  console.log(isLoading, "isLoading");

  const FetchmannegerList = async () => {
    try {
      const response = await getData(`/company/auto-report/list`);

      if (response && response.data) {
        console.log(response.data, "response.data");
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  // useEffect(() => {
  //   FetchmannegerList();
  // }, []);

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
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentDateTime.toLocaleString();
console.log(formattedDateTime, "formattedDateTime");
  return (
    <Card>
      <Card.Header className="card-header">
        <h4 className="card-title">
        {/* Live Data{" "} */}
          <img
            src={require("../../assets/images/commonimages/LiveIMg.gif")}
            alt="Live Img"
            className="Liveimage"
          />{" "}{" "} Last Updated On : (03-09-2024 11:15 PM) 
    {/* ({formattedDateTime}) */}
        </h4>
      </Card.Header>
      <Card.Body className="card-body pb-0">
        <Row>
          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[0].color} img-card box-${request[0].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font">{request[0].data}</h2>
                    <p className="text-white mb-0">{request[0].data1}</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[0].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[1].color} img-card box-${request[1].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font">{request[1].data}</h2>
                    <p className="text-white mb-0">{request[1].data1}</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[1].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[2].color} img-card box-${request[2].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font">{request[2].data}</h2>
                    <p className="text-white mb-0">{request[2].data1}</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[2].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[3].color} img-card box-${request[3].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font">{request[3].data}</h2>
                    <p className="text-white mb-0">{request[3].data1}</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[3].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[4].color} img-card box-${request[4].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font">{request[4].data}</h2>
                    <p className="text-white mb-0">{request[4].data1}</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[4].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[5].color} img-card box-${request[5].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font">{request[5].data}</h2>
                    <p className="text-white mb-0">{request[5].data1}</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[5].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DashboardStatCard;
