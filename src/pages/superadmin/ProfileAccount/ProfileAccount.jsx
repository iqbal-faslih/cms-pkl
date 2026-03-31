import { useState, useRef, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import Profileaccount from "../../../shared/components/Profileaccount";
import ModalUpdateProfile from "../../../components/modal/siswa/account-settings/ModalUpdateProfile";
import profilAccountFields, {
  profilAccountLayout,
} from "./ProfileAccountField";
import Form from "../../../shared/components/Form";
import { profileAccountSchema } from "@/schema/superadmin/profleSchema";
import { Validate } from "@/shared/helpers/validator";
import { useProfileAccount } from "../../../hooks/useProfileAccount";

export default function ProfilAccount() {
  const [isEdit, setIsEdit] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tempProfilePreview, setTempProfilePreview] = useState(null);
  const [profileFileName, setProfileFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const profileInputRef = useRef(null);

  const { profile, profileLoading, profileError } = useProfileAccount();
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setData({
        email: profile.data.email,
        username: profile.data.username,
        password: "",
        profileImage: profile.data.avatar ?? "/assets/img/defaultPP.png",
      });
    }
  }, [profile]);

  const hasChanges =
    tempProfilePreview && tempProfilePreview !== data?.profileImage;

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFileName(file.name);
    setTempProfilePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setProfileFileName(file.name);
    setTempProfilePreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => e.preventDefault();

  const resetTempImage = () => {
    setTempProfilePreview(null);
    setProfileFileName("");
  };

  const handleSaveImages = () => {
    if (!tempProfilePreview) return;
    setIsUploading(true);

    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        profileImage: tempProfilePreview,
      }));
      setIsUploading(false);
      setShowUploadModal(false);
    }, 1200);
  };

  const handleSubmit = (formData) => {
    const validation = Validate(profileAccountSchema, formData);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    setData(formData);
    setIsEdit(false);
  };

  if (profileLoading) {
    return <p className="p-6">Loading profile...</p>;
  }

  if (profileError) {
    return <p className="p-6 text-red-500">Gagal memuat profile!</p>;
  }

  if (!data) return null;

  return (
    <div className="p-6">
      {/* CARD */}
      <div className="bg-white rounded-xl shadow-md p-8">

        {/* HEADER CARD */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-gray-200 transition"
            >
              <IoMdArrowBack size={24} className="text-blue-700" />
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-slate-800">
                {isEdit ? "Edit Data Diri" : "Data Diri"}
              </h1>
              <p className="text-sm text-slate-500">
                Dashboard / Data Diri
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Terakhir edit:{" "}
            <span className="font-medium">30 Juni 2025</span>
          </p>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT */}
          <div className="flex flex-col items-center w-full md:w-1/3">
            <Profileaccount
              profileImage={data.profileImage}
              onEdit={() => {
                if (!isEdit) setShowUploadModal(true);
              }}
              isEdit={isEdit}
            />

            <h2 className="font-semibold text-xl mt-4">
              {data.username}
            </h2>
            <p className="text-blue-600 mt-1 text-sm">
              {data.email}
            </p>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-2/3">
            {!isEdit ? (
              <>
                {profilAccountFields
                  .filter((field) => field.name !== "password")
                  .map((field) => (
                    <div key={field.name} className="mb-4">
                      <label className="text-sm text-slate-600">
                        {field.label}
                      </label>
                      <input
                        value={data[field.name]}
                        readOnly
                        type="text"
                        className="mt-1 w-full border rounded-lg px-4 py-2 bg-gray-50"
                      />
                    </div>
                  ))}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsEdit(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <Form
                fields={profilAccountFields}
                layout={profilAccountLayout}
                initialData={data}
                onSubmit={handleSubmit}
                onCancel={() => setIsEdit(false)}
                errors={errors}
              />
            )}
          </div>
        </div>
      </div>

      {/* MODAL FOTO */}
      <ModalUpdateProfile
        showUploadModal={showUploadModal}
        handleCloseModal={() => setShowUploadModal(false)}
        handleSaveImages={handleSaveImages}
        tempProfilePreview={tempProfilePreview}
        profileFileName={profileFileName}
        profileImage={data.profileImage}
        profileInputRef={profileInputRef}
        handleImageSelect={handleImageSelect}
        handleDrop={handleDrop}
        handleDragOver={handleDragOver}
        resetTempImage={resetTempImage}
        isUploading={isUploading}
        isDisabled={!hasChanges}
        hasChanges={hasChanges}
      />
    </div>
  );
}
