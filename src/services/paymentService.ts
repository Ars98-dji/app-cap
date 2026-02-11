import { apiClient } from './api'

export interface StudentInfo {
  id: number
  student_id_number: string
  nom?: string
  prenoms?: string
  email?: string
  tel?: string
  filieres: Array<{
    id: number
    nom: string
  }>
  has_no_filieres: boolean
  message?: string | null
}

export const paymentService = {
  /**
   * Récupérer les informations d'un étudiant par son matricule
   */
  async getStudentInfo(matricule: string): Promise<StudentInfo | null> {
    try {
      const response = await apiClient.get<StudentInfo>(`/api/finance/students/${matricule}`)
      return response.data as StudentInfo
    } catch (error) {
      console.error('Erreur récupération étudiant:', error)
      return null
    }
  },
}
