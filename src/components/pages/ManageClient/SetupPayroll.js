import React, { useEffect, useRef, useState } from "react";
import TreeView from "deni-react-treeview";
import { Breadcrumb, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorAlert } from "../../../Utils/ToastUtils";

export default function Treeview(props) {
  const { isLoading, getData, postData } = props;
  const navigate = useNavigate();
  const [treeview1, setCompanyList] = useState([]);
  const [treeview2, setCompanyList2] = useState([]);
  const [data, setData] = useState([]);
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
        console.log(response?.data?.data?.companies, "columnIndex");
        setCompanyList(response?.data?.data?.companies);
        setCompanyList2(response?.data?.data?.roles);
        setData(response?.data?.data);
        // setDropdownValue(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  // const handleSubmit = () => {
  //   const selectedItem = treeviewRef.current.api.getSelectedItem();
  //   const selectedItem2 = treeviewRef2.current.api.getSelectedItem();

  //   // Assuming you have an array to store selected items
  //   const selectedItemsArray = []; // Initialize or manage this array based on your component state

  //   if (selectedItem) {
  //     console.log(selectedItem, "selectedItem3");
  //     console.log("Selected Node ID:", selectedItem.id);

  //     // Push the selected item into the array
  //     selectedItemsArray.push(selectedItem);
  //   } else {
  //     console.error("No node selected");
  //   }
  // };
  const handleSubmit = async (event, values) => {
    // event.preventDefault();

    try {
      const formData = new FormData();
      const selectedItem = treeviewRef.current.api.getSelectedItem();
      const selectedItem2 = treeviewRef2.current.api.getSelectedItem();
      formData.append("company_id[0]", selectedItem.id);
      if (selectedItem && selectedItem.children) {
        selectedItem.children.forEach((child, index) => {
          formData.append(`site_id[${index}]`, child.id);
        });
      }
      formData.append("roles[0]", selectedItem2.id);
      if (selectedItem2 && selectedItem2.children) {
        selectedItem2.children.forEach((child, index) => {
          formData.append(`users[${index}]`, child.id);
        });
      }
      formData.append("client_id", id);

      const postDataUrl = "/payroll/save-setup";
      const navigatePath = `/clients`;

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {}
  };

  const modifiedTreeview2 = treeview2.map((node) => {
    if (node.id === 1 && node.text === "Structure") {
      // If it's the node to hide the checkbox, set showCheckbox to false
      return { ...node, showCheckbox: false };
    } else {
      // Otherwise, leave the node unchanged
      return node;
    }
  });

  const [selectedNode, setSelectedNode] = useState(null);
  console.log(selectedNode, "selectedNode");

  // ... (rest of the code remains the same)

  const handleNodeSelect = (item) => {
    console.log(item, "item");
    // Update the state with the selected node information
    setSelectedNode(item);
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const onSelectItem = (item) => {
    console.log(item, "Selected item changed");

    // Assuming you want to store all selected items
    setSelectedItems((prevSelectedItems) => {
      // Check if the item is already in the array to avoid duplicates
      const isAlreadySelected = prevSelectedItems.some(
        (selectedItem) => selectedItem.id === item.id
      );

      if (isAlreadySelected) {
        // Item is deselected, remove it from the array
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem.id !== item.id
        );
      } else {
        // Item is selected, add it to the array
        return [...prevSelectedItems, item];
      }
    });
  };

  // Create a ref for the TreeView component
  const treeviewRef = useRef();
  const treeviewRef2 = useRef();
  const [checkedItems, setCheckedItems] = useState([]);

  const handleChecked = (item, checked) => {
    // Update the checked state
    if (checked) {
      setCheckedItems([...checkedItems, item.id]);
    } else {
      setCheckedItems(checkedItems.filter((checkedItem) => checkedItem !== item.id));
    }
  };


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
              linkAs={Link}
              linkProps={{ to: "/clients" }}
            >
              Clients
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
              <div className="main-content-label mg-b-5">
                Setup Payroll = {data?.text}
              </div>
              <Row>
                <Col className=" mt-4 mt-lg-0" lg={6} xl={4}>
                  <Card>
                    <Card.Header>Company</Card.Header>
                    <Card.Body>
                      <ul id="tree3" className="tree">
                        <li className="branch">
                        <TreeView
      id="treeview1"
      style={{ height: 'auto' }}
      showIcon={false}
      showCheckbox={true}
      className="branch"
      items={treeview1}
      theme="purple"
      onChecked={handleChecked}
      onSelectItem={onSelectItem}
    />
                        </li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
                <Col className=" mt-4 mt-lg-0" lg={6} xl={4}>
                  <Card>
                    <Card.Header>Company</Card.Header>
                    <Card.Body>
                      <ul id="tree4" className="tree">
                        <li className="branch">
                          <TreeView
                            id="treeview2"
                            style={{ height: "auto" }}
                            showIcon={false}
                            showCheckbox={true}
                            className="branch"
                            items={modifiedTreeview2}
                            theme={"purple"}
                            ref={treeviewRef2} // Use the ref for the second TreeView
                          />
                        </li>
                      </ul>
                    </Card.Body>
                  </Card>
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
