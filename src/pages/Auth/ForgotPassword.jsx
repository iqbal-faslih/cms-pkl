import { useForm } from "react-hook-form";
import { useSendOtp } from "../../hooks";

export default function ForgotPassword() {
  const { sendOtp, loading } = useSendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ email }) => {
    sendOtp({ email });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6 flex flex-col items-center">
        <div className="mb-6">
          <img
            src="/assets/Auth/ForgotPassword.png"
            alt="Forgot Password"
            className="w-64 h-64 object-contain"
          />
        </div>

        <h1 className="text-3xl font-bold text-center mb-4">Lupa Password?</h1>
        <p className="text-center text-gray-600 mb-6">
          Masukkan email kamu untuk menerima kode verifikasi.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mb-4">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-gray-100 p-2 flex items-center justify-center">
                <i className="bi bi-envelope-fill text-gray-500 text-lg" />
              </div>
              <input
                type="email"
                required
                placeholder="Masukkan Email"
                className="flex-1 p-2 outline-none"
                {...register("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email tidak valid",
              },
            })}
              />
            </div>
            {errors.email && (
            <p className="text-sm text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md font-medium text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </form>
      </div>
    </div>
  );
}
