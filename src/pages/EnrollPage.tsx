import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PageLayout } from '@/components/common'
import { 
  LicenceForm, 
  MasterForm, 
  IngenieurPrepaForm, 
  IngenieurSpecialiteForm, 
  ComplementDossierForm, 
  PaiementForm 
} from '@/components/enrollment'
import { SuiviDossierForm, MatriculeForm } from '@/components/enrollment-forms'

type CandidatureType = 'licence' | 'master' | 'ingenieur_prepa' | 'ingenieur_specialite' | 'complement' | 'suivi' | 'matricule' | 'paiement'

interface CandidatureOption {
  id: CandidatureType
  title: string
  description: string
  icon: string
  color: string
  requirements: string[]
}

const candidatures: CandidatureOption[] = [
  {
    id: 'licence',
    title: 'Licence',
    description: 'Programme de Licence (Bac+3) - Formation professionnelle continue',
    icon: 'school',
    color: '#28a745',
    requirements: [
      'Lettre de Demande (requis)',
      'CV (requis)',
      'Acte de naissance (requis)',
      'Diplôme Baccalauréat (requis)',
      'Attestation de travail (requis)',
      'Quittance Rectorat (requis)',
      'Quittance CAP (requis)',
      'Photo d\'identité (optionnel)',
      'Diplôme Licence (optionnel)'
    ]
  },
  {
    id: 'master',
    title: 'Master',
    description: 'Programme de Master (Bac+5) - Spécialisation professionnelle',
    icon: 'workspace_premium',
    color: '#007bff',
    requirements: [
      'Lettre de Demande (requis)',
      'CV (requis)',
      'Acte de naissance (requis)',
      'Diplôme Baccalauréat (requis)',
      'Diplôme Licence (requis)',
      'Attestation de travail (requis)',
      'Quittance Rectorat (requis)',
      'Quittance CAP (requis)',
      'Photo (optionnel)',
      'Attestation anglais (optionnel)'
    ]
  },
  {
    id: 'ingenieur_prepa',
    title: 'Ingénieur - Prépa',
    description: 'Cycle préparatoire ingénieur (1ère année)',
    icon: 'rocket_launch',
    color: '#dc3545',
    requirements: [
      'Lettre de Demande (requis)',
      'CV (requis)',
      'Acte de naissance (requis)',
      'Diplôme Baccalauréat (requis)',
      'Diplôme Licence (requis)',
      'Attestation de travail (requis)',
      'Quittance CAP (requis)',
      'Photo d\'identité (optionnel)'
    ]
  },
  {
    id: 'ingenieur_specialite',
    title: 'Ingénieur - Spécialité',
    description: 'Cycle spécialité ingénieur (après prépa)',
    icon: 'engineering',
    color: '#ffc107',
    requirements: [
      'Lettre de Demande (requis)',
      'CV (requis)',
      'Acte de naissance (requis)',
      'Certificat prépa + Attestation (requis)',
      'Diplôme Bac + Licence (requis)',
      'Attestation de travail (requis)',
      'Quittance Rectorat (requis)',
      'Quittance CAP (requis)',
      'Photo d\'identité (optionnel)'
    ]
  },
  {
    id: 'complement',
    title: 'Complément de dossier',
    description: 'Ajouter des pièces manquantes selon votre type de candidature',
    icon: 'note_add',
    color: '#17a2b8',
    requirements: [
      'Type de candidature (Licence, Master, Ingénieur)',
      'Code de suivi du dossier',
      'Documents manquants selon le type',
      'Format: PDF, JPG, PNG (max 5 Mo)'
    ]
  },
  {
    id: 'suivi',
    title: 'Suivi de dossier',
    description: 'Consulter l\'état de votre candidature',
    icon: 'search',
    color: '#6c757d',
    requirements: [
      'Code de suivi reçu par email',
      'Vérifier le statut du dossier',
      'Voir les pièces manquantes',
      'Télécharger les justificatifs'
    ]
  }
]

const EnrollPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCandidature, setSelectedCandidature] = useState<CandidatureType | null>(null)
  const [foundMatricule, setFoundMatricule] = useState<string | null>(null)
  const [returnToForm, setReturnToForm] = useState<CandidatureType | null>(null)

  useEffect(() => {
    const typeParam = searchParams.get('type') as CandidatureType | null
    const validTypes: CandidatureType[] = ['licence', 'master', 'ingenieur_prepa', 'ingenieur_specialite', 'complement', 'suivi', 'matricule', 'paiement']
    
    if (typeParam && validTypes.includes(typeParam)) {
      setSelectedCandidature(typeParam)
    } else if (!typeParam) {
      setSelectedCandidature(null)
    }
  }, [searchParams])

  const handleSelectCandidature = (type: CandidatureType) => {
    setSelectedCandidature(type)
    setSearchParams({ type })
  }

  const handleCancelForm = () => {
    setSelectedCandidature(null)
    setSearchParams({})
    setFoundMatricule(null)
    setReturnToForm(null)
  }

  const handleRequestMatricule = (fromForm: CandidatureType) => {
    setReturnToForm(fromForm)
    setSelectedCandidature('matricule')
  }

  const handleMatriculeFound = (matricule: string) => {
    setFoundMatricule(matricule)
    if (returnToForm) {
      setSelectedCandidature(returnToForm)
      setReturnToForm(null)
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
              backgroundImage: 'linear-gradient(rgba(18, 23, 23, 0.7), rgba(18, 23, 23, 0.6)), url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200")'
            }}
          >
            <div className="relative z-10 max-w-3xl flex flex-col gap-4">
              <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight">
                {selectedCandidature ? 'Formulaire de Candidature' : 'Candidatures et Gestion de dossiers'}
              </h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                {selectedCandidature 
                  ? 'Remplissez le formulaire ci-dessous pour soumettre votre candidature'
                  : 'Soumettez votre candidature pour les programmes Licence, Master ou Ingénieur, complétez votre dossier ou suivez l\'état de votre candidature'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow px-4 md:px-10 py-8">
        <div className="max-w-[1280px] mx-auto">
          {!selectedCandidature ? (
            // Grid des options de candidature
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidatures.map((candidature) => (
                <div
                  key={candidature.id}
                  onClick={() => handleSelectCandidature(candidature.id)}
                  className="group cursor-pointer bg-white dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl shrink-0"
                      style={{ backgroundColor: `${candidature.color}15`, color: candidature.color }}
                    >
                      <span className="material-symbols-outlined text-3xl">{candidature.icon}</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">{candidature.title}</h3>
                      <p className="text-sm text-text-secondary dark:text-gray-400">{candidature.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex-grow flex flex-col">
                    <h4 className="text-sm font-semibold text-text-main dark:text-gray-300 mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Pièces requises :
                    </h4>
                    <ul className="space-y-1 flex-grow min-h-[120px]">
                      {candidature.requirements.slice(0, 4).map((req, idx) => (
                        <li key={idx} className="text-xs text-text-secondary dark:text-gray-400 flex items-start gap-2">
                          <span className="material-symbols-outlined text-[14px] mt-0.5">chevron_right</span>
                          <span>{req}</span>
                        </li>
                      ))}
                      {candidature.requirements.length > 4 && (
                        <li className="text-xs text-text-secondary dark:text-gray-400 italic">
                          +{candidature.requirements.length - 4} autres...
                        </li>
                      )}
                    </ul>
                  </div>

                  <button
                    className="mt-6 w-full py-3 rounded-lg font-bold text-white transition-all"
                    style={{ backgroundColor: candidature.color }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>Commencer</span>
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            // Formulaire sélectionné
            <div className="max-w-5xl mx-auto">
              {/* Breadcrumb et bouton retour */}
              <div className="mb-6 flex flex-col gap-4">
                <nav className="flex items-center text-sm text-text-secondary dark:text-gray-400">
                  <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
                  <span className="mx-2">/</span>
                  <Link to="/enroll" className="hover:text-primary transition-colors">Candidatures</Link>
                  <span className="mx-2">/</span>
                  <span className="font-medium text-primary">
                    {candidatures.find(c => c.id === selectedCandidature)?.title}
                  </span>
                </nav>
                <button
                  onClick={handleCancelForm}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group w-fit"
                >
                  <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
                  Retour aux options
                </button>
              </div>

              {/* Le formulaire sera rendu ici selon le type */}
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800">
                  <div className="h-full bg-primary w-1/3 rounded-r-full"></div>
                </div>
                <div className="p-6 md:p-10">
                  {selectedCandidature === 'licence' && <LicenceForm onCancel={handleCancelForm} />}
                  {selectedCandidature === 'master' && <MasterForm onCancel={handleCancelForm} />}
                  {selectedCandidature === 'ingenieur_prepa' && <IngenieurPrepaForm onCancel={handleCancelForm} />}
                  {selectedCandidature === 'ingenieur_specialite' && (
                    <IngenieurSpecialiteForm 
                      onCancel={handleCancelForm}
                      onRequestMatricule={() => handleRequestMatricule('ingenieur_specialite')}
                      initialMatricule={foundMatricule}
                    />
                  )}
                  {selectedCandidature === 'complement' && <ComplementDossierForm onCancel={handleCancelForm} />}
                  {selectedCandidature === 'paiement' && (
                    <PaiementForm 
                      onCancel={handleCancelForm}
                      onRequestMatricule={() => handleRequestMatricule('paiement')}
                      initialMatricule={foundMatricule}
                    />
                  )}
                  {selectedCandidature === 'suivi' && <SuiviDossierForm onCancel={handleCancelForm} />}
                  {selectedCandidature === 'matricule' && (
                    <MatriculeForm 
                      onCancel={handleCancelForm}
                      onMatriculeFound={handleMatriculeFound}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  )
}

export default EnrollPage
