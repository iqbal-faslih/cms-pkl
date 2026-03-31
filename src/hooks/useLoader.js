import { useState, useEffect } from "react";

export function useLoader({ loading, errorMessage, timeout = 20000 }) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
      setShowError(false);

      const timer = setTimeout(() => {
        if (loading) {
          setShowSkeleton(false);
          setShowError(true);
        }
      }, timeout);

      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(false);
    }
  }, [loading, timeout]);

  useEffect(() => {
    if (errorMessage) {
      setShowSkeleton(false);
      setShowError(true);
    }
  }, [errorMessage]);

  const reset = () => {
    setShowSkeleton(true);
    setShowError(false);
  };

  return { showSkeleton, showError, reset };
}
