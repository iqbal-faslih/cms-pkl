import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../helpers/apiClient";
import { extractErrorMessage } from "../helpers/extractErrorMessage";

const useSendOtp = () => {
  const [ loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtpHandler = async ({ email }) => {
    if (!email) {
      toast.error("Email harus diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp({ email });
      toast.success(res.data.message);
      sessionStorage.setItem("resetEmail", email);
      navigate("/auth/verification");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp: sendOtpHandler, loading };
};

export default useSendOtp;