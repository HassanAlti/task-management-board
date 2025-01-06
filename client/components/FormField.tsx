"use client";

import { FormFieldProps } from "@/types";
import React from "react";

export const FormField = ({
  label,
  children,
  className = "",
  required = false,
  error,
}: FormFieldProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-primary flex gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error?.message && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};
