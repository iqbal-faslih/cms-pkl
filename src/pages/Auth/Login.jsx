import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (
      location.state?.reason === "unauthorized" &&
      !location.state?.fromLogout &&
      !hasShownToast.current
    ) {
      toast.error("Silakan login terlebih dahulu untuk mengakses halaman tersebut.");
      hasShownToast.current = true;

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, loginWithGoogle, loading, loadingGoogle } = useLogin();

  const onSubmit = (data) => {
    login(
      {
        email: data.email,
        password: data.password,
        remember_me: rememberMe,
      },
      rememberMe
    );
  };

  return (
    <div className="relative flex xl:max-h-screen xl:flex xl:flex-row flex-col gap-5 p-10 xl:p-0">
      {/* Form */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="flex justify-center items-center py-10 xl:w-1/2"
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
              Welcome Back 👋
            </h1>
            <p className="text-gray-500 text-xs text-center hidden md:block">
              Silahkan masuk ke akun kamu dan mulai petualanganmu.
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
                  value: /\S+@\S+\.\S+/,
                  message: "Format email tidak valid",
                },
              })}
            />

            <FloatingLabelInput
              label="Password"
              type="password"
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={togglePassword}
              placeholder="Masukkan kata sandi"
              icon="bi-lock"
              error={errors.password}
              {...register("password", {
                required: "Password wajib diisi",
                minLength: {
                  value: 8,
                  message: "Minimal 8 karakter",
                },
              })}
            />

            {errors.message && (
              <p className="text-red-500 text-xs my-1 mb-2">{errors.message}</p>
            )}

            <div className="flex items-center justify-between mt-2">
              <div>
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-700">
                  Ingat Aku
                </label>
              </div>
              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium text-sky-500"
              >
                Lupa Kata Sandi?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full mt-4 p-3 bg-[#0D5EF4] text-white rounded-[10px] font-bold hover:bg-[#0D42EF]"
              disabled={loading}
            >
              {loading ? "Loading..." : "Masuk"}
            </button>
            <div className="text-center mt-4">
              <h1 className="font-medium text-slate-800 text-sm">
                Tidak memiliki akun?{" "}
                <Link
                  to={`/auth/register`}
                  className="text-sky-500 font-semibold"
                >
                  Buat Akun
                </Link>
              </h1>
            </div>

            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-gray-300"></div>
              <p className="mx-4 text-gray-500">Atau</p>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              disabled={loadingGoogle}
              onClick={loginWithGoogle}
              className="w-full border border-blue-500 py-2.5 rounded-sm hover:bg-sky-50 hover:border-blue-500 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out flex gap-2 justify-center"
            >
              <img
                src="/assets/Auth/Google.png"
                alt="Google"
                className="w-6 h-6"
              />
              <span>
                {!loadingGoogle ? "Masuk dengan Google" : "Loading ..."}
              </span>
            </button>
          </form>
        </div>
      </motion.div>

      <div className="hidden lg:block flex-1 relative overflow-hidden rotate-y-180 xl:w-1/2">
        <motion.div
          initial={{ translateX: -400 }}
          animate={{ translateX: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="block xl:absolute top-5 left-10"
        ></motion.div>
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

    </div>
  );
};

export default Login;
