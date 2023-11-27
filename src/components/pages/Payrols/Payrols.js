import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { format, parse, addDays, differenceInCalendarWeeks } from "date-fns";
import { enUS } from "date-fns/locale";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Card, Col, Row } from "react-bootstrap";

const validationSchema = Yup.object().shape({
  // users: Yup.array().of(
  //   Yup.object().shape({
  //     Weeks: Yup.object().shape({
  //       role: Yup.string().required("Role is required"),
  //       startTime: Yup.string().required("Start time is required"),
  //       endTime: Yup.string().required("End time is required"),
  //       budget: Yup.number().required("Budget is required"),
  //       forecast: Yup.number().required("Forecast is required"),
  //     }),
  //   })
  // ),
});

const getWeekDays = (startDate) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    days.push(currentDate.toLocaleDateString());
  }
  return days;
};

const generateUniqueId = (prefix, rowIndex, colIndex) => {
  return `${prefix}_${rowIndex}_${colIndex}`;
};

const generateInputId = (fieldName, rowIndex) => {
  return `${fieldName}_${rowIndex}`;
};

const generateTableId = (fieldName, rowIndex, colIndex) => {
  return `${fieldName}_${rowIndex}_${colIndex}`;
};

const initialValues = {

  users: [
    {
      username: "User4",
      Weeks: {
        "24/11/2023": [{
          differentId: 1,
          role: "",
          startTime: "",
          endTime: "",
          budget: 0,
          forecast: 0,
        }],
        "25/11/2023": [{
          differentId: 1,
          role: "",
          startTime: "",
          endTime: "",
          budget: 0,
          forecast: 0,
        }],
        "26/11/2023": [{
          differentId: 1,
          role: "",
          startTime: "",
          endTime: "",
          budget: 0,
          forecast: 0,
        }],

      },
    },
    {
      username: "User5",
      Weeks: {
        "24/11/2023": [{
          differentId: 1,
          role: "",
          startTime: "",
          endTime: "",
          budget: 0,
          forecast: 0,
        }],
        "25/11/2023": [{
          differentId: 1,
          role: "",
          startTime: "",
          endTime: "",
          budget: 0,
          forecast: 0,
        }],
        "26/11/2023": [{
          differentId: 1,
          role: "",
          startTime: "",
          endTime: "",
          budget: 0,
          forecast: 0,
        }],
      },
    },
    {
      username: "User6",
      Weeks: {
        "24/11/2023": [{
          differentId: 1,
          role: "",
          startTime: "",
          endTime: "",
          budget: 0,
          forecast: 0,
        }],
        "25/11/2023": [{
          differentId: 1,
          role: "",
          startTime: "",
          endTime: "",
          budget: 0,
          forecast: 0,
        }],
        "26/11/2023": [{
          differentId: 1,
          role: "",
          startTime: "",
          endTime: "",
          budget: 0,
          forecast: 0,
        }],
      },
    },
    // Additional rows
  ],
};

const roles = ["Admin", "Manager", "Employee", "Intern"];

const MyForm = () => {
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [numberOfWeeks, setNumberOfWeeks] = useState(4); // Default value, adjust as needed

  const weekDays = getWeekDays(currentWeekStartDate);

  console.log(weekDays, "weekdays");

  const handleSubmit1 = (values) => {
    // Handle submission logic here
    console.log("Submitted Values:", values);
    // You can assign unique IDs and log individual inputs
    values.users.forEach((user, rowIndex) => {
      Object.keys(user.Weeks).forEach((fieldName, colIndex) => {
        const inputId = generateInputId(fieldName, rowIndex);
        console.log(`Input ID: ${inputId}, Value: ${user.Weeks[fieldName]}`);
      });
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleSubmit1(values);
    },
  });



  console.log(formik?.values, "formikvalues");

  const handleNextWeek = () => {
    const nextWeekStartDate = new Date(currentWeekStartDate);
    nextWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
    setCurrentWeekStartDate(nextWeekStartDate);
    setSelectedWeek(selectedWeek + 1);
  };

  const handlePreviousWeek = () => {
    const previousWeekStartDate = new Date(currentWeekStartDate);
    previousWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
    setCurrentWeekStartDate(previousWeekStartDate);
    setSelectedWeek(selectedWeek - 1);
  };

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value, 10);
    setSelectedMonth(selectedMonth);

    // Recalculate the number of weeks in the selected month
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      selectedMonth,
      1
    );
    const lastDayOfMonth = new Date(
      new Date().getFullYear(),
      selectedMonth + 1,
      0
    );
    const weeksInMonth =
      differenceInCalendarWeeks(lastDayOfMonth, firstDayOfMonth) + 1;

    // Update the number of weeks and selected week
    setNumberOfWeeks(weeksInMonth);
    setSelectedWeek(0);
  };

  const handleWeekChange = (event) => {
    const selectedWeek = parseInt(event.target.value, 10);
    setSelectedWeek(selectedWeek);

    // Calculate the start date of the selected week
    const startOfWeek = addDays(currentWeekStartDate, selectedWeek * 7);

    // Check if the start date falls into a different month
    if (startOfWeek.getMonth() !== selectedMonth) {
      setSelectedMonth(startOfWeek.getMonth());
    }

    // Other logic to fetch data for the selected week
  };

  // Assuming you have a dummy array of cost forecast data
  const costForecastData = [100, 150, 200, 180, 220, 250, 300, 280, 300];

  return (

    <>

      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header className=" d-block">
              <div className="d-flex justify-content-between">
                <div className=" d-flex">
                  <h3 className="card-title d-flex">Payrol </h3>
                </div>
                <div className="">
                  <button
                    className="btn btn-primary"
                    style={{ marginLeft: "10px" }}
                    type="button"
                    onClick={handlePreviousWeek}
                  >
                    <ArrowBackIosIcon />
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary ms-2"
                    onClick={handleNextWeek}
                  >
                    <ArrowForwardIosIcon />
                  </button>
                </div>
              </div>

            </Card.Header>
            <Card.Body className="w-100 ">

              <div className="container-fluid">
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="monthDropdown" className="form-label">
                      Select Month:
                    </label>
                    <select
                      id="monthDropdown"
                      className="form-select"
                      onChange={handleMonthChange}
                      value={selectedMonth}
                    >
                      {Array.from({ length: 12 }).map((_, index) => (
                        <option key={index} value={index}>
                          {new Date(0, index).toLocaleDateString(undefined, {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>



                  <div className="mb-3">
                    <label htmlFor="weekDropdown" className="form-label">
                      Select Week:
                    </label>
                    <select
                      id="weekDropdown"
                      className="form-select"
                      onChange={handleWeekChange}
                      value={selectedWeek}
                    >
                      {Array.from({ length: 4 }).map((_, index) => {
                        const startOfWeek = addDays(currentWeekStartDate, index * 7);
                        const formattedDate = format(startOfWeek, "dd/MM/yyyy");
                        const dayName = format(startOfWeek, "EEEE");

                        return (
                          <option key={index} value={index}>
                            Week {index + 1} - {formattedDate} ({dayName})
                          </option>
                        );
                      })}
                    </select>
                  </div>


                  <div className="table-width">
                    <table className="pay-role-table table-responsive">
                      <thead>
                        <tr>
                          <th className="pay-role-custom-header" style={{ backgroundColor: "#6259ca !impotent" }}>Usernames</th>
                          <th className="pay-role-custom-header">Budget</th>
                          <th className="pay-role-custom-header">Forecast</th>
                          {weekDays.map((day, index) => {
                            const parsedDate = parse(day, "dd/MM/yyyy", new Date());
                            const formattedDate = format(parsedDate, "EEE", {
                              locale: enUS,
                            });

                            return (
                              <th key={index} className=" m-0 p-0">
                                <div
                                  // className=" "
                                  className="d-flex flex-column pay-role-custom-header"
                                >
                                  <span>{day} ({formattedDate})</span>
                                  <span></span>
                                </div>
                              </th>
                            );
                          })}
                        </tr>

                        <tr >
                          <th className="pay-role-custom-header"
                          //  style={{ width: "13%" }}
                          >Cost Forecast</th>
                          {costForecastData.map((cost, index) => (
                            <th style={{
                              // width: "13%", 
                              borderRight: "1px dotted #6259ca", borderBottom: "1px dotted #6259ca"
                            }}>
                              <span key={index}>{`$${cost}`}</span>
                            </th>
                          ))}
                        </tr>

                        <tr >
                          <th className="pay-role-custom-header"
                          // style={{ width: "10%", }}
                          >Hours</th>
                          {costForecastData.map((cost, index) => (
                            <th style={{
                              // width: "10%",
                              borderRight: "1px dotted #6259ca", borderBottom: "1px dotted #6259ca"
                            }}>
                              <span key={index}>{`$${cost}`}</span>
                            </th>
                          ))}
                        </tr>
                        <tr style={{ borderBottom: "1px dotted black" }}>
                          <th className="pay-role-custom-header "
                          // style={{ width: "10%", }}
                          >Salaries</th>
                          {costForecastData.map((cost, index) => (
                            <th style={{
                              // width: "10%", 
                              borderRight: "1px dotted #6259ca", borderBottom: "1px dotted #6259ca"
                            }}>
                              <span key={index}>{`$${cost}`}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>




                      <tbody>
                        <div className=" py-5"></div>
                        {formik.values.users.map((user, rowIndex) => (
                          <tr key={rowIndex} className=" my-2 py-2">
                            <td>
                              <span className="input-102 ">
                                {user.username}
                              </span>
                              <div className="d-flex  mb-6" style={{ minWidth: "200px", gap: "14px" }}>
                                <input
                                  type="text"
                                  className="input101 "
                                  name={`users[${rowIndex}].Weeks.startTime`}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.users[rowIndex].Weeks.startTime}
                                  id={generateTableId("startTime", rowIndex)}
                                />
                                <input
                                  type="text"
                                  className="input101 ms-2"
                                  name={`users[${rowIndex}].Weeks.endTime`}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.users[rowIndex].Weeks.endTime}
                                  id={generateTableId("endTime", rowIndex)}

                                />
                              </div>
                            </td>

                            <td className="pay-role-input-field " style={{ minWidth: "200px" }}>
                              <span className="input-102"></span>
                              <input
                                type="number"
                                className="input101 mb-6"
                                placeholder="Enter Budget"
                                name={`users[${rowIndex}].budget`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.users[rowIndex].budget}
                                id={generateInputId("budget", rowIndex)}
                              />
                            </td>

                            <td className="pay-role-input-field " style={{ minWidth: "200px" }}>
                              <span className="input-102 "></span>
                              <input
                                type="number"
                                className="input101 mb-6"
                                placeholder="Enter Forecast"
                                name={`users[${rowIndex}].forecast`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.users[rowIndex].forecast}
                                id={generateInputId("forecast", rowIndex)}
                              />
                            </td>

                            {weekDays.map((day, colIndex) => (
                              <td className="pay-role-input-field" key={colIndex} style={{ minWidth: "200px" }}>
                                <label className="w-100">
                                  <select
                                    name={`users[${rowIndex}].Weeks.[${day}][0].role`}
                                    className={`input101  ${formik?.errors?.users && formik?.touched?.users
                                      ? "is-invalid"
                                      : ""
                                      }`}
                                    onChange={formik?.handleChange}
                                    onBlur={formik?.handleBlur}
                                    value={formik?.values?.users?.[rowIndex]?.Weeks?.[day]?.[0].role}
                                    id={generateTableId("role", rowIndex, colIndex)}
                                  >
                                    <option value="" label="Select a role" />
                                    {roles?.map((role) => (
                                      <option key={role} value={role}>
                                        {role}
                                      </option>
                                    ))}
                                  </select>
                                </label>

                                {/* <br /> */}
                                <div className="d-flex gap-2 mb-6" >
                                  <input
                                    type="time"
                                    className="input101"
                                    // style={{ maxWidth: "90px" }}

                                    // style={{ maxWidth: "94px" }}
                                    name={`users[${rowIndex}].Weeks.[${day}][0].startTime`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik?.values?.users?.[rowIndex]?.Weeks?.[day]?.[0].startTime}
                                    id={generateTableId("startTime", rowIndex, colIndex)}
                                  />

                                  <input
                                    type="time"
                                    // style={{ maxWidth: "90px" }}

                                    // style={{ maxWidth: "94px" }}
                                    className="input101 "
                                    placeholder="exit Time"
                                    name={`users[${rowIndex}].Weeks.[${day}][0].endTime`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik?.values?.users?.[rowIndex]?.Weeks?.[day]?.[0].endTime}
                                    id={generateTableId("endTime", rowIndex, colIndex)}
                                  />
                                </div>

                                {/* <br /> */}
                              </td>
                            ))}
                          </tr>
                        ))}
                        <div className=" py-2"></div>
                      </tbody>

                    </table>
                  </div>

                  <div className="text-end mt-4">
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
                  </div>
                </form >
              </div >

            </Card.Body>
          </Card>
        </Col >
      </Row >

    </>
  );
};

export default MyForm;
