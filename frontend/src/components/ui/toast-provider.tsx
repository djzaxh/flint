import { createContext, useContext } from "react";
import { Toast } from "./toast";
import { useToast } from "./use-toast";

const ToastContext = createContext<ReturnType<typeof useToast> | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, toast } = useToast();

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex w-full flex-col gap-2 p-4 sm:max-w-[420px]">
        {toasts.map((t, i) => (
          <Toast key={i} {...t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}
