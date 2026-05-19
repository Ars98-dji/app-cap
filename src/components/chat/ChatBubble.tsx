import { useState, useEffect, lazy, Suspense } from 'react'
import { useChat } from '../../hooks/useChat'
import ChatButton from './ChatButton'

const ChatWindow = lazy(() => import('./ChatWindow'))

export default function ChatBubble(): JSX.Element {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const {
    messages,
    input,
    setInput,
    typing,
    matricule,
    email,
    pendingAction,
    send,
  } = useChat()

  const hasActiveChat = messages.length > 1

  useEffect(() => {
    const showTimer = setTimeout(() => setShowTooltip(true), 3000)
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000)
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer) }
  }, [])

  const handleOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const resolved = typeof val === 'function' ? val(open) : val
    setOpen(resolved)
    setShowTooltip(false)
    if (resolved) setLoaded(true)
  }

  return (
    <>
      {loaded && (
        <Suspense fallback={null}>
          <ChatWindow
            open={open}
            minimized={minimized}
            setMinimized={setMinimized}
            setOpen={setOpen}
            messages={messages}
            input={input}
            setInput={setInput}
            send={send}
            typing={typing}
            matricule={matricule}
            email={email}
            pendingAction={pendingAction}
          />
        </Suspense>
      )}

      {showTooltip && !open && (
        <div
          style={{
            position: 'fixed',
            bottom: '102px',
            right: '30px',
            background: '#1f2937',
            color: 'white',
            fontSize: '12px',
            padding: '8px 14px',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
            zIndex: 9998,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            animation: 'fadeInUp 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          Ouvrir le chat
          <div
            style={{
              position: 'absolute',
              bottom: '2px',
              right: '22px',
              width: '12px',
              height: '12px',
              background: '#2d5a52',
              transform: 'rotate(45deg)',
              borderRadius: '2px',
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <ChatButton open={open} setOpen={handleOpen} hasActiveChat={hasActiveChat} />
    </>
  )
}
