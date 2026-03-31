import { createContext } from "react";

export const AuthContext = createContext({
  token: null,
  user: null,
  role: null,
  tempRegisterData: null,
  isLoadingUser: false, 
  setToken: () => {},
  setUser: () => {},
  setRole: () => {},
  setTempRegisterData: () => {},
  getUser: () => {}, 
});