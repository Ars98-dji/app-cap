/**
 * utils/formatMessage.ts — CAP-EPAC v12
 * ========================================
 * Conversion Markdown → HTML + split text/table
 *
 * CORRECTIONS v12 :
 * - Suppression des <br> ET des lignes vides AVANT/APRÈS chaque tableau
 * - Conversion markdown table → cap-table-wrap en une seule passe (avant toute
 *   autre conversion), pour éviter que les \n autour du tableau soient déjà
 *   convertis en <br> quand on essaie de les supprimer
 * - trimSegment() : nettoie chaque segment texte individuellement des <br>
 *   orphelins en tête et en queue
 * - containsTable / splitByTables : robustes sur les deux cas (HTML reçu du
 *   backend ET Markdown converti côté frontend)
 */

// ── Regex ────────────────────────────────────────────────────────────────────

/** Détecte une ligne de séparation de table markdown : |---|---|  ou  :---:  */
const MD_TABLE_SEP = /^\|?[\s]*:?-+:?[\s]*(\|[\s]*:?-+:?[\s]*)+\|?[\s]*$/

/** Détecte une ligne de tableau markdown (commence et/ou finit par |) */
const MD_TABLE_ROW = /^\|.+\|[\s]*$/

/** Correspond à un bloc HTML cap-table-wrap (déjà converti) */
const HTML_TABLE_RE = /<div[^>]*class=["']cap-table-wrap["'][^>]*>[\s\S]*?<\/div>/gi

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Nettoie les <br>, &nbsp; et espaces orphelins en tête et queue d'une chaîne HTML */
function trimBr(html: string): string {
  return html
    .replace(/^(\s*(<br\s*\/?>|&nbsp;|<p>\s*<\/p>|<p\s*\/>)\s*)+/gi, '')
    .replace(/(\s*(<br\s*\/?>|&nbsp;|<p>\s*<\/p>|<p\s*\/>)\s*)+$/gi, '')
    .trim()
}

// ── Conversion Markdown table → HTML ─────────────────────────────────────────

/**
 * Transforme un bloc de lignes markdown (tableau) en HTML prêt à l'emploi.
 * Retourne null si le bloc n'est pas un tableau valide.
 */
function mdTableToHtml(lines: string[]): string | null {
  if (lines.length < 2) return null

  // Trouver la ligne de séparation
  const sepIdx = lines.findIndex((l) => MD_TABLE_SEP.test(l))
  if (sepIdx < 1) return null

  const headerLine = lines[sepIdx - 1]
  const dataLines = lines.slice(sepIdx + 1)

  const parseRow = (line: string): string[] =>
    line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim())

  const headers = parseRow(headerLine)
  if (headers.length === 0) return null

  const thead =
    '<thead><tr>' +
    headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('') +
    '</tr></thead>'

  const tbody =
    '<tbody>' +
    dataLines
      .filter((l) => l.trim() && MD_TABLE_ROW.test(l))
      .map((l) => {
        const cells = parseRow(l)
        // Complète si moins de colonnes que le header
        while (cells.length < headers.length) cells.push('')
        return '<tr>' + cells.map((c) => `<td>${escapeHtml(c)}</td>`).join('') + '</tr>'
      })
      .join('') +
    '</tbody>'

  return `<div class="cap-table-wrap"><table>${thead}${tbody}</table></div>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Convertit tous les blocs de tableau markdown en HTML, AVANT de convertir les \n en <br>.
 * C'est l'ordre qui est critique : si on convertit les \n en <br> d'abord,
 * les séparateurs de lignes du tableau ne sont plus reconnus.
 */
function convertMarkdownTables(text: string): string {
  const lines = text.split('\n')
  const result: string[] = []
  let tableBuffer: string[] = []
  let inTable = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isTableRow = MD_TABLE_ROW.test(line) || MD_TABLE_SEP.test(line)

    if (isTableRow) {
      if (!inTable) inTable = true
      tableBuffer.push(line)
    } else {
      if (inTable) {
        // Fin du bloc tableau — convertir
        const html = mdTableToHtml(tableBuffer)
        if (html) {
          result.push(html)
        } else {
          result.push(...tableBuffer)
        }
        tableBuffer = []
        inTable = false
      }
      result.push(line)
    }
  }

  // Tableau en fin de texte
  if (inTable && tableBuffer.length > 0) {
    const html = mdTableToHtml(tableBuffer)
    if (html) {
      result.push(html)
    } else {
      result.push(...tableBuffer)
    }
  }

  return result.join('\n')
}

// ── Conversion Markdown générale → HTML ──────────────────────────────────────

function convertMarkdownToHtml(text: string): string {
  return (
    text
      // Bold **text** ou __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic *text* ou _text_
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Bullet points (* item ou - item) — seulement en début de ligne
      .replace(/^[*\-]\s+(.+)$/gm, '<li>$1</li>')
      // Sauts de ligne → <br>  (APRÈS la conversion des tableaux)
      .replace(/\n/g, '<br>')
      // Listes : regrouper les <li> consécutifs
      .replace(/(<li>.*?<\/li>)(<br>(<li>.*?<\/li>))*/g, (m) =>
        '<ul style="margin:4px 0 4px 16px;padding:0">' + m.replace(/<br>/g, '') + '</ul>'
      )
      // Nettoyer les <br> autour des div/ul/table (éléments bloc)
      .replace(/(<br>)+(<div|<ul|<table)/gi, '$2')
      .replace(/(<\/div>|<\/ul>|<\/table>)(<br>)+/gi, '$1')
      // Double <br> → simple
      .replace(/(<br>){3,}/gi, '<br><br>')
  )
}

// ── API publique ──────────────────────────────────────────────────────────────

/**
 * Normalise le message : si c'est du HTML brut (venant du backend), on le nettoie.
 * Si c'est du Markdown (venant du LLM), on le convertit en HTML.
 */
export function normalizeMessage(text: string, isHtml: boolean): string {
  if (!text) return ''

  if (isHtml) {
    // Le backend envoie déjà du HTML — nettoyer seulement les <br> autour des blocs
    return text
      .replace(/(<br\s*\/?>)+(<div[^>]*class=["']cap-table-wrap)/gi, '$2')
      .replace(/(cap-table-wrap[^>]*>[\s\S]*?<\/div>)(<br\s*\/?>)+/gi, '$1')
      .replace(/(<br>){3,}/gi, '<br><br>')
  }

  // 1. Convertir les tableaux Markdown en HTML en premier (avant les \n → <br>)
  const withTables = convertMarkdownTables(text)

  // 2. Convertir le reste du Markdown en HTML
  const html = convertMarkdownToHtml(withTables)

  // 3. Nettoyer les <br> résiduels autour des blocs HTML générés
  return html
    .replace(/(<br\s*\/?>)+(<div[^>]*class=["']cap-table-wrap)/gi, '$2')
    .replace(/(cap-table-wrap[^>]*>[\s\S]*?<\/div>)(<br\s*\/?>)+/gi, '$1')
}

/** Vérifie si le HTML normalisé contient un tableau */
export function containsTable(html: string): boolean {
  return html.includes('cap-table-wrap') || html.includes('<table')
}

type Segment = { type: 'text' | 'table'; content: string }

/**
 * Découpe le HTML en segments alternés texte/tableau.
 * Chaque segment texte est nettoyé des <br> orphelins en tête/queue.
 */
export function splitByTables(html: string): Segment[] {
  const segments: Segment[] = []

  // Séparer sur les div.cap-table-wrap ET les <table> directes (fallback)
  const tablePattern =
    /(<div[^>]*class=["']cap-table-wrap["'][^>]*>[\s\S]*?<\/div>|<table[\s\S]*?<\/table>)/gi

  let lastIndex = 0
  let match: RegExpExecArray | null

  tablePattern.lastIndex = 0
  while ((match = tablePattern.exec(html)) !== null) {
    // Segment texte avant le tableau
    if (match.index > lastIndex) {
      const textContent = trimBr(html.slice(lastIndex, match.index))
      if (textContent) {
        segments.push({ type: 'text', content: textContent })
      }
    }

    // Enveloppe la table dans cap-table-wrap si elle ne l'est pas déjà
    let tableHtml = match[0]
    if (!tableHtml.includes('cap-table-wrap')) {
      tableHtml = `<div class="cap-table-wrap">${tableHtml}</div>`
    }
    segments.push({ type: 'table', content: tableHtml })

    lastIndex = match.index + match[0].length
  }

  // Segment texte après le dernier tableau
  if (lastIndex < html.length) {
    const textContent = trimBr(html.slice(lastIndex))
    if (textContent) {
      segments.push({ type: 'text', content: textContent })
    }
  }

  // Si aucun tableau trouvé, retourner le tout comme texte
  if (segments.length === 0) {
    segments.push({ type: 'text', content: html })
  }

  return segments
}