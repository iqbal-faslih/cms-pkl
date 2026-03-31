import FloatingLabelInput from "../../components/FloatingLabelInput";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useSetPassword } from "../../hooks";


const SetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const {
    setPwHandler,
    loading,
    getPasswordStrength,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = useSetPassword();

  const watchPassword = watch("password", "");
  const passwordStrength = getPasswordStrength(watchPassword);

  const onSubmit = (data) => {
    setPwHandler({
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };
  
  return (
    <div className="w-full min-h-screen xl:h-screen relative flex xl:flex xl:flex-row flex-col gap-5 overflow-hidden p-10 xl:p-0">

      <motion.div initial={{ translateY: -400 }} animate={{ translateY: 0 }} transition={{ duration:0.7, delay: 0.3 }} className="flex items-center justify-center xl:hidden " >
        <div className="flex items-center gap-2">
          <img src="/assets/img/Logo.png" alt="Logo" className="w-14" />
          <div className="mt-2">
            <p className="font-bold text-lg -mb-2">Manajemen</p>
            <p className="font-bold text-lg text-[#0069AB]">Magang</p>
          </div>
        </div>
      </motion.div>

      <div className="relative overflow-hidden hidden xl:block flex-1">
      <motion.div initial={{ translateX: -400 }} animate={{ translateX: 0 }} transition={{ duration:0.7 }} className="hidden xl:block" >
      <img src="/assets/Auth/Shape_blue.png" alt="ShapeBlue" className="w-full h-screen" />
      </motion.div>

      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }} className="hidden xl:block absolute -translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2 z-20">
        <img src="/assets/Auth/ilustrationAuth.png" alt="Ilustrasi Auth" className="w-md" />     
      </motion.div>
      </div>

      {/* Form */}
      <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="flex justify-center items-center py-10 xl:w-1/2">
      <div className="py-10 px-12 rounded-[10px] shadow-lg">
         <div className="space-y-2 mb-2 w-md">
          <div className="flex items-center justify-center mb-3">
              <img src="/assets/img/Logo.png" alt="Logo" className="size-14" />
              <div className="mt-2 flex items-center gap-1">
                <p className="font-bold text-lg">Manajemen</p>
                <p className="font-bold text-lg text-[#0069AB]">Magang</p>
              </div>
            </div>
          <h1 className="text-lg text-center md:text-xl xl:text-2xl font-bold text-gray-800">Buat Password</h1>
          <p className="text-gray-500 text-xs text-center hidden md:block">Silahkan Isi password untuk akun anda</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">

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
                  message: "Password harus mengandung huruf besar, kecil, angka, dan simbol",
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
                        width: passwordStrength.label === 'Weak' ? '33%' : 
                               passwordStrength.label === 'Moderate' ? '66%' : '100%' 
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
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            {...register("password_confirmation", {
              required: "Konfirmasi kata sandi wajib diisi",
              minLength: {
                value: 8,
                message: "Minimal 8 karakter",
              },
                validate: (value) => {
                const password = watch("password");
                return value === password || "Password tidak cocok";
              },
            })}
          />

          {errors.message && <p className="text-red-500 text-xs my-1 mb-2">{errors.message}</p>}


          <button disabled={loading} type="submit" className={`w-full mt-4 p-3 bg-[#0D5EF4] text-white rounded-[10px] font-bold hover:bg-[#0D42EF] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Mendaftar..." : "Daftar"}
          </button>


        </form>

      </div>
       
      </motion.div>

      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }} className="hidden md:block xl:hidden mx-auto">
        <img src="/assets/Auth/ilustrationAuth.png" alt="Ilustrasi Auth" className="w-sm" />
      </motion.div>
    </div>
  )
}

export default SetPassword
