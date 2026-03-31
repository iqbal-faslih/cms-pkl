import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useRegionData } from "../../hooks/useRegionData";
import { useCompanySubmit } from "@/features/company/hooks/useCompanySubmit";
import FormHeader from "../../components/form/FormHeader";
import CompanyDataSection from "../../components/form/CompanyDataSection";
import ContactSection from "../../components/form/ContactSection";
import DocumentsSection from "../../components/form/DocumentsSection";
import Button from "@/shared/components/button/Button";
import {
  initialCompanyFormState,
  companyFormReducer,
} from "./Registrasi/FormInitial";

export default function CompanyRegistrationForm() {
  const navigate = useNavigate();

  const [formData, dispatch] = useReducer(
    companyFormReducer,
    initialCompanyFormState
  );

  const { submitCompanyData, loading } = useCompanySubmit();

  const {
    errors,
    setErrors,
    validateInput,
    validateForm,
    validateFile,
  } = useFormValidation();

  const {
    provinces,
    cities,
    districts,
    selectedProvince,
    selectedCity,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
  } = useRegionData();

  useEffect(() => {
    const verified = localStorage.getItem("verified");
    if (verified === "true") {
      navigate("/perusahaan/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch({
      type: "SET_FIELD",
      field: name,
      value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: validateInput(name, value),
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files?.length) return;

    const file = files[0];
    const error = validateFile(name, file);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (!error) {
      dispatch({
        type: "SET_FIELD",
        field: name,
        value: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      const firstError = document.querySelector(".text-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    await submitCompanyData(formData);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm mb-8">
      <form onSubmit={handleSubmit} noValidate>
        <FormHeader />

        <CompanyDataSection
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />

        <ContactSection
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          provinces={provinces}
          cities={cities}
          districts={districts}
          selectedProvince={selectedProvince}
          selectedCity={selectedCity}
          handleProvinceChange={handleProvinceChange}
          handleCityChange={handleCityChange}
          handleDistrictChange={handleDistrictChange}
        />

        <DocumentsSection
          handleFileChange={handleFileChange}
          errors={errors}
        />

        <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          loading={loading}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Simpan
        </Button>
      </div>
      </form>
    </div>
  );
}