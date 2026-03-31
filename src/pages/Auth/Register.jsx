import FloatingLabelInput from "../../components/FloatingLabelInput";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin, useRegister } from "../../hooks";
import TermsModal from "../../components/modal/TermsModal";
import useTermsModal from "../../stores/useTermsModal";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const {
    register: registerUser,
    loading,
    getPasswordStrength,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = useRegister();

  const { loginWithGoogle, loadingGoogle } = useLogin();

  const watchPassword = watch("password", "");
  const passwordStrength = getPasswordStrength(watchPassword);

  const [termsChecked, setTermsChecked] = useState(false);
  const { openModal } = useTermsModal();

  const onSubmit = async (data) => {
    if (!termsChecked) {
      return;
    }

    await registerUser(data);
  };

  return (
    <div className="w-full min-h-screen xl:h-screen relative flex xl:flex xl:flex-row flex-col gap-5 overflow-hidden p-10 xl:p-0 items-center">
      <div className="relative overflow-hidden hidden xl:block flex-1">
        <motion.div
          initial={{ translateX: -400 }}
          animate={{ translateX: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden xl:block"
        >
          <img
            src="/assets/Auth/Shape_blue.png"
            alt="ShapeBlue"
            className="w-full h-screen"
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="hidden xl:block absolute -translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2 z-20"
        >
          <img
            src="/assets/Auth/ilustrationAuth.png"
            alt="Ilustrasi Auth"
            className="w-md"
          />
        </motion.div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="flex justify-center items-center pt-10 xl:w-1/2 max-h-screen overflow-y-auto scrollbar-hide"
      >
        <div className="py-10 px-12 rounded-[10px] shadow-lg">
          <div className="space-y-2 mb-2 w-md">
            <div className="flex items-center justify-center mb-3">
              <img src="/assets/img/Logo.png" alt="Logo" className="size-14" />
              <div className="mt-2 flex items-center gap-1">
                <p className="font-bold text-lg">Manajemen</p>
                <p className="font-bold text-lg text-[#0069AB]">Magang</p>
              </div>
            </div>
            <h1 className="text-lg text-center md:text-xl xl:text-2xl font-bold text-gray-800">
              Buat Akun
            </h1>
            <p className="text-gray-500 text-xs text-center hidden md:block">
              Untuk melanjutkan proses pendaftaran, silakan lengkapi informasi
              berikut dengan benar.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <FloatingLabelInput
              label="Email"
              type="email"
              placeholder="Masukkan alamat email kamu"
              icon="bi-envelope"
              error={errors.email}
              {...register("email", {
                required: "Email wajib diisi",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  message: "Format email tidak valid",
                },
              })}
            />

            <div className="relative">
              <FloatingLabelInput
                label="Kata Sandi"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi"
                icon="bi-lock"
                error={errors.password}
                showPasswordToggle={true}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                {...register("password", {
                  required: "Kata sandi wajib diisi",
                  minLength: {
                    value: 8,
                    message: "Minimal 8 karakter",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                    message:
                      "Password harus mengandung huruf besar, kecil, angka, dan simbol",
                  },
                })}
              />

              {watchPassword && (
                <div className="mt-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${passwordStrength.color} transition-all duration-300`}
                        style={{
                          width:
                            passwordStrength.label === "Weak"
                              ? "33%"
                              : passwordStrength.label === "Moderate"
                              ? "66%"
                              : "100%",
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <FloatingLabelInput
              label="Konfirmasi Kata Sandi"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi kata sandi"
              icon="bi-lock"
              error={errors.password_confirmation}
              showPasswordToggle={true}
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              {...register("password_confirmation", {
                required: "Konfirmasi kata sandi wajib diisi",
                validate: (value) => {
                  const password = watch("password");
                  return value === password || "Password tidak cocok";
                },
              })}
            />

            <div className="flex items-center gap-2 mt-4">
              <input
                id="terms"
                type="checkbox"
                checked={termsChecked}
                onChange={() => setTermsChecked(!termsChecked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                Saya setuju dengan{" "}
                <span
                  className="text-blue-500 underline cursor-pointer"
                  onClick={openModal}
                >
                  Syarat & Ketentuan
                </span>
              </label>
            </div>

            <button
              disabled={loading || !termsChecked}
              type="submit"
              className={`w-full mt-4 p-3 bg-[#0D5EF4] text-white rounded-[10px] font-bold hover:bg-[#0D42EF] transition-colors ${
                loading || !termsChecked ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </button>

            <div className="flex items-center justify-center gap-1 mt-4">
              <p className="font-medium text-slate-800 text-sm">
                Sudah Punya Akun?
              </p>
              <Link
                to="/auth/login"
                className="text-blue-500 font-semibold hover:underline"
              >
                Login
              </Link>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <p className="mx-4 text-gray-500 text-sm">Atau</p>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <button
              disabled={loadingGoogle}
              onClick={loginWithGoogle}
              type="button"
              className="w-full border border-blue-500 py-2.5 rounded-sm hover:bg-sky-50 hover:border-blue-500 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out flex gap-2 justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <img
                src="/assets/Auth/Google.png"
                alt="Google"
                className="w-6 h-6"
              />
              <span className="font-medium">
                {!loadingGoogle ? "Masuk dengan Google" : "Loading..."}
              </span>
            </button>
          </form>

          <TermsModal onAccept={() => setTermsChecked(true)} />
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
