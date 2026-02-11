/**
 * Exemple de formulaire de contact utilisant les services API
 * avec gestion d'erreurs explicites
 */

import { useState } from 'react';
import { useApiAction } from '../hooks/useApi';
import { contactService } from '../services';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { SuccessMessage } from '../components/common/SuccessMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export function ContactFormExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const { loading, error, success, execute, reset, setError } = useApiAction(
    contactService.submitContact,
    'Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.'
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Réinitialiser les messages d'erreur/succès lors de la modification
    if (error || success) {
      reset();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client
    if (!formData.name.trim()) {
      setError('Veuillez entrer votre nom.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    if (!formData.subject.trim()) {
      setError('Veuillez entrer un sujet.');
      return;
    }

    if (!formData.message.trim()) {
      setError('Veuillez entrer votre message.');
      return;
    }

    // Soumettre le formulaire
    const result = await execute(formData);

    // Si succès, réinitialiser le formulaire
    if (result) {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>

      {/* Messages d'erreur et de succès */}
      <ErrorMessage error={error} onClose={reset} className="mb-4" />
      <SuccessMessage message={success} onClose={reset} className="mb-4" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Jean Dupont"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="jean.dupont@example.com"
          />
        </div>

        {/* Sujet */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Sujet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Question sur les inscriptions"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            disabled={loading}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            placeholder="Bonjour, j'aimerais avoir des informations sur..."
          />
        </div>

        {/* Bouton de soumission */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner size="sm" message="" className="mr-2" />
                Envoi en cours...
              </span>
            ) : (
              'Envoyer le message'
            )}
          </button>
        </div>
      </form>

      {/* Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Tous les champs marqués d'un astérisque (*) sont obligatoires.
          Nous nous efforçons de répondre à tous les messages dans un délai de 48 heures.
        </p>
      </div>
    </div>
  );
}
