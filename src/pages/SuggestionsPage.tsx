import { useState } from 'react'
import { PageLayout, ErrorMessage, SuccessMessage } from '@/components/common'
import { FormField, FormSelect, FormTextarea } from '@/components/forms'

interface SuggestionFormData {
  name: string
  email: string
  category: string
  subject: string
  message: string
}

const SuggestionsPage = () => {
  const [formData, setFormData] = useState<SuggestionFormData>({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SuggestionFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const categories = [
    { value: 'enseignement', label: 'Enseignement et Pédagogie' },
    { value: 'infrastructure', label: 'Infrastructure et Équipements' },
    { value: 'administration', label: 'Services Administratifs' },
    { value: 'vie_etudiante', label: 'Vie Étudiante' },
    { value: 'bibliotheque', label: 'Bibliothèque et Documentation' },
    { value: 'restauration', label: 'Restauration' },
    { value: 'securite', label: 'Sécurité' },
    { value: 'autre', label: 'Autre' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof SuggestionFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SuggestionFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide'
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis'
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Le sujet doit contenir au moins 5 caractères'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis'
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Le message doit contenir au moins 20 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)

    if (!validate()) return

    setIsSubmitting(true)

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSubmitSuccess('Votre suggestion a été envoyée avec succès ! Merci pour votre contribution à l\'amélioration de notre établissement.')
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: ''
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error: any) {
      setSubmitError(error.message || 'Une erreur est survenue lors de l\'envoi de votre suggestion.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative bg-background-light dark:bg-background-dark py-12 px-4 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div
            className="rounded-2xl overflow-hidden relative min-h-[320px] md:min-h-[400px] flex items-center justify-center text-center p-8 bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 23, 23, 0.7), rgba(18, 23, 23, 0.6)), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200")'
            }}
          >
            <div className="relative z-10 max-w-3xl flex flex-col gap-4">
              <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight">
                Boîte à Suggestions
              </h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                Votre avis compte ! Partagez vos idées et suggestions pour améliorer notre établissement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow px-4 md:px-10 py-8">
        <div className="max-w-[1280px] mx-auto">
          {/* Messages de succès et d'erreur */}
          {submitSuccess && (
            <div className="mb-6">
              <SuccessMessage message={submitSuccess} onClose={() => setSubmitSuccess(null)} />
            </div>
          )}
          
          {submitError && (
            <div className="mb-6">
              <ErrorMessage error={submitError} onClose={() => setSubmitError(null)} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Form */}
            <div className="lg:col-span-8">
              <div className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                <div className="flex flex-col gap-6 mb-8">
                  <h2 className="text-2xl font-bold text-text-main dark:text-white">Partagez votre suggestion</h2>
                  <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                    Vos suggestions nous aident à améliorer continuellement nos services et infrastructures. Toutes les suggestions sont lues et prises en compte.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Nom complet"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jean Dupont"
                      icon="person"
                      required
                      error={errors.name}
                      disabled={isSubmitting}
                    />

                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jean.dupont@example.com"
                      icon="mail"
                      required
                      error={errors.email}
                      disabled={isSubmitting}
                    />
                  </div>

                  <FormSelect
                    label="Catégorie"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categories}
                    placeholder="Sélectionnez une catégorie"
                    required
                    error={errors.category}
                    disabled={isSubmitting}
                  />

                  <FormField
                    label="Sujet"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Résumé de votre suggestion"
                    required
                    error={errors.subject}
                    disabled={isSubmitting}
                  />

                  <FormTextarea
                    label="Votre suggestion"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre suggestion en détail..."
                    rows={8}
                    maxLength={1000}
                    required
                    error={errors.message}
                    disabled={isSubmitting}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 flex w-full md:w-auto md:self-start items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>Envoyer la suggestion</span>
                        <span className="material-symbols-outlined text-[20px]">send</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Info */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">lightbulb</span>
                  <h3 className="font-bold text-blue-900 dark:text-blue-300 text-lg">Pourquoi suggérer ?</h3>
                </div>
                <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-400">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] mt-0.5">check_circle</span>
                    <span>Contribuez à l'amélioration de votre établissement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] mt-0.5">check_circle</span>
                    <span>Partagez vos idées innovantes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] mt-0.5">check_circle</span>
                    <span>Signalez des problèmes à résoudre</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] mt-0.5">check_circle</span>
                    <span>Proposez de nouveaux services</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">verified</span>
                  <h3 className="font-bold text-green-900 dark:text-green-300 text-lg">Confidentialité</h3>
                </div>
                <p className="text-sm text-green-800 dark:text-green-400">
                  Vos informations personnelles sont protégées et ne seront utilisées que pour le traitement de votre suggestion.
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-2xl">schedule</span>
                  <h3 className="font-bold text-orange-900 dark:text-orange-300 text-lg">Traitement</h3>
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-400">
                  Toutes les suggestions sont examinées par notre équipe. Les plus pertinentes sont mises en œuvre rapidement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  )
}

export default SuggestionsPage
