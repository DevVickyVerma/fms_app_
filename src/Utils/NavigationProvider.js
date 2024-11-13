import React, { createContext, useContext, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigation = () => {
  return useContext(NavigationContext);
};

export const NavigationProvider = ({ children }) => {
  const location = useLocation();
  const lastPathRef = useRef(null); // Create a ref to store the last path

  // Update the ref with the current path before it changes
  useEffect(() => {
    lastPathRef.current = location.pathname;
  }, [location.pathname]); // This effect will run whenever the path changes

  return (
    <NavigationContext.Provider value={{ lastPath: lastPathRef.current }}>
      {children}
    </NavigationContext.Provider>
  );
};
