import React from 'react'
import DashTopSubHeading from './DashTopSubHeading'
import { Breadcrumb } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const DashBoardSubChild = () => {
  return (
    <>
        <div className="page-header ">
        <div>
          <h1 className="page-title">DashBoard Sub Child</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard" }}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard-details" }}
            >
              Dashboard Child
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              DashBoard Sub Child
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

      </div>
   
    <div>
        <DashTopSubHeading />
    </div>
    </>
  )
}

export default DashBoardSubChild