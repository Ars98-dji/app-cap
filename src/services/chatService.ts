import type { ChatRequest, ChatResponse } from '../types/chat'

const API_URL: string =
  (import.meta as any).env?.VITE_CHAT_API_URL ?? 'http://127.0.0.1:8000/api/chat'

export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `HTTP ${response.status}`)
  }

  return response.json()
}
