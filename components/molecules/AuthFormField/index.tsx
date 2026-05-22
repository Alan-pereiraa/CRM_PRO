"use client"

import { useState } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

interface AuthFormFieldProps {
  label: string
  labelExtra?: React.ReactNode
  placeholder: string
  type?: string
  icon: React.ReactNode
  showPasswordToggle?: boolean
  error?: string
  register: UseFormRegisterReturn
}

export function AuthFormField({
  label,
  labelExtra,
  placeholder,
  type = "text",
  icon,
  showPasswordToggle = false,
  error,
  register,
}: AuthFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-[var(--text-primary)]">
          {label}
        </Label>
        {labelExtra}
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray-light)]">
          {icon}
        </div>
        <Input
          type={inputType}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={`h-11 w-full rounded-xl border-transparent bg-[#F1F5F9] dark:bg-accent pl-11 text-sm placeholder:text-[var(--text-gray-light)] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 sm:h-12 ${showPasswordToggle ? "pr-11" : "pr-4"}`}
          {...register}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray-light)] transition-colors hover:text-[var(--text-secondary)]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-[var(--text-danger)]">{error}</p>
      )}
    </div>
  )
}
