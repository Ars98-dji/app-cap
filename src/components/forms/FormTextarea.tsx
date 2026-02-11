import { ChangeEvent } from 'react'

interface FormTextareaProps {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  rows?: number
  maxLength?: number
  className?: string
}

export const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  rows = 5,
  maxLength,
  className = ''
}: FormTextareaProps) => {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`w-full rounded-lg border ${
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
        } bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all p-4 resize-y disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      <div className="flex items-center justify-between">
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        {maxLength && (
          <p className="text-xs text-slate-500 ml-auto">
            {value.length} / {maxLength} caractères
          </p>
        )}
      </div>
    </label>
  )
}
