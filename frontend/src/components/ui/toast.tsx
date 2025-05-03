import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
  onClose: () => void;
};

const variantStyles = {
  default: "bg-white border-gray-200",
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  warning: "bg-yellow-50 border-yellow-200",
};

const variantIcons = {
  default: null,
  success: "✓",
  error: "✕",
  warning: "⚠",
};

export function Toast({
  title,
  description,
  variant = "default",
  onClose,
}: ToastProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-sm items-start space-x-4 rounded-lg border p-4 shadow-lg",
        variantStyles[variant]
      )}
      role="alert"
    >
      {variantIcons[variant] && (
        <div className="flex-shrink-0">
          <span className="text-lg">{variantIcons[variant]}</span>
        </div>
      )}
      <div className="flex-1 space-y-1">
        {title && <p className="text-sm font-medium">{title}</p>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
