import { useState, useRef, useCallback } from 'react'
import { sendMessage } from '../services/chatService'
import {
  extractMatriculeFromMessage,
  isValidMatricule,
  extractEmailFromMessage,
  isValidEmail,
} from '../utils/chatHelpers'
import type { Message, PendingAction } from '../types/chat'

function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function getWelcomeMessage(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12)
    return 'Bonjour ! Je suis l\'assistant du CAP-EPAC. Comment puis-je vous aider ? (Formations, Notes, Emploi du temps…)'
  if (h >= 12 && h < 18)
    return 'Bon après-midi ! Je suis l\'assistant du CAP-EPAC. Comment puis-je vous aider ? (Inscription, Cours, Consultation de note…)'
  return 'Bonsoir ! Je suis l\'assistant du CAP-EPAC. Comment puis-je vous aider ? (Inscription, Cours, Consultation de note…)'
}

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

  const send = useCallback(async (text: string) => {
    if (!text.trim() || typing) return

    // Validation locale avant appel API
    if (pendingAction === 'ask_matricule') {
      const mat = extractMatriculeFromMessage(text) ?? text.trim()
      if (!isValidMatricule(mat)) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            text: '❌ Matricule invalide. Entrez uniquement des chiffres (8 à 10 chiffres).<br>Exemple : <strong>20210001</strong>',
            isHtml: true,
          },
        ])
        return
      }
    }

    if (pendingAction === 'ask_email') {
      const mail = extractEmailFromMessage(text) ?? text.trim()
      if (!isValidEmail(mail)) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            text: '❌ Email invalide. Exemple : <strong>nom@domaine.com</strong>',
            isHtml: true,
          },
        ])
        return
      }
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    // Détection matricule/email AVANT de vider pendingAction
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
          isHtml: /<a\s+href/i.test(responseText) || /<br\s*\/?>/i.test(responseText) ||
                  /<strong>/i.test(responseText) || /<table/i.test(responseText) ||
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
          text: 'Le service est momentanément indisponible. Veuillez réessayer.',
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
