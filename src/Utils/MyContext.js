import React, { createContext, useContext, useState } from "react";

// Create the context
const MyContext = createContext();

// Create the provider component
const MyProvider = ({ children }) => {
  const [testIsWorking, settestIsWorking] = useState(false);
  const [searchdata, setSearchdata] = useState({});

  // Value object to provide to consumers
  const value = {
    testIsWorking,
    settestIsWorking,
    searchdata,
    setSearchdata,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

// Custom hook to access the context
const useMyContext = () => {
  return useContext(MyContext);
};

export { MyProvider, useMyContext };
