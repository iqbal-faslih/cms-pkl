import AuthLayout from "../layout/AuthLayout";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import SelectAuth from "../pages/Auth/SelectAuth";
import GoogleCallback from "../pages/Auth/GoogleCallback";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerificationCode from "../pages/Auth/VerificationCode";
import SetPassword from "../pages/Auth/SetPassword";

export default {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "select", element: <SelectAuth /> },
    { path: "google/callback", element: <GoogleCallback /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "verification", element: <VerificationCode /> },
    { path: "set-password", element: <SetPassword /> }
  ],
};
