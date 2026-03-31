import React from "react";
import AlertVerification from "../components/AlertVerification";
import PrimaryButton from "../components/button/PrimaryButton";

const VerifyCompanyData = () => {
  return (
    <div className="mx-auto flex flex-col items-center justify-center h-full relative">
      <AlertVerification message="Akses tidak diizinkan. Lengkapi data diri anda!" />

      <img
        src="/assets/img/registrasi.png"
        alt="verification"
        className="size-96"
      />

      <PrimaryButton
        to={"registrasi"}
        icon="bi-arrow-right"
        rounded="rounded-full"
      >
        <span>Isi Data Diri</span>
      </PrimaryButton>
    </div>
  );
};

export default VerifyCompanyData;
