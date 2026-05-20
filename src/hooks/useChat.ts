import { useState, useRef, useCallback } from 'react'
import { sendMessage } from '../services/chatService'
import {
  extractMatriculeFromMessage,
  isValidMatricule,
  extractEmailFromMessage,
  isValidEmail,
} from '../utils/chatHelpers'
import type { Message, PendingAction } from '../types/chat'

const MAX_AUTH_ATTEMPTS = 3

function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function getWelcomeMessage(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12)
    return "Bonjour ! Je suis l'assistant du CAP-EPAC 👋 Comment puis-je vous aider ? (Formations, Notes, Emploi du temps…)"
  if (h >= 12 && h < 18)
    return "Bon après-midi ! Je suis l'assistant du CAP-EPAC 👋 Comment puis-je vous aider ? (Inscription, Cours, Consultation de note…)"
  return "Bonsoir ! Je suis l'assistant du CAP-EPAC 👋 Comment puis-je vous aider ? (Inscription, Cours, Consultation de note…)"
}

const MSG_SKIP_AUTH =
  "Pas de problème, je peux quand même vous aider ! 😊<br>" +
  "Je peux vous renseigner sur les <strong>filières</strong>, les <strong>frais de scolarité</strong>, " +
  "les <strong>périodes d'inscription</strong>, les <strong>contacts</strong> et bien plus encore.<br><br>" +
  "Que souhaitez-vous savoir ?"

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: getWelcomeMessage() },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [matricule, setMatricule] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const sessionIdRef = useRef<string>(generateSessionId())

  // Compteur de tentatives d'authentification
  const authAttemptsRef = useRef<number>(0)

  const addBotMessage = (text: string, isHtml = false) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        text,
        isHtml,
      },
    ])
  }

  const send = useCallback(async (text: string) => {
    if (!text.trim() || typing) return

    // ── Validation locale AVANT d'ajouter le message utilisateur ──────────
    if (pendingAction === 'ask_matricule') {
      const mat = extractMatriculeFromMessage(text) ?? text.trim()
      if (!isValidMatricule(mat)) {
        authAttemptsRef.current += 1

        // Vider l'input immédiatement pour éviter la boucle
        setInput('')

        // Ajouter quand même le message utilisateur (pour visibilité)
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: 'user', text },
        ])

        if (authAttemptsRef.current >= MAX_AUTH_ATTEMPTS) {
          // Après 3 échecs : abandonner l'authentification gracieusement
          authAttemptsRef.current = 0
          setPendingAction(null)
          addBotMessage(MSG_SKIP_AUTH, true)
          return
        }

        const remaining = MAX_AUTH_ATTEMPTS - authAttemptsRef.current
        addBotMessage(
          `❌ Matricule invalide. Veuillez entrer uniquement des chiffres (8 à 10 chiffres).<br>` +
          `Exemple : <strong>20210001</strong><br>` +
          `<em>Il vous reste ${remaining} tentative${remaining > 1 ? 's' : ''}. ` +
          `Tapez <strong>passer</strong> pour continuer sans vous connecter.</em>`,
          true,
        )
        return
      }
      // Matricule valide → reset compteur
      authAttemptsRef.current = 0
    }

    if (pendingAction === 'ask_email') {
      const mail = extractEmailFromMessage(text) ?? text.trim()
      if (!isValidEmail(mail)) {
        authAttemptsRef.current += 1
        setInput('')

        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: 'user', text },
        ])

        if (authAttemptsRef.current >= MAX_AUTH_ATTEMPTS) {
          authAttemptsRef.current = 0
          setPendingAction(null)
          addBotMessage(MSG_SKIP_AUTH, true)
          return
        }

        const remaining = MAX_AUTH_ATTEMPTS - authAttemptsRef.current
        addBotMessage(
          `❌ Email invalide. Exemple : <strong>nom@domaine.com</strong><br>` +
          `<em>Il vous reste ${remaining} tentative${remaining > 1 ? 's' : ''}. ` +
          `Tapez <strong>passer</strong> pour continuer sans vous connecter.</em>`,
          true,
        )
        return
      }
      authAttemptsRef.current = 0
    }

    // ── Commande "passer" : l'utilisateur veut sauter l'auth ─────────────
    const lower = text.trim().toLowerCase()
    if (
      pendingAction &&
      (lower === 'passer' || lower === 'skip' || lower === 'annuler' || lower === 'non')
    ) {
      setInput('')
      authAttemptsRef.current = 0
      setPendingAction(null)
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'user', text },
      ])
      addBotMessage(MSG_SKIP_AUTH, true)
      return
    }

    // ── Envoi normal ──────────────────────────────────────────────────────
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    const detectedMat =
      pendingAction === 'ask_matricule'
        ? (extractMatriculeFromMessage(text) ?? (isValidMatricule(text.trim()) ? text.trim() : null))
        : (!pendingAction ? extractMatriculeFromMessage(text) : null)

    const detectedEmail =
      pendingAction === 'ask_email'
        ? (extractEmailFromMessage(text) ?? text.trim())
        : (!pendingAction ? extractEmailFromMessage(text) : null)

    const currentMat = matricule ?? detectedMat
    const currentEmail = email ?? detectedEmail

    if (detectedMat && !matricule) setMatricule(detectedMat)
    if (detectedEmail && !email) setEmail(detectedEmail)
    setPendingAction(null)

    try {
      const body: Record<string, unknown> = {
        message: text,
        session_id: sessionIdRef.current,
      }
      if (currentMat) body.matricule = currentMat
      if (currentEmail) body.email = currentEmail

      const data = await sendMessage(body as any)

      if (data.requires_action && data.action_type) {
        // Reset compteur seulement si c'est une nouvelle demande d'auth
        if (data.action_type !== pendingAction) {
          authAttemptsRef.current = 0
        }
        setPendingAction(data.action_type as PendingAction)
      }

      if (!data.requires_action) {
        if (pendingAction === 'ask_matricule' && currentMat) setMatricule(currentMat)
        if (pendingAction === 'ask_email' && currentEmail) setEmail(currentEmail)
      }

      const responseText = data.response || 'Réponse vide du serveur.'

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: responseText,
          isHtml:
            /<a\s+href/i.test(responseText) ||
            /<br\s*\/?>/i.test(responseText) ||
            /<strong>/i.test(responseText) ||
            /<table/i.test(responseText) ||
            /<div/i.test(responseText),
        },
      ])
    } catch (error) {
      console.error('Erreur Chat:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: 'Le service est momentanément indisponible. Veuillez réessayer dans quelques instants.',
        },
      ])
    } finally {
      setTyping(false)
    }
  }, [typing, pendingAction, matricule, email])

  const resetChat = useCallback(() => {
    setMessages([{ id: 'welcome', role: 'assistant', text: getWelcomeMessage() }])
    setInput('')
    setTyping(false)
    setMatricule(null)
    setEmail(null)
    setPendingAction(null)
    authAttemptsRef.current = 0
    sessionIdRef.current = generateSessionId()
  }, [])

  return {
    messages,
    input,
    setInput,
    typing,
    matricule,
    email,
    pendingAction,
    sessionId: sessionIdRef.current,
    send,
    resetChat,
  }
}