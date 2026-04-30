// ChatWindow.tsx — v9 AUDIT
// - Rendu HTML securise pour les liens <a href> generes par le backend
// - Support prop matricule pour affichage session
// - Formatage texte : remplace \n par <br>

import { useRef, useEffect, useState, CSSProperties } from "react";
import { styles } from "./chatStyles";
import { SendIcon, MinusIcon, ChevronUpIcon, XIcon, UserIcon } from "./ChatIcons";
import TypingDots from "./TypingDots";
import type { Message } from "./ChatBubble";


const LOGO = "/app-cap/assets/img/cap.png";

const getIsMobile = (): boolean => window.innerWidth <= 640;

function getWindowStyle(minimized: boolean, isMobile: boolean): CSSProperties {
  if (isMobile && minimized) return styles.windowMobileMinimized;
  if (isMobile)              return styles.windowMobile;
  if (minimized)             return styles.windowMinimized;
  return styles.window;
}

interface ChatWindowProps {
  open:         boolean;
  minimized:    boolean;
  setMinimized: (val: boolean | ((prev: boolean) => boolean)) => void;
  setOpen:      (val: boolean) => void;
  messages:     Message[];
  input:        string;
  setInput:     (val: string) => void;
  send:         (text?: string) => void;
  typing:       boolean;
  matricule:    string | null;
}

/**
 * Convertit le texte brut en HTML safe :
 * - Les \n deviennent <br>
 * - Les liens <a href=...> sont preserves (viennent du backend)
 * - Le reste du texte est eschappe
 */
function formatMessage(text: string, isHtml: boolean): string {
  if (isHtml) {
    // Le backend a deja genere du HTML valide — on l affiche tel quel
    // Les \n restants sont convertis en <br>
    return text.replace(/\n/g, "<br>");
  }
  // Texte brut : echapper puis convertir \n
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return escaped.replace(/\n/g, "<br>");
}

export default function ChatWindow({
  open, minimized, setMinimized, setOpen,
  messages, input, setInput, send, typing, matricule,
}: ChatWindowProps): JSX.Element | null {
  const endRef    = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isMobile, setIsMobile]         = useState<boolean>(getIsMobile());

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const onResize = (): void => setIsMobile(getIsMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      if (
        windowRef.current &&
        !windowRef.current.contains(target) &&
        !target.closest("[data-chat-bubble]")
      ) {
        setOpen(false);
        setMinimized(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen, setMinimized]);

  if (!open) return null;

  return (
    <div ref={windowRef} style={getWindowStyle(minimized, isMobile)}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatar}>
            <img
              src={LOGO}
              alt="CAP-EPAC"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
            />
          </div>
          <div>
            <p style={styles.headerTitle}>
              Assistant CAP-EPAC
              {matricule && (
                <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "6px" }}>
                  #{matricule}
                </span>
              )}
            </p>
            <div style={styles.headerStatus}>
              <div style={styles.statusDot} />
              <span style={styles.statusText}>En ligne</span>
            </div>
          </div>
        </div>

        <div style={styles.headerActions}>
          <button
            style={styles.actionBtn}
            title={minimized ? "Agrandir" : "Reduire"}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            onClick={() => setMinimized((prev) => !prev)}
          >
            {minimized ? <ChevronUpIcon /> : <MinusIcon />}
          </button>
          <button
            style={styles.actionBtn}
            title="Fermer"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            onClick={() => { setOpen(false); setMinimized(false); }}
          >
            <XIcon />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* MESSAGES */}
          <div style={styles.body}>
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} style={styles.msgColUser}>
                  <div style={styles.msgRowUser}>
                    <div style={styles.userBubble}>{msg.text}</div>
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
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                      />
                    </div>
                    {/* Rendu HTML pour les liens cliquables generes par le backend */}
                    <div
                      style={styles.botBubble}
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(msg.text, msg.isHtml ?? false),
                      }}
                    />
                  </div>

               
                </div>
              )
            )}
            {typing && <TypingDots />}
            <div ref={endRef} />
          </div>

          {/* INPUT */}
          <div style={styles.inputWrap}>
            <div style={styles.inputInner}>
              <input
                style={{
                  ...styles.input,
                  borderColor: inputFocused ? "#2d5a52" : "transparent",
                  background:  inputFocused ? "#ffffff" : "#f0f2f5",
                  boxShadow:   inputFocused ? "0 0 0 3px rgba(45,90,82,0.12)" : "none",
                }}
                placeholder="Posez votre question ici..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button
                style={{
                  ...styles.sendBtn,
                  opacity: !input.trim() || typing ? 0.5 : 1,
                  cursor:  !input.trim() || typing ? "not-allowed" : "pointer",
                }}
                onClick={() => send()}
                disabled={!input.trim() || typing}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}