import { useState, useRef, useEffect } from "react";
import CreateNewPasswordPage from "./NewPassword";
import { useVerifyCode } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VerificationCode() {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const email = sessionStorage.getItem("resetEmail");
  const navigate = useNavigate();

  const { verifyHandler, resendCode, loading, verified, resendLoading } = useVerifyCode();

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = () => verifyHandler({ email, otp: code.join("") });
  const handleResend = () => resendCode({ email });

  const isCodeComplete = code.every((d) => d !== "");

    useEffect(() => {
    if (!email) {
      toast.error("Silahkan isi email terlebih dahulu")
      navigate("/auth/forgot-password");
    } else {
      inputRefs.current[0]?.focus();
    }
  }, [email, navigate]);

  if (verified) return <CreateNewPasswordPage />;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img
            src="/assets/Auth/Password.png"
            alt="Verification Illustration"
            className="h-64 object-contain"
          />
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">Masukkan Kode Verifikasi</h1>

        <div className="flex justify-center gap-3 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              aria-label={`Digit ${index + 1}`}
              className="w-16 h-16 text-2xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <p className="text-center text-gray-600 mb-6">
          Kami telah mengirimkan kode verifikasi ke email: <br />
          <span className="text-blue-500 font-medium">{email}</span>
        </p>

        <button
          onClick={onSubmit}
          disabled={!isCodeComplete || loading}
          className={`w-full py-3 rounded-md text-white font-medium mb-4 ${
            isCodeComplete && !loading
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Memverifikasi..." : "Verifikasi"}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Tidak menerima kode?{" "}
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-blue-500 ml-1 hover:underline focus:outline-none"
            >
              {resendLoading ? "Mengirim ulang kode" : "Kirim Ulang"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
