import { useState, useRef, ChangeEvent } from 'react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  file: File
}

interface FileUploadProps {
  label?: string
  accept?: string
  maxSize?: number // en MB
  multiple?: boolean
  onFilesChange: (files: File[]) => void
  error?: string
  disabled?: boolean
}

export const FileUpload = ({
  label = 'Pièces jointes',
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 10,
  multiple = true,
  onFilesChange,
  error,
  disabled = false
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || disabled) return

    const newFiles: UploadedFile[] = []
    const maxSizeBytes = maxSize * 1024 * 1024

    Array.from(files).forEach((file) => {
      if (file.size > maxSizeBytes) {
        alert(`Le fichier ${file.name} dépasse la taille maximale de ${maxSize}MB`)
        return
      }

      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file
      })
    })

    const updatedFiles = multiple ? [...uploadedFiles, ...newFiles] : newFiles
    setUploadedFiles(updatedFiles)
    onFilesChange(updatedFiles.map(f => f.file))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== id)
    setUploadedFiles(updatedFiles)
    onFilesChange(updatedFiles.map(f => f.file))
  }

  const getFileIcon = (type: string): string => {
    if (type.includes('pdf')) return 'picture_as_pdf'
    if (type.includes('image')) return 'image'
    if (type.includes('word') || type.includes('document')) return 'description'
    return 'insert_drive_file'
  }

  const getFileColor = (type: string): string => {
    if (type.includes('pdf')) return 'text-red-600 bg-red-50 dark:bg-red-900/20'
    if (type.includes('image')) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    if (type.includes('word') || type.includes('document')) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-100 dark:border-slate-700 pb-2">
        <h3 className="text-lg font-bold text-accent dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined">attach_file</span>
          {label}
        </h3>
      </div>

      <div
        className={`rounded-xl border-2 border-dashed ${
          dragActive
            ? 'border-primary bg-primary/10'
            : error
            ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10'
            : 'border-primary/50 dark:border-primary/30 bg-primary/5 dark:bg-primary/5'
        } p-8 flex flex-col items-center justify-center gap-4 text-center transition-colors ${
          !disabled && 'hover:bg-primary/10 cursor-pointer'
        } ${disabled && 'opacity-50 cursor-not-allowed'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="size-16 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-accent">cloud_upload</span>
        </div>
        <div>
          <p className="text-slate-900 dark:text-white font-medium text-lg">
            Cliquez pour télécharger ou glissez-déposez
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {accept.replace(/\./g, '').toUpperCase()} (max. {maxSize}MB)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {/* Liste des fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`size-10 rounded flex items-center justify-center shrink-0 ${getFileColor(file.type)}`}>
                  <span className="material-symbols-outlined">{getFileIcon(file.type)}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-500">{formatFileSize(file.size)} • Uploadé</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(file.id)
                }}
                disabled={disabled}
                className="text-slate-400 hover:text-red-500 transition-colors p-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
