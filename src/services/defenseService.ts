// src/services/defenseService.ts
import { apiClient } from './api';

export interface DefenseSubmissionData {
  last_name: string;
  first_names: string;
  email: string;
  contacts: string[];
  student_id_number?: string;
  defense_submission_period_id?: number;
  thesis_title: string;
  professor_id?: string | number;
  defense_type: 'licence' | 'master';
  department_id: number;
  thesis_file: File;
  additional_files?: File[];
}

export interface QuitusData {
  nom: string;
  prenom: string;
  titre: string;
  diplome: string;
  nometu: string;
  prenometu: string;
  grade: string;
  filiere: string;
  intitule: string;
}

export interface CorrectionData {
  nom: string;
  prenom: string;
  statut: string;
  titre: string;
  nometu: string;
  prenometu: string;
  diplome: string;
  date_soutenance: string;
}

export interface Professor {
  id: number;
  first_name: string;
  last_name: string;
  grade?: { name: string };
}

export interface Grade {
  id: number;
  name: string;
  abbreviation: string;
}

class DefenseService {
  /**
   * Soumettre un dossier de soutenance
   */
  async submitDefense(data: DefenseSubmissionData): Promise<any> {
    const formData = new FormData();
    
    formData.append('last_name', data.last_name);
    formData.append('first_names', data.first_names);
    formData.append('email', data.email);
    data.contacts.forEach((contact, index) => {
      formData.append(`contacts[${index}]`, contact);
    });
    
    if (data.student_id_number) {
      formData.append('student_id_number', data.student_id_number);
    }
    
    if (data.defense_submission_period_id) {
      formData.append('defense_submission_period_id', data.defense_submission_period_id.toString());
    }
    
    formData.append('thesis_title', data.thesis_title);
    
    if (data.professor_id) {
      formData.append('professor_id', data.professor_id.toString());
    }
    formData.append('defense_type', data.defense_type);
    formData.append('department_id', data.department_id.toString());
    formData.append('thesis_file', data.thesis_file);
    
    if (data.additional_files) {
      data.additional_files.forEach((file, index) => {
        formData.append(`additional_files[${index}]`, file);
      });
    }

    return apiClient.postFormData('/api/soutenance/submissions', formData);
  }

  /**
   * Générer un PDF de quitus
   */
  async generateQuitus(data: QuitusData): Promise<Blob> {
    const response = await apiClient.fetchRaw('/api/soutenance/validation_qui', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la génération du quitus');
    }

    return response.blob();
  }

  /**
   * Générer un PDF de correction
   */
  async generateCorrection(data: CorrectionData): Promise<Blob> {
    const response = await apiClient.fetchRaw('/api/soutenance/correction_post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la génération de l\'attestation de correction');
    }

    return response.blob();
  }

  /**
   * Télécharger un PDF généré
   */
  downloadPdf(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Récupérer la liste des professeurs
   */
  async getProfessors(): Promise<Professor[]> {
    const response = await apiClient.get<Professor[]>('/api/rh/professors');
    return response.data || [];
  }

  /**
   * Récupérer la liste des grades
   */
  async getGrades(): Promise<Grade[]> {
    const response = await apiClient.get<Grade[]>('/api/rh/grades');
    return response.data || [];
  }
}

export const defenseService = new DefenseService();
