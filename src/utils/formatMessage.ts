const MARKDOWN_TABLE_RE = /\|.+\|/
const TAB_TABLE_RE = /^[^\t]+\t[^\t]/

function countTabs(line: string): number {
  return (line.match(/\t/g) || []).length
}

function lineToCells(line: string, sep: string): string[] {
  return line.split(sep).map((c) => c.trim()).filter((c) => c.length > 0)
}

export function markdownToHtml(text: string): string {
  const lines = text.split('\n')
  const out: string[] = []
  let inTable = false
  let tableRows: string[] = []
  let tableSep = '|'

  const flushTable = () => {
    if (tableRows.length === 0) return
    let html = '<div class="cap-table-wrap"><table>'
    tableRows.forEach((row, i) => {
      const cells = lineToCells(row, tableSep)
      if (i === 0) {
        html += '<thead><tr>' + cells.map((c) => `<th>${c}</th>`).join('') + '</tr></thead><tbody>'
      } else {
        html += '<tr>' + cells.map((c) => `<td>${c}</td>`).join('') + '</tr>'
      }
    })
    html += '</tbody></table></div>'
    out.push(html)
    tableRows = []
    inTable = false
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()

    if (/^\|[\s\-:|]+\|/.test(trimmed)) continue

    const isPipeTable = trimmed.startsWith('|') && trimmed.endsWith('|')
    const tabCount = countTabs(trimmed)

    if (isPipeTable) {
      if (!inTable) { inTable = true; tableSep = '|' }
      tableRows.push(trimmed)
      continue
    }

    if (!inTable && tabCount >= 2 && i + 1 < lines.length) {
      const nextTabs = countTabs(lines[i + 1].trim())
      if (nextTabs >= 2) {
        inTable = true
        tableSep = '\t'
        tableRows.push(trimmed)
        continue
      }
    }

    if (inTable) {
      if (tabCount >= 2) {
        tableRows.push(trimmed)
        continue
      }
      flushTable()
    }

    if (/^### (.+)/.test(trimmed)) {
      out.push(`<strong style="display:block;margin-top:4px;margin-bottom:2px;font-size:12px;">${trimmed.replace(/^### /, '')}</strong>`)
      continue
    }
    if (/^## (.+)/.test(trimmed)) {
      out.push(`<strong style="display:block;margin-top:4px;margin-bottom:2px;font-size:13px;">${trimmed.replace(/^## /, '')}</strong>`)
      continue
    }
    if (/^# (.+)/.test(trimmed)) {
      out.push(`<strong style="display:block;margin-top:4px;margin-bottom:2px;font-size:14px;">${trimmed.replace(/^# /, '')}</strong>`)
      continue
    }

    if (/^[*\-] (.+)/.test(trimmed)) {
      out.push(`• ${trimmed.replace(/^[*\-] /, '')}<br>`)
      continue
    }

    if (trimmed === '') {
      out.push('<br>')
      continue
    }

    const formatted = trimmed
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
    out.push(formatted + '<br>')
  }

  if (inTable) flushTable()

  return collapseBr(out.join(''))
}

function collapseBr(html: string): string {
  html = html.replace(/(<br\s*\/?>\s*)+/gi, '<br>')
  html = html.replace(/(<br\s*\/?>\s*)+(?=<div\s+class="cap-table-wrap"|<table[\s>])/gi, '')
  return html
}

export function containsTable(html: string): boolean {
  return /<table[\s>]/i.test(html)
}

export function normalizeMessage(text: string, isHtml: boolean): string {
  if (isHtml) return text.replace(/\n/g, '<br>').replace(/(<br\s*\/?>\s*)+(?=<div\s+class="cap-table-wrap"|<table\s)/gi, '')

  if (MARKDOWN_TABLE_RE.test(text) || TAB_TABLE_RE.test(text) || /^#{1,3} /m.test(text) || /^[*\-] /m.test(text)) {
    return markdownToHtml(text)
  }

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

export function splitByTables(html: string): Array<{ type: 'text' | 'table'; content: string }> {
  const parts: Array<{ type: 'text' | 'table'; content: string }> = []
  const regex = /(<div class="cap-table-wrap">[\s\S]*?<\/div>|<table[\s\S]*?<\/table>)/gi
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      const before = html.slice(lastIndex, match.index)
      if (before.trim()) parts.push({ type: 'text', content: before })
    }
    const tableHtml = match[1].startsWith('<div class="cap-table-wrap">')
      ? match[1]
      : `<div class="cap-table-wrap">${match[1]}</div>`
    parts.push({ type: 'table', content: tableHtml })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < html.length) {
    const remaining = html.slice(lastIndex)
    if (remaining.trim()) parts.push({ type: 'text', content: remaining })
  }

  if (parts.length === 0) parts.push({ type: 'text', content: html })
  return parts
}
