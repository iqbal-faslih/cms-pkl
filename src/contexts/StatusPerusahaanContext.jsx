/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";
import { usePerusahaanProfileStatus } from "../hooks/perusahaan/status/usePerusahaanProfileStatus";

export const StatusPerusahaanContext = createContext();

export const StatusPerusahaanProvider = ({ children }) => {
  const value = usePerusahaanProfileStatus();

  return (
    <StatusPerusahaanContext.Provider value={value}>
      {children}
    </StatusPerusahaanContext.Provider>
  );
};
