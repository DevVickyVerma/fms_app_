import React, { useEffect, useState } from "react";
import TreeView from "deni-react-treeview";
import { Breadcrumb, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorAlert } from "../../../Utils/ToastUtils";

export default function Treeview(props) {
  const { isLoading, getData, postData } = props;
  const navigate = useNavigate();

  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }

  const { id } = useParams();

  useEffect(() => {
    try {
      GetSiteData();
    } catch (error) {
      handleError(error);
    }
    console.clear();
  }, [id]);
  const GetSiteData = async () => {
    try {
      const response = await getData(`/payroll/setup/${id}`);

      if (response) {
        console.log(response, "columnIndex");

        // setDropdownValue(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  //treeview1
  const treeview1 = [
    {
      id: 1,
      text: "Structure",
      children: [
        {
          id: 2,
          text: "Company",
          isLeaf: true,
          children: [
            {
              id: 3,
              text: "Sites",
              isLeaf: true,
              children: [
                {
                  id: 4,
                  text: "Sites1",
                  isLeaf: true,
                },
                {
                  id: 5,
                  text: "Sites2",
                  isLeaf: true,
                },
                {
                  id: 6,
                  text: "Sites3",
                  isLeaf: true,
                },
                {
                  id: 7,
                  text: "Sites4",
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          id: 19,
          text: "Company2",
          isLeaf: true,
          children: [
            {
              id: 20,
              text: "Sites0",
              isLeaf: true,
              children: [
                {
                  id: 21,
                  text: "Sites1",
                  isLeaf: true,
                },
                {
                  id: 22,
                  text: "Sites2",
                  isLeaf: true,
                },
                {
                  id: 23,
                  text: "Sites3",
                  isLeaf: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  const [selectedNode, setSelectedNode] = useState(null);
  console.log(selectedNode, "selectedNode");

  // ... (rest of the code remains the same)

  const handleNodeSelect = (item) => {

    console.log(item, "item");
    // Update the state with the selected node information
    setSelectedNode(item);
  };

  const handleSubmit = () => {
    // Check if selectedNode is not null before accessing its properties
    if (selectedNode) {
      // Log the selected text and id to the console
      console.log("Selected Text:", selectedNode.text);
      console.log("Selected ID:", selectedNode.id);
    } else {
      console.error("No node selected");
    }
  };
  const modifiedTreeview1 = treeview1.map((node) => {
    if (node.id === 1 && node.text === "Structure") {
      // If it's the node to hide the checkbox, set showCheckbox to false
      return { ...node, showCheckbox: false };
    } else {
      // Otherwise, leave the node unchanged
      return node;
    }
  });
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Setup Payroll</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Setup Payroll
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <div className="main-content-label mg-b-5">Setup Payroll</div>

              <Row>
                <Col className=" mt-4 mt-lg-0" lg={6} xl={4}>
                  <ul id="tree3" className="tree">
                    <li className="branch">
                      <TreeView
                        id="treeview1"
                        style={{ height: "auto" }}
                        showIcon={false}
                        showCheckbox={true}
                        className="branch"
                        items={modifiedTreeview1}
                        theme={"purple"}
                        onSelect={handleNodeSelect}
                      />
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <button
                variant="primary"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
