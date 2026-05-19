// ChatButton.tsx — v10 (point rouge discussion active)
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { styles } from "./chatStyles";
import { ChatIcon } from "./ChatIcons";

const getIsMobile = (): boolean => window.innerWidth <= 640;

interface ChatButtonProps {
  open:           boolean;
  setOpen:        (val: boolean | ((prev: boolean) => boolean)) => void;
  hasActiveChat?: boolean; // true si discussion en cours
}

export default function ChatButton({ open, setOpen, hasActiveChat = false }: ChatButtonProps): JSX.Element | null {
  const [isMobile, setIsMobile] = useState<boolean>(getIsMobile());
  const [mounted, setMounted]   = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const onResize = (): void => setIsMobile(getIsMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!mounted) return null;
  if (isMobile && open) return null;

  const showDot = !open && hasActiveChat;

  const button = (
    <button
      data-chat-bubble=""
      style={{
        ...(isMobile ? styles.bubbleMobile : styles.bubble),
        position: "fixed",
      }}
      onMouseEnter={(e) => { if (!isMobile) e.currentTarget.style.transform = "scale(1.1)"; }}
      onMouseLeave={(e) => { if (!isMobile) e.currentTarget.style.transform = "scale(1)"; }}
      onClick={() => setOpen((prev) => !prev)}
      aria-label="Ouvrir le chat"
    >
      <ChatIcon />

      {showDot && (
        <span
          style={{
            position:     "absolute",
            top:          isMobile ? "2px"  : "4px",
            right:        isMobile ? "2px"  : "4px",
            width:        isMobile ? "11px" : "13px",
            height:       isMobile ? "11px" : "13px",
            background:   "#ef4444",
            borderRadius: "50%",
            border:       "2px solid white",
            display:      "block",
            pointerEvents:"none",
          }}
        />
      )}
    </button>
  );

  return createPortal(button, document.body);
}