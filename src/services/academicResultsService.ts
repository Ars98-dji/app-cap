// src/services/academicResultsService.ts
import { apiClient } from './api';

export interface Student {
  id: number;
  student_id_number: string;
  last_name: string;
  first_names: string;
  birth_date: string;
}

export interface AcademicYear {
  id: number;
  label: string;
  level: string | null;
}

export interface CourseResult {
  course_name: string;
  course_code: string | null;
  professor: string;
  credits: number;
  coefficient: number;
  semester: number | null;
  average: number;
  retake_average: number | null;
  final_average: number;
  validated: boolean;
  must_retake: boolean;
}

export interface ResultsSummary {
  total_credits: number;
  obtained_credits: number;
  general_average: number;
  year_decision: string | null;
}

export interface AcademicInfo {
  academic_year: string;
  level: string;
}

export interface Results {
  academic_info: AcademicInfo;
  results: CourseResult[];
  summary: ResultsSummary;
}

export interface AuthenticateRequest {
  student_id_number: string;
}

export interface AuthenticateResponse {
  success: boolean;
  data: {
    student: Student;
    academic_years: AcademicYear[];
  };
  message?: string;
}

export interface ResultsRequest {
  student_id: number;
  academic_year_id: number;
}

export interface ResultsResponse {
  success: boolean;
  data: Results;
  message?: string;
}

class AcademicResultsService {
  /**
   * Authentifier un étudiant pour consulter ses résultats
   */
  async authenticate(data: AuthenticateRequest): Promise<AuthenticateResponse> {
    const response = await apiClient.post<AuthenticateResponse>('/api/public/grades/authenticate', data);
    return response as any; // L'API retourne déjà la structure complète
  }

  /**
   * Récupérer les résultats d'un étudiant pour une année académique
   */
  async getResults(data: ResultsRequest): Promise<ResultsResponse> {
    const response = await apiClient.post<ResultsResponse>('/api/public/grades/results', data);
    return response as any; // L'API retourne déjà la structure complète
  }
}

export const academicResultsService = new AcademicResultsService();
