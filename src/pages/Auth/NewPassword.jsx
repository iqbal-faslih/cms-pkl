import { Eye, EyeOff, Lock } from 'lucide-react';
import PasswordUpdateSuccess from '../Auth/Succes';
import { useNewPassword } from '../../hooks';

export default function CreateNewPasswordPage() {
    const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSuccess,
    loading,
    handleSubmit,
    getPasswordStrength,
  } = useNewPassword();

  if (isSuccess) return <PasswordUpdateSuccess />;

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        <img src="/assets/Auth/ForgotPassword.png" alt="New Password" className="w-64 h-64 object-contain mb-6" />

        <h1 className="text-3xl font-bold text-center text-gray-900">Buat Password Baru</h1>
        <p className="text-center text-gray-600 mt-2 mb-6">Password baru harus berbeda dari sebelumnya.</p>

        <div className="w-full space-y-4">
          {/* Password Input */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="pl-3 text-gray-500"><Lock size={18} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none rounded-md"
                placeholder="Password baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="pr-3 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Password Strength */}
          {password && (
            <div className="w-full">
              <div className="h-2 rounded-full bg-gray-200 mt-1">
                <div
                  className={`h-2 rounded-full ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.label === 'Weak' ? 33 : passwordStrength.label === 'Moderate' ? 66 : 100}%` }}
                ></div>
              </div>
              <p className={`text-sm mt-1 ${
                passwordStrength.color === 'bg-red-500' ? 'text-red-600' :
                passwordStrength.color === 'bg-yellow-500' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                Strength: {passwordStrength.label}
              </p>
            </div>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="pl-3 text-gray-500"><Lock size={18} /></span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none rounded-md"
                placeholder="Konfirmasi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button" className="pr-3 text-gray-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Memproses...' : 'Simpan Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
