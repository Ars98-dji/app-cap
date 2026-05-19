export interface ChatRequest {
  message: string
  session_id?: string
  history?: ConversationTurn[]
  matricule?: string | null
  email?: string | null
}

export interface ConversationTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  response: string
  intent: string
  module: string
  requires_action: boolean
  action_type: string | null
  session_id: string
  metadata?: Record<string, unknown>
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  isHtml?: boolean
}

export type PendingAction = 'ask_matricule' | 'ask_email' | null
