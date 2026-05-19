// chatStyles.ts — v9 (inchange)
import { CSSProperties } from "react";

export const BRAND      = "#2d5a52";
export const BRAND_DARK = "#244a43";

interface ChatStyles {
  bubble:                CSSProperties;
  bubbleMobile:          CSSProperties;
  window:                CSSProperties;
  windowMinimized:       CSSProperties;
  windowMobile:          CSSProperties;
  windowMobileMinimized: CSSProperties;
  header:                CSSProperties;
  headerLeft:            CSSProperties;
  avatar:                CSSProperties;
  avatarText:            CSSProperties;
  headerTitle:           CSSProperties;
  headerStatus:          CSSProperties;
  statusDot:             CSSProperties;
  statusText:            CSSProperties;
  headerActions:         CSSProperties;
  actionBtn:             CSSProperties;
  body:                  CSSProperties;
  msgColUser:            CSSProperties;
  msgColBot:             CSSProperties;
  userIconWrap:          CSSProperties;
  msgRowUser:            CSSProperties;
  msgRowBot:             CSSProperties;
  userBubble:            CSSProperties;
  botBubble:             CSSProperties;
  msgAvatar:             CSSProperties;
  suggestionsWrap:       CSSProperties;
  suggestionBtn:         CSSProperties;
  typingWrap:            CSSProperties;
  typingBubble:          CSSProperties;
  dot:                   CSSProperties;
  inputWrap:             CSSProperties;
  inputInner:            CSSProperties;
  input:                 CSSProperties;
  sendBtn:               CSSProperties;
}

export const styles: ChatStyles = {
  bubble: {
    position:       "fixed",
    bottom:         "70px",
    right:          "50px",
    width:          "70px",
    height:         "70px",
    borderRadius:   "50%",
    background:     BRAND,
    display:        "flex",
    justifyContent: "center",
    alignItems:     "center",
    cursor:         "pointer",
    boxShadow:      "0 10px 30px rgba(0,0,0,0.25)",
    zIndex:          9999,
    border:         "none",
    transition:     "transform 0.2s ease",
  },
  bubbleMobile: {
    position:                 "fixed",
    bottom:                   "30px",
    right:                    "20px",
    width:                    "54px",
    height:                   "54px",
    borderRadius:             "50%",
    background:               BRAND,
    display:                  "flex",
    justifyContent:           "center",
    alignItems:               "center",
    cursor:                   "pointer",
    boxShadow:                "0 6px 20px rgba(0,0,0,0.25)",
    zIndex:                    999999,
    border:                   "none",
    WebkitTapHighlightColor:  "transparent",
    touchAction:              "manipulation",
  },
  window: {
    position:      "fixed",
    bottom:        "150px",
    right:         "20px",
    width:         "370px",
    height:        "460px",
    background:    "#ffffff",
    borderRadius:  "40px",
    display:       "flex",
    flexDirection: "column",
    overflow:      "hidden",
    boxShadow:     "0 20px 60px rgba(0,0,0,0.15)",
    zIndex:         9998,
    border:        "1px solid #e5e7eb",
    fontFamily:    "'Segoe UI', system-ui, sans-serif",
    transition:    "height 0.3s ease, border-radius 0.3s ease",
  },
  windowMinimized: {
    position:      "fixed",
    bottom:        "150px",
    right:         "30px",
    width:         "370px",
    height:        "72px",
    background:    "#ffffff",
    borderRadius:  "20px",
    display:       "flex",
    flexDirection: "column",
    overflow:      "hidden",
    boxShadow:     "0 10px 30px rgba(0,0,0,0.12)",
    zIndex:         9998,
    border:        "1px solid #e5e7eb",
    fontFamily:    "'Segoe UI', system-ui, sans-serif",
    transition:    "height 0.3s ease",
  },
  windowMobile: {
    position:      "fixed",
    bottom:        "0",
    left:          "0",
    right:         "0",
    width:         "100%",
    height:        "100%",
    background:    "#ffffff",
    borderRadius:  "0",
    display:       "flex",
    flexDirection: "column",
    overflow:      "hidden",
    boxShadow:     "0 -8px 40px rgba(0,0,0,0.15)",
    zIndex:         9998,
    border:        "1px solid #e5e7eb",
    borderBottom:  "none",
    fontFamily:   "'Google Sans', 'Nunito', 'Segoe UI', system-ui, sans-serif",
    transition:    "height 0.3s ease",
  },
  windowMobileMinimized: {
    position:      "fixed",
    bottom:        "0",
    left:          "0",
    right:         "0",
    width:         "100%",
    height:        "72px",
    background:    "#ffffff",
    borderRadius:  "24px 24px 0 0",
    display:       "flex",
    flexDirection: "column",
    overflow:      "hidden",
    boxShadow:     "0 -4px 20px rgba(0,0,0,0.1)",
    zIndex:         9998,
    border:        "1px solid #e5e7eb",
    borderBottom:  "none",
    fontFamily:    "'Segoe UI', system-ui, sans-serif",
    transition:    "height 0.3s ease",
  },
  header: {
    padding:         "16px 24px",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "space-between",
    borderBottom:    "1px solid #c5d9d5",
    background:      "#ffffff",
    flexShrink:       0,
    height:          "72px",
    boxSizing:       "border-box",
  },
  headerLeft: {
    display:    "flex",
    alignItems: "center",
    gap:        "12px",
  },
  avatar: {
    width:          "40px",
    height:         "40px",
    background:     "#f0f0f0",
    borderRadius:   "50%",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    border:         "1px solid #e5e7eb",
    flexShrink:      0,
    overflow:       "hidden",
  },
  avatarText: {
    color:      BRAND,
    fontWeight: "700",
    fontSize:   "10px",
  },
  headerTitle: {
    fontSize:   "14px",
    fontWeight: "600",
    color:      "#1f2937",
    margin:      0,
  },
  headerStatus: {
    display:    "flex",
    alignItems: "center",
    gap:        "6px",
    marginTop:  "2px",
  },
  statusDot: {
    width:        "8px",
    height:       "8px",
    background:   "#22c55e",
    borderRadius: "50%",
  },
  statusText: {
    fontSize: "10px",
    color:    "#9ca3af",
  },
  headerActions: {
    display:    "flex",
    alignItems: "center",
    gap:        "14px",
  },
  actionBtn: {
    background:  "none",
    border:      "none",
    cursor:      "pointer",
    padding:     "4px",
    display:     "flex",
    alignItems:  "center",
    borderRadius:"50%",
    transition:  "background 0.2s",
  },
  body: {
    flex:          1,
    padding:       "24px",
    overflowY:     "auto",
    display:       "flex",
    flexDirection: "column",
    gap:           "20px",
  },
  msgColUser: {
    display:       "flex",
    flexDirection: "column",
    alignItems:    "flex-end",
  },
  msgColBot: {
    display:       "flex",
    flexDirection: "column",
    alignItems:    "flex-start",
  },
  userIconWrap: {
    width:          "26px",
    height:         "26px",
    background:     "#e8f5f3",
    borderRadius:   "50%",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    border:         "1px solid #c8e6e1",
    flexShrink:      0,
    alignSelf:      "flex-end",
  },
  msgRowUser: {
    display:    "flex",
    alignItems: "flex-end",
    gap:        "8px",
    maxWidth:   "85%",
  },
  msgRowBot: {
    display:    "flex",
    alignItems: "flex-end",
    gap:        "8px",
    maxWidth:   "85%",
  },
   userBubble: {
    background:   BRAND,
    color:        "white",
    padding:      "14px 18px 10px 18px",
    borderRadius: "24px 24px 0 24px",
    fontSize:     "17px",        // ← grand et lisible
    lineHeight:   "1.55",
    wordBreak:    "break-word",
    overflowWrap: "break-word",
    fontFamily:   "'Google Sans', 'Nunito', 'Segoe UI', system-ui, sans-serif",
    fontWeight:   "500",         // ← medium, pas trop gras
    display:      "flex",
    flexDirection:"column" as const,
    gap:          "6px",
  },
  botBubble: {
    background:   "#f0f2f5",
    color:        "#111827",
    padding:      "14px 18px 10px 18px",
    borderRadius: "24px 24px 24px 0",
    fontSize:     "17px",        // ← grand et lisible
    lineHeight:   "1.55",
    wordBreak:    "break-word",
    overflowWrap: "break-word",
    fontFamily:   "'Google Sans', 'Nunito', 'Segoe UI', system-ui, sans-serif",
    fontWeight:   "500",
    display:      "flex",
    flexDirection:"column" as const,
    gap:          "6px",
  },
  msgAvatar: {
    width:          "32px",
    height:         "32px",
    background:     "#f0f0f0",
    borderRadius:   "50%",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    border:         "1px solid #e5e7eb",
    flexShrink:      0,
    overflow:       "hidden",
  },
  suggestionsWrap: {
    marginLeft:    "40px",
    marginTop:     "10px",
    display:       "flex",
    flexDirection: "column",
    gap:           "8px",
  },
  suggestionBtn: {
    padding:      "8px 16px",
    background:   "#f0f2f5",
    color:        "#111827",
    fontSize:     "16px",
    borderRadius: "999px",
    border:       "none",
    cursor:       "pointer",
    width:        "fit-content",
    transition:   "background 0.2s",
  },
  typingWrap: {
    display:    "flex",
    alignItems: "flex-end",
    gap:        "8px",
  },
  typingBubble: {
    background:   "#f0f2f5",
    padding:      "12px 16px",
    borderRadius: "24px 24px 24px 0",
    display:      "flex",
    gap:          "5px",
    alignItems:   "center",
  },
  dot: {
    width:        "7px",
    height:       "7px",
    background:   "#9ca3af",
    borderRadius: "50%",
    display:      "inline-block",
  },
  inputWrap: {
    padding:    "16px 24px 20px",
    background: "#ffffff",
    flexShrink:  0,
  },
  inputInner: {
    position:   "relative",
    display:    "flex",
    alignItems: "center",
  },
  input: {
    width:        "100%",
    background:   "#f0f2f5",
    borderRadius: "999px",
    padding:      "13px 52px 13px 22px",
    fontSize:     "16px",
    border:       "2px solid transparent",
    outline:      "none",
    color:        "#0f0f0f",
    boxSizing:    "border-box",
    transition:   "border-color 0.2s, background 0.2s",
  },
  sendBtn: {
    position:       "absolute",
    right:          "6px",
    background:     BRAND,
    border:         "none",
    width:          "38px",
    height:         "38px",
    borderRadius:   "50%",
    cursor:         "pointer",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:      0,
  },
};