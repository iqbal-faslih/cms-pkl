import { useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { api } from "../helpers/apiClient";

export default function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => {
    return sessionStorage.getItem("token") || localStorage.getItem("token");
  });

  const [user, setUser] = useState(() => {
    const stored =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [role, setRole] = useState(() => {
    return (
      sessionStorage.getItem("role") || localStorage.getItem("role") || null
    );
  });

  const [errors, setErrors] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [tempRegisterData, setTempRegisterData] = useState(null);

  const setToken = (newToken, remember = false) => {
    setErrors(null);
    setTokenState(newToken);

    const storage = remember ? localStorage : sessionStorage;

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    if (newToken) {
      storage.setItem("token", newToken);
    }
  };

  const persistUserData = (userData, roleData, remember = false) => {
    setUser(userData);
    setRole(roleData);

    const storage = remember ? localStorage : sessionStorage;

    localStorage.removeItem("user");
    localStorage.removeItem("role");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");

    storage.setItem("user", JSON.stringify(userData));
    storage.setItem("role", roleData);
  };

  const getUser = useCallback(async () => {
    if (!token) return;

    setIsLoadingUser(true);
    setErrors(null);

    try {
      const response = await api.get("/get-user");

      const data = response.data;

      if (response.data.meta?.status === "success") {
        const userData = data.data.user;
        const roleData = data.data.role;
        const remember = !!localStorage.getItem("token");

        persistUserData(userData, roleData, remember);
      } else {
        setErrors(data.errors || { error: data.error });
      }
    } catch (err) {
      console.error("Gagal ambil data user:", err);
      setErrors({ error: "Gagal terhubung ke server" });
    } finally {
      setIsLoadingUser(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token, getUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        role,
        setRole,
        errors,
        tempRegisterData,
        setTempRegisterData,
        isLoadingUser,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
