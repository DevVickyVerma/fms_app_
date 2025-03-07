import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";

const ManageUser = (props) => {
  const { isLoading, getData } = props;
  const [data, setData] = useState();

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your 2FA will get disable",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Disable it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Disable2FA(id);
      }
    });
  };

  const Disable2FA = async (id) => {
    try {
      const response = await getData(`/user/disable/two-factor?user_id=${id}`);

      if (response && response.data && response.data.data) {
        localStorage.setItem("two_factor", "false");
        handleFetchData();
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const handleFetchData = async () => {
    try {
      const response = await getData("/user/2fa-list");

      if (response && response.data && response.data.data) {
        setData(response?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      //  width: "10%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Full Name",
      selector: (row) => [row.full_name],
      sortable: false,
      //  width: "30%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.full_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Role",
      selector: (row) => [row.role],
      sortable: false,
      //  width: "25%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.role}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Email",
      selector: (row) => [row.email],
      sortable: false,
      //  width: "20%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
          // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.email}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      center: true,
      //  width: "15%",
      cell: (row) => (
        <span className="text-center">
          <button
            type="btn"
            className="btn btn-danger mx-4"
            onClick={() => handleDelete(row.id)}
          >
            Disable
          </button>
        </span>
      ),
    },
  ];

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Manage 2FA Authentication</h1>
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
                Manage Authentication
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Manage Authentication</h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <div className="table-responsive deleted-table mobile-first-table">
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader={true}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead={true}
                        highlightOnHover={true}
                        responsive={true}
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
      </>
    </>
  );
};

export default withApi(ManageUser);
