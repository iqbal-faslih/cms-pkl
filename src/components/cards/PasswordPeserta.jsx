import React from "react";
import PrimaryButton from "../button/PrimaryButton";
import SecondaryButton from "../button/SecondaryButton";
import PasswordField from "../PasswordField";
import { Info, CheckCircle } from "lucide-react";
import { usePasswordPesertaForm } from "./hooks/usePasswordPesertaForm";

const PASSWORD_FIELDS = [
  {
    key: "current",
    label: "Kata Sandi Saat Ini",
    name: "current_password",
    autoComplete: "current-password",
  },
  {
    key: "new",
    label: "Password Baru",
    name: "password",
    autoComplete: "new-password",
  },
  {
    key: "confirm",
    label: "Konfirmasi Password",
    name: "password_confirmation",
    autoComplete: "new-password",
  },
];

const PasswordRequirementItem = ({ isPassed, label }) => {
  const Icon = isPassed ? CheckCircle : Info;

  return (
    <li className="flex items-start gap-2">
      <Icon
        size={16}
        className={`mt-[2px] flex-shrink-0 ${
          isPassed ? "text-green-600" : "text-blue-500"
        }`}
      />
      <span className={`text-sm ${isPassed ? "text-green-700" : "text-slate-700"}`}>
        {label}
      </span>
    </li>
  );
};

const PasswordRequirements = ({ requirements }) => {
  const passedCount = requirements.filter((item) => item.test).length;

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800">Persyaratan Kata Sandi</h2>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
          {passedCount}/{requirements.length} terpenuhi
        </span>
      </div>
      <ul className="space-y-2">
        {requirements.map(({ key, test, label }) => (
          <PasswordRequirementItem key={key} isPassed={test} label={label} />
        ))}
      </ul>
    </section>
  );
};

export const PengaturanPasswordCard = ({
  isModal = false,
  onClose,
  showIntro = true,
}) => {
  const {
    register,
    errors,
    loading,
    isValid,
    requirements,
    showPasswords,
    onSubmit,
    togglePasswordVisibility,
  } = usePasswordPesertaForm({
    onSuccess: isModal ? onClose : undefined,
  });

  return (
    <section
      className={
        isModal ? "w-full" : "w-full rounded-2xl bg-white p-5 md:p-8 lg:p-10"
      }
    >
      <div className={`mx-auto w-full ${isModal ? "max-w-none space-y-6" : "max-w-5xl space-y-8"}`}>
        {showIntro && (
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Ganti Kata Sandi
            </h1>
            <p className="text-sm text-slate-600">
              Gunakan kombinasi kata sandi yang kuat untuk menjaga keamanan akun.
            </p>
          </div>
        )}

        <PasswordRequirements requirements={requirements} />

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-1">
            {PASSWORD_FIELDS.map((field) => (
              <PasswordField
                key={field.key}
                label={field.label}
                name={field.name}
                showPassword={showPasswords[field.key]}
                onToggleVisibility={() => togglePasswordVisibility(field.key)}
                register={register}
                error={errors[field.name]}
                autoComplete={field.autoComplete}
              />
            ))}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end sm:gap-4">
            {isModal ? (
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                Batal
              </button>
            ) : (
              <SecondaryButton
                rounded="rounded-xl"
                to="/peserta/profile-settings"
                textSize="text-sm"
              >
                Kembali
              </SecondaryButton>
            )}

            {isModal ? (
              <button
                type="submit"
                disabled={loading || !isValid}
                className="rounded-xl bg-[#0D5EF4] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0D42EF] disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            ) : (
              <PrimaryButton
                rounded="rounded-xl"
                type="submit"
                textSize="text-sm"
                disabled={loading || !isValid}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </PrimaryButton>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default PengaturanPasswordCard;
