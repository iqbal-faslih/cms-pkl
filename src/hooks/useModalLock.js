// hooks/useModalLock.js
import { useEffect } from "react";

const useModalLock = (containerRef, isActive) => {
  useEffect(() => {
    if (!isActive) return;

    document.body.style.overflow = "hidden";

    const trapFocus = (e) => {
      if (!containerRef.current) return;

      const focusableEls = containerRef.current.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", trapFocus);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", trapFocus);
    };
  }, [containerRef, isActive]);
}

export default useModalLock;