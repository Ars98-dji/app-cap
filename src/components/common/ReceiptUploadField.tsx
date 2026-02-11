import { useState, useRef } from 'react'
import { receiptExtractionService, type ExtractionResult } from '@/services/receiptExtractionService'

interface ReceiptUploadFieldProps {
  name: string
  label: string
  required?: boolean
  value: File | null
  onChange: (file: File | null, extractedData?: ExtractionResult) => void
  error?: string
  disabled?: boolean
  className?: string
  showExtraction?: boolean
}

export const ReceiptUploadField = ({
  name,
  label,
  required = false,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  showExtraction = true,
}: ReceiptUploadFieldProps) => {
  const [extracting, setExtracting] = useState(false)
  const [extractionError, setExtractionError] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    if (!file) {
      onChange(null)
      setExtractionError(null)
      setExtractedData(null)
      return
    }

    // Vérifier le type de fichier
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      setExtractionError('Le fichier doit être un PDF, JPG ou PNG')
      onChange(null)
      setExtractedData(null)
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setExtractionError('La taille du fichier ne doit pas dépasser 5MB')
      onChange(null)
      setExtractedData(null)
      return
    }

    // Toujours accepter le fichier
    onChange(file)

    // Extraire les données si activé
    if (showExtraction) {
      setExtracting(true)
      setExtractionError(null)
      setExtractedData(null)

      try {
        const result = await receiptExtractionService.extractReceiptData(file)
        
        if (result.success && result.data) {
          setExtractedData(result.data)
          setExtractionError(null)
          onChange(file, result.data)
        } else {
          setExtractionError(result.error || 'Impossible d\'extraire les données')
          // Le fichier reste accepté même si l'extraction échoue
        }
      } catch (err: any) {
        setExtractionError(err.message || 'Erreur lors de l\'extraction')
        // Le fichier reste accepté même si l'extraction échoue
      } finally {
        setExtracting(false)
      }
    }
  }

  const displayError = error

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
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          disabled={disabled || extracting}
          className={`w-full px-3 py-2 border rounded-lg ${
            displayError ? 'border-red-500' : value ? 'border-green-500' : 'border-gray-300'
          } ${disabled || extracting ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        
        {extracting && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {extracting && (
        <p className="text-blue-600 text-sm mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
          Extraction des données en cours...
        </p>
      )}

      {value && !extracting && (
        <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          {value.name}
        </p>
      )}

      {extractedData && !extracting && showExtraction && (
        <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Données extraites automatiquement :
          </p>
          <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
            {receiptExtractionService.formatExtractionData(extractedData).map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        </div>
      )}

      {extractionError && !extracting && showExtraction && (
        <p className="text-orange-600 text-sm mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">warning</span>
          {extractionError} (Le fichier est accepté)
        </p>
      )}

      {displayError && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {displayError}
        </p>
      )}

      <small className="text-gray-600 block mt-1">
        Formats acceptés: PDF, JPG, PNG (max 5MB). Les données seront extraites automatiquement.
      </small>
    </div>
  )
}
