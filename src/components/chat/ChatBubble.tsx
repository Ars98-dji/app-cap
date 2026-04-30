// ChatBubble.tsx v11 — SESSION_ID PERSISTANT + MESSAGE D'ACCUEIL DYNAMIQUE
// Le session_id est généré une fois et réutilisé à chaque message
// Sans session_id, le bot oublie le contexte entre chaque tour

import { useState, useEffect, useRef, lazy, Suspense } from "react";
import ChatButton from "./ChatButton";

const ChatWindow = lazy(() => import("./ChatWindow"));

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  isHtml?: boolean;
}

const API_URL: string =
  (import.meta as any).env?.VITE_CHAT_API_URL ?? "http://127.0.0.1:8000/api/chat";

/** Génère un UUID v4 simple */
const generateSessionId = (): string =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

/** Message d'accueil dynamique selon l'heure */
const getWelcomeMessage = (): string => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)
    return "Bonjour ! Je suis le chatbot de l'EPAC. Comment puis-je vous aider (Formations, Notes, Emploi du temps…) ?";
  if (h >= 12 && h < 18)
    return "Bon après-midi ! Je suis le chatbot de l'EPAC. Comment puis-je vous aider (Formations, Notes, Emploi du temps…) ?";
  return "Bonsoir ! Je suis le chatbot de l'EPAC. Comment puis-je vous aider (Formations, Notes, Emploi du temps…) ?";
};

export default function ChatBubble(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [matricule, setMatricule] = useState<string | null>(null);

  // ✅ FIX PRINCIPAL — session_id généré une seule fois, conservé toute la session
  const sessionIdRef = useRef<string>(generateSessionId());

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      text: getWelcomeMessage(),
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [typing, setTyping] = useState<boolean>(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleOpen = (val: boolean | ((prev: boolean) => boolean)): void => {
    const resolved = typeof val === "function" ? val(open) : val;
    setOpen(resolved);
    setShowTooltip(false);
    if (resolved) setLoaded(true);
  };

  const containsHtml = (text: string): boolean =>
    /<a\s+href/i.test(text) || /<br\s*\/?>/i.test(text);

  const send = async (text: string = input): Promise<void> => {
    if (!text.trim() || typing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Détecter matricule dans le message (7-10 chiffres)
    const matMatch = text.match(/(?<!\d)(\d{7,10})(?!\d)/);
    const currentMat = matricule ?? matMatch?.[1] ?? null;
    if (matMatch && !matricule) {
      setMatricule(matMatch[1]);
    }

    // Historique pour le contexte (les 10 derniers tours max)
    const history = [...messages, userMsg]
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.text }));

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          // ✅ session_id envoyé à chaque requête — même valeur toute la session
          session_id: sessionIdRef.current,
          matricule: currentMat,
          conversation_history: history,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const responseText: string = data.response || "Réponse vide du serveur.";

      // Récupérer le matricule si le backend le détecte
      if (data.matricule_detected && !matricule) {
        setMatricule(data.matricule_detected);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: responseText,
          isHtml: containsHtml(responseText),
        },
      ]);
    } catch (error) {
      console.error("Erreur Chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "Le service est momentanément indisponible. Veuillez réessayer.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {loaded && (
        <Suspense fallback={null}>w
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
          />
        </Suspense>
      )}

      {showTooltip && !open && (
        <div
          style={{
            position: "fixed",
            bottom: "102px",
            right: "30px",
            background: "#1f2937",
            color: "white",
            fontSize: "12px",
            padding: "8px 14px",
            borderRadius: "20px",
            whiteSpace: "nowrap",
            zIndex: 9998,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            animation: "fadeInUp 0.3s ease",
            pointerEvents: "none",
          }}
        >
          Ouvrir le chat
          <div
            style={{
              position: "absolute",
              bottom: "2px",
              right: "22px",
              width: "12px",
              height: "12px",
              background: "#2d5a52",
              transform: "rotate(45deg)",
              borderRadius: "2px",
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

      <ChatButton open={open} setOpen={handleOpen} />
    </>
  );
}