import * as React from "react";
import { useToast } from "./use-toast";
import { Toast } from "./toast";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4"
      role="region"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
