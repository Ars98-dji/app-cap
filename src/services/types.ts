// src/services/types.ts
/**
 * Types TypeScript pour les réponses API
 */

export interface FiliereSimple {
  id: number;
  name: string;
  abbreviation: string;
  cycle: 'licence' | 'master' | 'ingenierie';
}

export interface DeadlinePeriod {
  deadline: string;
  filieres: FiliereSimple[];
}

export interface DeadlineData {
  status: 'open' | 'closed';
  periods: DeadlinePeriod[];
}

export interface Filiere {
  id: number;
  title: string;
  abbreviation: string;
  cycle: 'licence' | 'master' | 'ingenierie';
  dateLimite: string | null;
  image: string;
  badge: 'inscriptions-ouvertes' | 'inscriptions-fermees' | 'prochainement' | null;
}

export interface Document {
  id: number;
  titre: string;
  description: string;
  type: 'pdf' | 'doc' | 'xls' | 'ppt' | 'lien';
  taille?: string;
  datePublication: string;
  lien: string;
  categorie: 'administratif' | 'pedagogique' | 'legal' | 'organisation';
}

export interface Cycle {
  id: number;
  name: string;
  description?: string;
  departments?: Department[];
}

export interface Department {
  id: number;
  title: string;
  name: string;
  abbreviation?: string;
  cycle_id?: number;
  cycle?: string | Cycle;  // Peut être une string ou un objet Cycle
  dateLimite?: string | null;
  image?: string;
  badge?: string;
}

export interface Administrateur {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo?: string;
  roles: Array<{
    id: number;
    name: string;
    display_name: string;
  }>;
}

export interface EntryDiploma {
  id: number;
  name: string;
}

export interface AcademicYear {
  id: number;
  academic_year: string;
  year_start: string;
  year_end: string;
  submission_start?: string;
  submission_end?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    created_at: string;
  };
  error?: string;
}
