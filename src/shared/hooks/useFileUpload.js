import { useState } from "react";

export function useFileUpload({ validate }) {
  const [fileState, setFileState] = useState({
    file: null,
    status: "idle",
    progress: 0,
    error: null,
  });

  const simulateUpload = (file) => {
    const validationError = validate?.(file);
    if (validationError) {
      setFileState({
        file,
        status: "failed",
        progress: 0,
        error: validationError,
      });
      return;
    }

    setFileState({ file, status: "uploading", progress: 0, error: null });

    let p = 0;

    const timer = setInterval(() => {
      p += 10;

      if (p >= 100) {
        clearInterval(timer);

        setFileState({
          file,
          status: "success",
          progress: 100,
          error: null,
        });

        setTimeout(() => {
          setFileState({
            file,
            status: "done",
            progress: 100,
            error: null,
          });
        }, 1000);
      } else {
        setFileState((prev) => ({ ...prev, progress: p }));
      }
    }, 200);
  };

  return {
    fileState,
    selectFile: simulateUpload,
    retry: () => simulateUpload(fileState.file),
    deleteFile: () =>
      setFileState({ file: null, status: "idle", progress: 0, error: null }),
  };
}
