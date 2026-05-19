import { useRef, useEffect, useState, CSSProperties } from 'react'
import DOMPurify from 'dompurify'
import { styles } from './chatStyles'
import { SendIcon, MinusIcon, ChevronUpIcon, XIcon, UserIcon } from './ChatIcons'
import TypingDots from './TypingDots'
import { normalizeMessage, containsTable, splitByTables } from '../../utils/formatMessage'
import { useImagePreload } from '../../hooks/useImagePreload'
import type { Message, PendingAction } from '../../types/chat'

const LOGO = '/assets/img/cap.png'

const getIsMobile = (): boolean => window.innerWidth <= 640

function getWindowStyle(minimized: boolean, isMobile: boolean): CSSProperties {
  if (isMobile && minimized) return styles.windowMobileMinimized
  if (isMobile) return styles.windowMobile
  if (minimized) return styles.windowMinimized
  return styles.window
}

interface ChatWindowProps {
  open: boolean
  minimized: boolean
  setMinimized: (val: boolean | ((prev: boolean) => boolean)) => void
  setOpen: (val: boolean) => void
  messages: Message[]
  input: string
  setInput: (val: string) => void
  send: (text: string) => void
  typing: boolean
  matricule: string | null
  email: string | null
  pendingAction: PendingAction
}

const TABLE_STYLES = `
  .cap-table-wrap {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 8px;
    margin-top: 0;
    margin-bottom: 2px;
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .cap-table-wrap table {
    border-collapse: collapse;
    min-width: 100%;
    font-size: 12px;
    font-family: 'Google Sans', 'Nunito', 'Segoe UI', system-ui, sans-serif;
    color: #1f2937;
    table-layout: auto;
  }
  .cap-table-wrap table tr:first-child th,
  .cap-table-wrap table thead tr {
    background: #2d5a52;
    color: #ffffff;
  }
  .cap-table-wrap table tr:first-child th,
  .cap-table-wrap table thead th {
    padding: 7px 10px;
    text-align: left;
    font-weight: 600;
    font-size: 10px;
    letter-spacing: 0.03em;
    white-space: nowrap;
    text-transform: uppercase;
  }
  .cap-table-wrap table tr,
  .cap-table-wrap table tbody tr {
    transition: background 0.2s ease;
  }
  .cap-table-wrap table tr:nth-child(3n+1),
  .cap-table-wrap table tbody tr:nth-child(3n+1) {
    background: #f2f7f5;
  }
  .cap-table-wrap table tr:nth-child(3n+2),
  .cap-table-wrap table tbody tr:nth-child(3n+2) {
    background: #ffffff;
  }
  .cap-table-wrap table tr:nth-child(3n+3),
  .cap-table-wrap table tbody tr:nth-child(3n+3) {
    background: #e8f0ed;
    border-top: 1px solid #c5d9d5;
  }
  .cap-table-wrap table tr:nth-child(3n+3) td,
  .cap-table-wrap table tbody tr:nth-child(3n+3) td {
    border-bottom: 1px solid #c5d9d5;
  }
  .cap-table-wrap table tr:hover,
  .cap-table-wrap table tbody tr:hover {
    background: #d4e8e2;
  }
  .cap-table-wrap table td {
    padding: 6px 10px;
    font-size: 12px;
    color: #1f2937;
    white-space: nowrap;
    border-bottom: 1px solid #eef2f2;
  }
  .cap-table-wrap table tr:last-child td {
    border-bottom: none;
  }
  .cap-table-wrap table tr:last-child {
    border-top: none;
  }
  .cap-table-wrap table:not(:has(thead)) td:first-child {
    color: #1e4a44;
    font-weight: 700;
    font-size: 12px;
    width: 40%;
    white-space: nowrap;
  }
  .cap-table-wrap table:not(:has(thead)) td:last-child {
    color: #111827;
    font-weight: 500;
    font-size: 13px;
  }
  .cap-table-wrap::-webkit-scrollbar { height: 4px; }
  .cap-table-wrap::-webkit-scrollbar-track { background: transparent; }
  .cap-table-wrap::-webkit-scrollbar-thumb { background: #c5d9d5; border-radius: 4px; }
`

const getNow = (): string => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const timeStyle = (isUser: boolean): CSSProperties => ({
  fontSize: '11px',
  color: isUser ? 'rgba(255,255,255,0.65)' : '#9ca3af',
  alignSelf: 'flex-end',
  lineHeight: '1',
  marginTop: '2px',
  fontWeight: '400',
})

function BotMessageContent({ text, isHtml }: { text: string; isHtml?: boolean }) {
  const normalized = normalizeMessage(text, isHtml ?? false)
  const hasTable = containsTable(normalized)

  if (!hasTable) {
    return (
      <span
        className="cap-msg-body"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(normalized) }}
      />
    )
  }

  const segments = splitByTables(normalized)

  return (
    <span className="cap-msg-body" style={{ display: 'block' }}>
      {segments.map((seg, i) =>
        seg.type === 'table' ? (
          <span
            key={i}
            style={{ display: 'block' }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(seg.content) }}
          />
        ) : (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(seg.content) }}
          />
        )
      )}
    </span>
  )
}

export default function ChatWindow({
  open, minimized, setMinimized, setOpen,
  messages, input, setInput, send, typing,
  matricule, email, pendingAction,
}: ChatWindowProps): JSX.Element | null {
  const endRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const [inputFocused, setInputFocused] = useState(false)
  const [isMobile, setIsMobile] = useState(getIsMobile())
  const timesRef = useRef<Record<string, string>>({})

  // Preload the logo image to prevent flickering
  useImagePreload(LOGO)

  messages.forEach((msg) => {
    if (!timesRef.current[msg.id]) timesRef.current[msg.id] = getNow()
  })

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    const onResize = () => setIsMobile(getIsMobile())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        windowRef.current &&
        !windowRef.current.contains(target) &&
        !target.closest('[data-chat-bubble]')
      ) {
        setOpen(false)
        setMinimized(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, setOpen, setMinimized])

  if (!open) return null

  const authLabel = matricule
    ? `#${matricule}`
    : email
      ? email.split('@')[0]
      : null

  const inputPlaceholder =
    pendingAction === 'ask_matricule'
      ? 'Entrez votre matricule (8 à 10 chiffres)…'
      : pendingAction === 'ask_email'
        ? 'Entrez votre adresse email…'
        : 'Posez votre question ici...'

  return (
    <div ref={windowRef} style={getWindowStyle(minimized, isMobile)}>
      <style>{TABLE_STYLES}</style>

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatar}>
            <img
              src={LOGO}
              alt="CAP-EPAC"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <div>
            <p style={{
              ...styles.headerTitle,
              fontFamily: "'Google Sans', 'Nunito', 'Segoe UI', system-ui, sans-serif",
              fontSize: '15px',
              fontWeight: '600',
            }}>
              Assistant CAP-EPAC
              {authLabel && (
                <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '6px', fontWeight: '400' }}>
                  {authLabel}
                </span>
              )}
            </p>
            <div style={styles.headerStatus}>
              <div style={styles.statusDot} />
              <span style={{ ...styles.statusText, fontSize: '11px' }}>En ligne</span>
            </div>
          </div>
        </div>

        <div style={styles.headerActions}>
          <button
            style={styles.actionBtn}
            title={minimized ? 'Agrandir' : 'Réduire'}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            onClick={() => setMinimized((prev) => !prev)}
          >
            {minimized ? <ChevronUpIcon /> : <MinusIcon />}
          </button>
          <button
            style={styles.actionBtn}
            title="Fermer"
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            onClick={() => { setOpen(false); setMinimized(false) }}
          >
            <XIcon />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div style={styles.body}>
            {messages.map((msg) => {
              const time = timesRef.current[msg.id] ?? getNow()

              return msg.role === 'user' ? (
                <div key={msg.id} style={styles.msgColUser}>
                  <div style={styles.msgRowUser}>
                    <div style={styles.userBubble}>
                      <span>{msg.text}</span>
                      <span style={timeStyle(true)}>{time}</span>
                    </div>
                    <div style={styles.userIconWrap}><UserIcon /></div>
                  </div>
                </div>
              ) : (
                <div key={msg.id} style={styles.msgColBot}>
                  <div style={styles.msgRowBot}>
                    <div style={styles.msgAvatar}>
                      <img
                        src={LOGO}
                        alt="CAP"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    </div>
                    <div
                      style={
                        containsTable(normalizeMessage(msg.text, msg.isHtml ?? false))
                          ? { ...styles.botBubble, maxWidth: 'calc(100vw - 120px)', padding: '8px 10px 6px 10px', gap: '2px' }
                          : styles.botBubble
                      }
                    >
                      <BotMessageContent text={msg.text} isHtml={msg.isHtml} />
                      <span style={timeStyle(false)}>{time}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {typing && <TypingDots />}
            <div ref={endRef} />
          </div>

          <div style={styles.inputWrap}>
            <div style={styles.inputInner}>
              <input
                style={{
                  ...styles.input,
                  fontSize: '16px',
                  fontFamily: "'Google Sans', 'Nunito', 'Segoe UI', system-ui, sans-serif",
                  fontWeight: '400',
                  borderColor: inputFocused ? '#2d5a52' : 'transparent',
                  background: inputFocused ? '#ffffff' : '#f0f2f5',
                  boxShadow: inputFocused ? '0 0 0 3px rgba(45,90,82,0.12)' : 'none',
                }}
                placeholder={inputPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
              />
              <button
                style={{
                  ...styles.sendBtn,
                  opacity: !input.trim() || typing ? 0.5 : 1,
                  cursor: !input.trim() || typing ? 'not-allowed' : 'pointer',
                }}
                onClick={() => send(input)}
                disabled={!input.trim() || typing}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
