// TypingDots.tsx — v9 (inchange)
import { styles } from "./chatStyles";

const LOGO = "/app-cap/assets/img/cap.png";

export default function TypingDots(): JSX.Element {
  return (
    <>
      <style>{`
        @keyframes capBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-6px); }
        }
      `}</style>
      <div style={styles.typingWrap}>
        <div style={styles.msgAvatar}>
          <img
            src={LOGO}
            alt="CAP"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        </div>
        <div style={styles.typingBubble}>
          {(["-0.3s", "-0.15s", "0s"] as const).map((delay, i) => (
            <span
              key={i}
              style={{ ...styles.dot, animation: `capBounce 1.2s infinite ${delay}` }}
            />
          ))}
        </div>
      </div>
    </>
  );
}