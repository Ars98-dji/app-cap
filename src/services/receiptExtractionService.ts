
const RECEIPT_EXTRACTION_API = 'https://spodoptera.xyz/extract/api/extract'

export interface ExtractionResult {
  date_versement: string | null
  reference: string | null
  numero_compte: string | null
  payeur: string | null
  motif: string | null
  montant: string | null
}

export interface ReceiptExtractionResponse {
  success: boolean
  data?: ExtractionResult
  error?: string
}

/**
 * Service d'extraction automatique des données de quittance
 * Utilise l'API d'extraction pour récupérer les informations des reçus
 */
export const receiptExtractionService = {
  /**
   * Extrait les données d'une quittance (PDF ou Image)
   * @param file - Le fichier de quittance à analyser
   * @returns Promise<ReceiptExtractionResponse>
   */
  async extractReceiptData(file: File): Promise<ReceiptExtractionResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(RECEIPT_EXTRACTION_API, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data: ExtractionResult = await response.json()
        
        // Vérifier si toutes les données sont null
        const allNull = Object.values(data).every(value => value === null)
        
        if (allNull) {
          return {
            success: false,
            error: '⚠️ Impossible d\'extraire les données. Veuillez uploader une quittance de la BOA claire et lisible.',
          }
        }
        
        // Convertir la date du format dd.mm.yyyy vers yyyy-mm-dd
        if (data.date_versement) {
          data.date_versement = this.convertDateFormat(data.date_versement)
        }
        
        // Combiner payeur et motif
        const combinedMotif = this.combinePayeurMotif(data.payeur, data.motif)
        if (combinedMotif) {
          data.motif = combinedMotif
        }
        
        return {
          success: true,
          data,
        }
      }

      // Gérer les erreurs de validation (422)
      if (response.status === 422) {
        const errorData = await response.json()
        const detail = errorData?.detail
        let errorMessage = 'Impossible d\'extraire les données de la quittance'

        if (Array.isArray(detail) && detail.length > 0) {
          errorMessage = detail.map((err: any) => err.msg).join(', ')
        } else if (typeof detail === 'string') {
          errorMessage = detail
        }

        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Erreur lors de l\'extraction des données',
      }
    } catch (error: any) {
      console.error('Erreur extraction quittance:', error)

      return {
        success: false,
        error: error.message || 'Erreur lors de l\'extraction des données',
      }
    }
  },

  /**
   * Convertit une date du format dd.mm.yyyy vers yyyy-mm-dd
   */
  convertDateFormat(dateStr: string | null): string | null {
    if (!dateStr) return null
    
    // Format dd.mm.yyyy ou dd/mm/yyyy
    const match = dateStr.match(/(\d{2})[./](\d{2})[./](\d{4})/)
    if (match) {
      const [, day, month, year] = match
      return `${year}-${month}-${day}`
    }
    
    return dateStr
  },

  /**
   * Combine le payeur et le motif
   */
  combinePayeurMotif(payeur: string | null, motif: string | null): string | null {
    if (payeur && motif) {
      return `${payeur} - ${motif}`
    }
    return motif || payeur || null
  },
  formatExtractionData(data: ExtractionResult): string[] {
    const formatted: string[] = []
    
    if (data.montant) formatted.push(`Montant: ${data.montant}`)
    if (data.date_versement) formatted.push(`Date: ${data.date_versement}`)
    if (data.reference) formatted.push(`Référence: ${data.reference}`)
    if (data.payeur) formatted.push(`Payeur: ${data.payeur}`)
    if (data.numero_compte) formatted.push(`N° Compte: ${data.numero_compte}`)
    if (data.motif) formatted.push(`Motif: ${data.motif}`)
    
    return formatted
  },
}
