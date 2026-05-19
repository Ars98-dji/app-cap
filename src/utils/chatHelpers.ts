const MATRICULE_RE = /\b(\d{8,10})\b/
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/

export function extractMatriculeFromMessage(text: string): string | null {
  const trimmed = text.trim()
  const wordCount = (trimmed.match(/\S+/g) || []).length
  if (wordCount > 3) return null
  const match = trimmed.match(MATRICULE_RE)
  return match ? match[1] : null
}

export function isValidMatricule(text: string): boolean {
  return /^\d{8,10}$/.test(text.trim())
}

export function extractEmailFromMessage(text: string): string | null {
  const match = text.match(EMAIL_RE)
  return match ? match[0].toLowerCase() : null
}

export function isValidEmail(text: string): boolean {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(text.trim())
}

export function containsHtml(text: string): boolean {
  return (
    /<a\s+href/i.test(text) ||
    /<br\s*\/?>/i.test(text) ||
    /<strong>/i.test(text) ||
    /<table/i.test(text) ||
    /<div/i.test(text)
  )
}
