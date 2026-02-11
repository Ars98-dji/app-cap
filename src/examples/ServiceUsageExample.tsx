/**
 * Exemples d'utilisation des services API
 * Ce fichier montre comment utiliser les différents services avec gestion d'erreurs
 */

import { useState } from 'react';
import {
  getFilieres,
  getDocuments,
  enrollmentService,
  studentService,
  contactService,
  referenceDataService,
  type Filiere,
  type Document,
  type EntryDiploma
} from '../services';

export function ServiceUsageExample() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Exemple 1: Récupérer les filières
  const handleGetFilieres = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const filieres: Filiere[] = await getFilieres();
      setSuccess(`${filieres.length} filières récupérées avec succès!`);
      console.log('Filières:', filieres);
    } catch (err: any) {
      // Le message d'erreur est déjà explicite
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Exemple 2: Récupérer les documents
  const handleGetDocuments = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const documents: Document[] = await getDocuments();
      setSuccess(`${documents.length} documents récupérés avec succès!`);
      console.log('Documents:', documents);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Exemple 3: Rechercher un matricule
  const handleLookupMatricule = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await studentService.lookupMatricule({
        last_name: 'DUPONT',
        first_names: 'Jean Pierre',
        birth_date: '2000-01-15',
        birth_place: 'Cotonou'
      });
      setSuccess(`Matricule trouvé: ${result.student_id_number}`);
      console.log('Matricule:', result);
    } catch (err: any) {
      // Message explicite: "Aucun matricule trouvé avec ces informations..."
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Exemple 4: Soumettre une candidature
  const handleSubmitCandidature = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('first_name', 'Jean');
      formData.append('last_name', 'Dupont');
      formData.append('email', 'jean.dupont@example.com');
      formData.append('phone', '+22997123456');
      formData.append('birth_date', '2000-01-15');
      formData.append('birth_place', 'Cotonou');
      formData.append('department_id', '1');
      formData.append('academic_year_id', '1');
      // ... autres champs requis

      const result = await enrollmentService.submitLicence(formData);
      setSuccess(`Candidature soumise! Code de suivi: ${result.tracking_code || result.data?.tracking_code}`);
      console.log('Résultat:', result);
    } catch (err: any) {
      // Message explicite avec détails de validation si disponibles
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Exemple 5: Envoyer un message de contact
  const handleSendContact = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await contactService.submitContact({
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        subject: 'Question sur les inscriptions',
        message: 'Bonjour, j\'aimerais avoir des informations sur les inscriptions en Licence.'
      });

      if (response.success) {
        setSuccess('Message envoyé avec succès!');
      } else {
        setError(response.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Exemple 6: Récupérer les diplômes d'entrée
  const handleGetDiplomas = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const diplomas: EntryDiploma[] = await referenceDataService.getEntryDiplomas();
      setSuccess(`${diplomas.length} diplômes d'entrée récupérés!`);
      console.log('Diplômes:', diplomas);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Exemple 7: Récupérer les départements par cycle
  const handleGetDepartmentsByCycle = async (cycle: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const departments = await referenceDataService.getDepartments(cycle);
      setSuccess(`${departments.length} départements trouvés pour le cycle ${cycle}!`);
      console.log(`Départements ${cycle}:`, departments);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Exemple 8: Récupérer un dossier par code de suivi
  const handleGetDossier = async (trackingCode: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const dossier = await enrollmentService.getDossier(trackingCode);
      setSuccess('Dossier récupéré avec succès!');
      console.log('Dossier:', dossier);
    } catch (err: any) {
      // Message explicite: "Le code de suivi ... est invalide..."
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Exemples d'utilisation des Services API</h1>

      {/* Messages de statut */}
      {loading && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded">
          Chargement en cours...
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          <strong>Erreur:</strong> {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          <strong>Succès:</strong> {success}
        </div>
      )}

      {/* Boutons d'exemple */}
      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">1. Récupérer les filières</h2>
          <button
            onClick={handleGetFilieres}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Tester getFilieres()
          </button>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">2. Récupérer les documents</h2>
          <button
            onClick={handleGetDocuments}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Tester getDocuments()
          </button>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">3. Rechercher un matricule</h2>
          <button
            onClick={handleLookupMatricule}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Tester lookupMatricule()
          </button>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">4. Soumettre une candidature</h2>
          <button
            onClick={handleSubmitCandidature}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Tester submitLicence()
          </button>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">5. Envoyer un message de contact</h2>
          <button
            onClick={handleSendContact}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Tester submitContact()
          </button>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">6. Récupérer les diplômes d'entrée</h2>
          <button
            onClick={handleGetDiplomas}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Tester getEntryDiplomas()
          </button>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">7. Récupérer les départements par cycle</h2>
          <div className="space-x-2">
            <button
              onClick={() => handleGetDepartmentsByCycle('licence')}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Licence
            </button>
            <button
              onClick={() => handleGetDepartmentsByCycle('master')}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Master
            </button>
            <button
              onClick={() => handleGetDepartmentsByCycle('ingenierie')}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Ingénierie
            </button>
          </div>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">8. Récupérer un dossier</h2>
          <button
            onClick={() => handleGetDossier('TEST123')}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Tester getDossier('TEST123')
          </button>
        </div>
      </div>

      {/* Documentation */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">📚 Documentation</h3>
        <p className="text-sm text-gray-700">
          Consultez le fichier <code>src/services/README.md</code> pour plus d'informations
          sur l'utilisation des services API.
        </p>
      </div>
    </div>
  );
}
