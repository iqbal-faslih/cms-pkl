import { useState } from "react";
import { toast } from "react-toastify";
import { verifyCode, sendOtp } from "../helpers/apiClient";
import { extractErrorMessage } from "../helpers/extractErrorMessage";

const useVerifyCode = () => {
    const [ loading, setLoading ] = useState(false);
    const [ verified, setVerified ] = useState(false);
    const [ resendLoading, setResendLoading ] = useState(false);

    const verifyHandler = async ({ email, otp }) => {
        if(!otp || otp.length < 4) {
            toast.error("Kode OTP harus 4 digit")
            return;
        }

        setLoading(true);
        try {
            const res = await verifyCode({ email, otp });

            if (res.data?.meta?.status === "success") {
                toast.success("Kode verifikasi berhasil!");
                sessionStorage.setItem("resetOtp", otp);
                setVerified(true);
            } else {
                toast.error(res.data.message || "Kode verifikasi salah.");
            } 
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    const resendCode = async ({ email }) => {
        setResendLoading(true);
        try {
            const res = await sendOtp({ email });
            toast.success(res.data.message || "Kode verifikasi baru telah dikirim.");
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setResendLoading(false);
        }
    };

  return { verifyHandler, resendCode, loading, verified, resendLoading };
}

export default useVerifyCode;