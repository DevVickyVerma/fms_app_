import React, { createContext, useContext, useState } from "react";

// Create the context
const MyContext = createContext();

// Create the provider component
const MyProvider = ({ children }) => {
  const [testIsWorking, settestIsWorking] = useState(false);
  const [searchdata, setSearchdata] = useState({});
  const [GrossMarginValue, setGrossMarginValue] = useState();
  const [GrossProfitValue, setGrossProfitValue] = useState();
  const [FuelValue, setFuelValue] = useState();
  const [GrossVolume, setGrossVolume] = useState();
  const [shopsale, setshopsale] = useState();
  const [shopmargin, setshopmargin] = useState();
  const [piechartValues, setpiechartValues] = useState();
  const [LinechartValues, setLinechartValues] = useState([]);
  const [LinechartOption, setLinechartOption] = useState();
  const [DLinechartValues, setDLinechartValues] = useState([]);
  const [DLinechartOption, setDLinechartOption] = useState();
  const [stackedLineBarData, setStackedLineBarData] = useState([]);
  const [stackedLineBarLabels, setStackedLineBarLabel] = useState();
  const [getSiteDetailsLoading, setGetSiteDetailsLoading] = useState(false)

  // Value object to provide to consumers
  const value = {
    testIsWorking,
    settestIsWorking,
    searchdata,
    setSearchdata,
    GrossMarginValue,
    setGrossMarginValue,
    GrossProfitValue,
    setGrossProfitValue,
    FuelValue,
    setFuelValue,
    GrossVolume,
    setGrossVolume,
    shopsale,
    setshopsale,
    shopmargin,
    setshopmargin,
    piechartValues,
    setpiechartValues,
    LinechartValues,
    setLinechartValues,
    LinechartOption,
    setLinechartOption,
    DLinechartValues,
    setDLinechartValues,
    DLinechartOption,
    setDLinechartOption,
    stackedLineBarData,
    setStackedLineBarData,
    stackedLineBarLabels,
    setStackedLineBarLabel,
    getSiteDetailsLoading, setGetSiteDetailsLoading
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

// Custom hook to access the context
const useMyContext = () => {
  return useContext(MyContext);
};

export { MyProvider, useMyContext };
