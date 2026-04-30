// ChatIcons.tsx — v9 (inchange)
import { JSX } from "react";

export const ChatIcon = (): JSX.Element => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="8" width="18" height="11" rx="3" stroke="white" strokeWidth="2"/>
    <circle cx="9"  cy="13" r="1.5" fill="white"/>
    <circle cx="15" cy="13" r="1.5" fill="white"/>
    <path d="M9 17h6"   stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 8V5"   stroke="white" strokeWidth="2"   strokeLinecap="round"/>
    <circle cx="12" cy="4" r="1.5" fill="white"/>
    <path d="M3 13H1M23 13h-2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CloseIcon = (): JSX.Element => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const SendIcon = (): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13"             stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MinusIcon = (): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const ChevronUpIcon = (): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 15l-6-6-6 6" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const XIcon = (): JSX.Element => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const UserIcon = (): JSX.Element => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="#2d5a52" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#2d5a52" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);