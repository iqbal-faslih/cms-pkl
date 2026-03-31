import { useCallback, useEffect } from "react";
import { useBeforeUnload, useBlocker } from "react-router-dom";
import { showConfirmAlert } from "@/helpers/sweetAlertHelper";

export const useUnsavedChangesGuard = (enabled) => {
  useBeforeUnload(
    useCallback(
      (event) => {
        if (!enabled) return;
        event.preventDefault();
        event.returnValue = "";
      },
      [enabled]
    )
  );

  const blocker = useBlocker(Boolean(enabled));

  useEffect(() => {
    if (blocker.state !== "blocked") return;

    let active = true;

    const confirmNavigation = async () => {
      const confirm = await showConfirmAlert(
        "Batalkan perubahan?",
        "Perubahan yang belum disimpan akan hilang.",
        "Ya, lanjutkan"
      );

      if (!active) return;

      if (confirm.isConfirmed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    };

    confirmNavigation();

    return () => {
      active = false;
    };
  }, [blocker]);
};
