import React, { useRef, useState, useEffect, useContext } from "react";
import Form from "../../../shared/components/Form";
import { ProfileMentorFields } from "../../../shared/fields/perusahaan/dashboard/ProfileMentorFields";
import { ProfileSchema } from "./ProfileSchema";
import { Validate } from "../../../shared/helpers/validator";
import useProfilePeserta from "../../../hooks/useProfilePeserta";
import { AuthContext } from "../../../contexts/AuthContext";

const ProfileMentorForm = () => {
  const { role } = useContext(AuthContext);

  const formRef = useRef(null);
  const fileRef = useRef(null);

  const { data, loading, error } = useProfilePeserta(1); // hardcoded id for now

  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(
    "https://i.pinimg.com/736x/f3/90/55/f390557272b5c4e7e6703754d934a108.jpg"
  );
  const [tempImage, setTempImage] = useState(null);

  useEffect(() => {
    if (data?.avatar) {
      setProfileImage(data.avatar);
    }
  }, [data]);

  const layout = [
    ["nama", "email"],
    ["nohp", "password"],
    ["divisi"],
  ];

  const modifiedFields = ProfileMentorFields.map(field => ({
    ...field,
    readonly: !isEdit,
    disabled: !isEdit,
  }));

  const handleSubmit = (formData) => {
    const validation = Validate(ProfileSchema, formData);

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    console.log("SUBMIT DATA:", formData);
    console.log("PROFILE IMAGE:", profileImage);

    setErrors({});
    setIsEdit(false);
  };

  const handleCancel = () => {
    formRef.current?.reset();
    setErrors({});
    setIsEdit(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setTempImage(preview);
  };

  if (loading) {
    return (
      <div className="w-full bg-white p-6 rounded-md">
        <div className="mb-6">
          <h2 className="font-semibold text-[20px]">Profile Mentor</h2>
          <p className="text-[13px] text-gray-600">
            Dashboard / Profile Mentor
          </p>
        </div>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white p-6 rounded-md">
        <div className="mb-6">
          <h2 className="font-semibold text-[20px]">Profile Mentor</h2>
          <p className="text-[13px] text-gray-600">
            Dashboard / Profile Mentor
          </p>
        </div>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-md">
      <div className="mb-6">
        <h2 className="font-semibold text-[20px]">Profile Mentor</h2>
        <p className="text-[13px] text-gray-600">
          Dashboard / Profile Mentor
        </p>
      </div>

      <div className="flex gap-15 w-full">
        <div className="flex flex-col items-center ml-5 mt-5">
          <img
            src={profileImage}
            className="w-[96px] h-[96px] rounded-full shadow mb-2 mt-6 ml-10 object-cover"
          />

          {isEdit && (
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="text-[10px] text-blue-600 hover:underline ml-10"
            >
              Ubah Foto Profil
            </button>
          )}

          <h3 className="font-semibold text-base text-center ml-10 mt-3">
            {data?.nama || "Hallo Brow"}
          </h3>
          <span className="text-[8px] bg-blue-100 text-blue-300 px-3 py-1 rounded-full mt-1 ml-10">
            {data?.email || "boruto@gmail.com"}
          </span>
        </div>

        <div className="flex-1">
          <Form
            ref={formRef}
            fields={modifiedFields}
            errors={errors}
            layout={layout}
            onCancel={isEdit ? handleCancel : ""}
            cancelStyle="px-9 py-2 text-sm transition-colors duration-150 hover:bg-red-500 bg-red-400 rounded-md text-white"
            initialData={data || {}}
            showSubmitButton={true}
            submitStyle={
              isEdit
                ? "px-9 py-2 text-sm transition-colors duration-150 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                : "px-9 py-2 text-sm transition-colors duration-150 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
            }
            submitLabel={isEdit ? "Simpan Perubahan" : "Edit"}
            onSubmit={isEdit ? handleSubmit : () => setIsEdit(true)}
          />
        </div>
      </div>

      {isPhotoModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[360px] rounded-lg p-5 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[16px]">
                Ubah Foto Profil
              </h3>
              <button onClick={() => setIsPhotoModalOpen(false)}>
                ✕
              </button>
            </div>

            <div
              onClick={() => fileRef.current.click()}
              className="border border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer bg-blue-50"
            >
              {tempImage ? (
                <img
                  src={tempImage}
                  className="w-[120px] h-[120px] rounded-full object-cover"
                />
              ) : (
                <>
                  <div className="text-[28px] mb-2">🖼️</div>
                  <p className="text-sm font-medium">Masukan foto</p>
                  <p className="text-[11px] text-gray-500">
                    PNG, JPEG (max 200×200)
                  </p>
                </>
              )}
            </div>

            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  if (tempImage) {
                    setProfileImage(tempImage);
                  }
                  setIsPhotoModalOpen(false);
                  setTempImage(null);
                }}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMentorForm;