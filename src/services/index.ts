// src/services/index.ts
/**
 * Point d'entrée centralisé pour tous les services
 */

// Export des types en premier (important pour la résolution des dépendances)
export type { 
  DeadlineData, 
  DeadlinePeriod, 
  FiliereSimple, 
  Filiere, 
  Document, 
  Cycle, 
  Department, 
  Administrateur,
  EntryDiploma,
  AcademicYear,
  ContactFormData,
  ContactResponse
} from './types';

export type { ApiError } from './api';

export type {
  CandidatureType,
  SubmissionResponse
} from './enrollmentService';

export type {
  LookupMatriculeRequest,
  AssignMatriculeRequest,
  MatriculeResponse
} from './studentService';

export type { ImportantInformation } from './rhService';

// Export du client API
export { apiClient, API_BASE_URL } from './api';

// Export des services administration
export { 
  getAdministrationUsers, 
  getSoutienInformatique, 
  formatAdministrateurForDisplay 
} from './administrationService';

// Export des services
export * from './inscriptionService';
export * from './documentService';
export { referenceDataService } from './referenceDataService';
export { enrollmentService } from './enrollmentService';
export { studentService } from './studentService';
export { rhService } from './rhService';
export { default as contactService } from './contactService';
export { defenseService } from './defenseService';
export { academicResultsService } from './academicResultsService';
