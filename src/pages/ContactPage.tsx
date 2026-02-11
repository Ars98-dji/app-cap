import { useState } from 'react'
import { PageLayout, ErrorMessage, SuccessMessage } from '@/components/common'
import { useForm } from '@/hooks'
import contactService from '@/services/contactService'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

const ContactPage = () => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset } = useForm<ContactFormData>({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    onSubmit: async (values: ContactFormData) => {
      setSubmitError(null)
      setSubmitSuccess(null)

      try {
        const response = await contactService.submitContact(values)
        
        if (response.success) {
          setSubmitSuccess(response.message || 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.')
          reset()
          
          // Faire défiler vers le haut pour voir le message de succès
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          setSubmitError(response.error || response.message || 'Une erreur est survenue lors de l\'envoi de votre message.')
        }
      } catch (error: any) {
        setSubmitError(error.message || 'Impossible d\'envoyer votre message. Veuillez réessayer plus tard.')
      }
    },
    validate: (values: ContactFormData) => {
      const errors: Partial<Record<keyof ContactFormData, string>> = {}
      
      if (!values.name || values.name.trim().length === 0) {
        errors.name = 'Le nom est requis'
      } else if (values.name.trim().length < 2) {
        errors.name = 'Le nom doit contenir au moins 2 caractères'
      }
      
      if (!values.email || values.email.trim().length === 0) {
        errors.email = 'L\'email est requis'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Veuillez entrer une adresse email valide'
      }
      
      if (!values.subject || values.subject.trim().length === 0) {
        errors.subject = 'Le sujet est requis'
      }
      
      if (!values.message || values.message.trim().length === 0) {
        errors.message = 'Le message est requis'
      } else if (values.message.trim().length < 10) {
        errors.message = 'Le message doit contenir au moins 10 caractères'
      }
      
      return errors
    }
  })

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative bg-background-light dark:bg-background-dark py-12 px-4 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div
            className="rounded-2xl overflow-hidden relative min-h-[320px] md:min-h-[400px] flex items-center justify-center text-center p-8 bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 23, 23, 0.7), rgba(18, 23, 23, 0.6)), url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200")'
            }}
          >
            <div className="relative z-10 max-w-3xl flex flex-col gap-4">
              <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight">Contactez-nous</h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                Des questions sur nos programmes ou admissions ? Contactez notre administration directement.
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-text-main dark:text-white">Entrez en contact</h2>
                <p className="text-text-secondary dark:text-gray-400">
                  Nos bureaux administratifs sont ouverts du lundi au vendredi, de 8h00 à 17h00.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="group flex items-start gap-4 p-5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary/30 transition-colors">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-text-main dark:text-white">Visitez-nous</h3>
                    <p className="text-sm text-text-secondary dark:text-gray-400">
                      Campus d'Abomey-Calavi<br />Bénin
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary/30 transition-colors">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-text-main dark:text-white">Appelez-nous</h3>
                    <p className="text-sm text-text-secondary dark:text-gray-400">+229 01 91 94 73 67</p>
                    <p className="text-xs text-text-secondary/70 dark:text-gray-500 mt-1">Lun-Ven 8h-18h</p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary/30 transition-colors">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-text-main dark:text-white">Écrivez-nous</h3>
                    <a href="mailto:secretariat@cap-epac.bj" className="text-sm text-primary hover:underline font-medium">
                      contact@cap-epac.online
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-2xl shadow-sm border border-border-light dark:border-border-dark h-full">
                <div className="flex flex-col gap-6 mb-8">
                  <h2 className="text-2xl font-bold text-text-main dark:text-white">Envoyez-nous un message</h2>
                  <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                    Remplissez le formulaire ci-dessous pour toute demande. Nous répondons sous 24-48h ouvrables.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-sm font-semibold text-text-main dark:text-gray-200">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Jean Dupont"
                        disabled={isSubmitting}
                        className="w-full rounded-lg border border-border-light bg-background-light dark:bg-background-dark/50 dark:border-border-dark px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {errors.name && <span className="text-red-500 text-xs font-medium">{errors.name}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-semibold text-text-main dark:text-gray-200">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="jean.dupont@example.com"
                        disabled={isSubmitting}
                        className="w-full rounded-lg border border-border-light bg-background-light dark:bg-background-dark/50 dark:border-border-dark px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {errors.email && <span className="text-red-500 text-xs font-medium">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-sm font-semibold text-text-main dark:text-gray-200">
                      Sujet <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={values.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-border-light bg-background-light dark:bg-background-dark/50 dark:border-border-dark px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text-main dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="admissions">Demande d'admission</option>
                      <option value="programs">Programmes académiques</option>
                      <option value="student-services">Services étudiants</option>
                      <option value="general">Information générale</option>
                      <option value="technical">Support technique</option>
                      <option value="other">Autre</option>
                    </select>
                    {errors.subject && <span className="text-red-500 text-xs font-medium">{errors.subject}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-semibold text-text-main dark:text-gray-200">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={values.message}
                      onChange={handleChange}
                      placeholder="Comment pouvons-nous vous aider ?"
                      rows={6}
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-border-light bg-background-light dark:bg-background-dark/50 dark:border-border-dark px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 resize-none dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {errors.message && <span className="text-red-500 text-xs font-medium">{errors.message}</span>}
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 flex w-full md:w-auto md:self-start items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <span>Envoyer le message</span>
                          <span className="material-symbols-outlined text-[20px]">send</span>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-text-secondary dark:text-gray-400">
                      <span className="text-red-500">*</span> Champs obligatoires
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  )
}

export default ContactPage
