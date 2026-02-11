import { ChangeEvent } from 'react'

interface FormSelectProps {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  className?: string
}

export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Sélectionnez une option',
  required = false,
  error,
  disabled = false,
  className = ''
}: FormSelectProps) => {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full rounded-lg border ${
            error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all h-12 px-4 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none material-symbols-outlined">
          expand_more
        </span>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </label>
  )
}
