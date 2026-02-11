import { ChangeEvent } from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'date'
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  icon?: string
  required?: boolean
  error?: string
  disabled?: boolean
  className?: string
}

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  required = false,
  error,
  disabled = false,
  className = ''
}: FormFieldProps) => {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-lg border ${
            error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all h-12 ${
            icon ? 'pl-11 pr-4' : 'px-4'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </label>
  )
}
