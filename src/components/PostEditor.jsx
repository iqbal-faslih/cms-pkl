import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { uploadImage } from "../helpers/apiClient";
import { createImagePickerCallback } from "./helpers/postEditorImageHelper";

export default function PostEditor({ content, onContentChange }) {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const hasTinyApiKey = Boolean(String(apiKey || "").trim());
  const editorHeight =
    typeof window !== "undefined" && window.innerWidth < 768 ? 320 : 460;

  const handleEditorChange = (newContent) => {
    onContentChange(newContent);
  };
  const handleImagePicker = createImagePickerCallback(uploadImage);

  if (!hasTinyApiKey) {
    return (
      <textarea
        value={content || ""}
        onChange={(e) => onContentChange(e.target.value)}
        rows={10}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Masukkan deskripsi perusahaan"
      />
    );
  }

  return (
    <Editor
      apiKey={apiKey}
      value={content}
      onEditorChange={handleEditorChange}
      init={{
        height: editorHeight,
        menubar: true,
        toolbar_mode: "sliding",
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | image | formatselect | bold italic backcolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | help",
        mobile: {
          menubar: false,
        },

        file_picker_types: "image",
        file_picker_callback: handleImagePicker,
      }}
    />
  );
}
