import { useState, useRef } from 'react'
import { photoValidationService } from '@/services/photoValidationService'

interface PhotoUploadFieldProps {
  name: string
  label?: string
  required?: boolean
  value: File | null
  onChange: (file: File | null) => void
  error?: string
  disabled?: boolean
  className?: string
}

export const PhotoUploadField = ({
  name,
  label = "Photo d'identité",
  required = false,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
}: PhotoUploadFieldProps) => {
  const [validating, setValidating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    if (!file) {
      onChange(null)
      setValidationError(null)
      setIsValid(false)
      return
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setValidationError('Le fichier doit être une image')
      onChange(null)
      setIsValid(false)
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setValidationError('La taille du fichier ne doit pas dépasser 5MB')
      onChange(null)
      setIsValid(false)
      return
    }

    // Valider la photo via l'API
    setValidating(true)
    setValidationError(null)
    setIsValid(false)

    try {
      const result = await photoValidationService.validatePhoto(file)
      
      if (result.valid) {
        setIsValid(true)
        setValidationError(null)
        onChange(file)
      } else {
        setIsValid(false)
        setValidationError(result.message || 'Photo d\'identité non valide')
        onChange(null)
        // Réinitialiser l'input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (err: any) {
      setIsValid(false)
      setValidationError(err.message || 'Erreur lors de la validation')
      onChange(null)
      // Réinitialiser l'input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } finally {
      setValidating(false)
    }
  }

  const displayError = validationError || error

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">
        {label} {required && '*'}
      </label>
      
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || validating}
          className={`w-full px-3 py-2 border rounded-lg ${
            displayError ? 'border-red-500' : isValid ? 'border-green-500' : 'border-gray-300'
          } ${disabled || validating ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        
        {validating && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {validating && (
        <p className="text-blue-600 text-sm mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
          Validation de la photo en cours...
        </p>
      )}

      {isValid && !validating && value && (
        <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          Photo d'identité valide - {value.name}
        </p>
      )}

      {displayError && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {displayError}
        </p>
      )}

      <small className="text-gray-600 block mt-1">
        Formats acceptés: JPG, PNG (max 5MB). La photo sera validée automatiquement.
      </small>
    </div>
  )
}
