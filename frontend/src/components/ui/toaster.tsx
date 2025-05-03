import * as React from "react";
import { useToast } from "./use-toast";
import { Toast } from "./toast";
import { AnimatePresence, motion } from "framer-motion";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-0 z-50 flex w-full flex-col p-4 sm:right-0 sm:top-0 sm:flex-col md:max-w-[420px]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="mb-4"
          >
            <Toast {...toast} onClose={() => removeToast(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
