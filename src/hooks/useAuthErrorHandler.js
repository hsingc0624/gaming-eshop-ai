import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

let hasGlobalRedirected = false;

export function useAuthErrorHandler() {
  const navigate = useNavigate();

  return function handleAuthError(err) {
    const code = err?.response?.status;

    if ((code === 401 || code === 403) && !hasGlobalRedirected) {
      hasGlobalRedirected = true;

      toast.error("You don’t have permission to view this page.", {
        position: "top-center",
        autoClose: 2500,
      });

      setTimeout(() => {
        navigate("/", { replace: true });
        setTimeout(() => {
          hasGlobalRedirected = false;
        }, 5000);
      }, 1200);
    }
  };
}
