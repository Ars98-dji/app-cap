// ChatButton.tsx — v9 (inchange)
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { styles } from "./chatStyles";
import { ChatIcon } from "./ChatIcons";

const getIsMobile = (): boolean => window.innerWidth <= 640;

interface ChatButtonProps {
  open:    boolean;
  setOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export default function ChatButton({ open, setOpen }: ChatButtonProps): JSX.Element | null {
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

  const button = (
    <button
      data-chat-bubble=""
      style={isMobile ? styles.bubbleMobile : styles.bubble}
      onMouseEnter={(e) => { if (!isMobile) e.currentTarget.style.transform = "scale(1.1)"; }}
      onMouseLeave={(e) => { if (!isMobile) e.currentTarget.style.transform = "scale(1)"; }}
      onClick={() => setOpen((prev) => !prev)}
      aria-label="Ouvrir le chat"
    >
      <ChatIcon />
    </button>
  );

  return createPortal(button, document.body);
}