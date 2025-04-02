import React from "react";
import clsx from "clsx";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx("animate-pulse bg-gray-200 rounded", className)} />
  );
}
