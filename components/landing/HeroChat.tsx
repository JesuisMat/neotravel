"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUpIcon, Bus, GraduationCap, Briefcase, Users, CalendarDays, Maximize2, X } from "lucide-react";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TextShimmer } from "@/components/ui/text-shimmer";

// ── Quick actions NeoTravel ──────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: <GraduationCap size={14} strokeWidth={1.8} />, label: "Sortie scolaire" },
  { icon: <Briefcase size={14} strokeWidth={1.8} />,     label: "Séminaire" },
  { icon: <CalendarDays size={14} strokeWidth={1.8} />,  label: "Événement" },
  { icon: <Bus size={14} strokeWidth={1.8} />,           label: "Tourisme groupe" },
  { icon: <Users size={14} strokeWidth={1.8} />,         label: "Association" },
];

// ── Auto-resize textarea hook ────────────────────────────────────────────────
function useAutoResizeTextarea(minHeight: number, maxHeight = 160) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const adjust = useCallback(
    (reset?: boolean) => {
      const el = ref.current;
      if (!el) return;
      el.style.height = `${minHeight}px`;
      if (!reset) {
        el.style.height = `${Math.max(minHeight, Math.min(el.scrollHeight, maxHeight))}px`;
      }
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (ref.current) ref.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { ref, adjust };
}

// ── Shared chat UI ────────────────────────────────────────────────────────────
interface ChatUIProps {
  messages: ReturnType<typeof useChat>["messages"];
  isTyping: boolean;
  isEmpty: boolean;
  inputValue: string;
  setInputValue: (v: string) => void;
  handleSend: (text?: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  canSend: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  adjust: (reset?: boolean) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  compact?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}

function getMessageText(msg: ReturnType<typeof useChat>["messages"][0]): string {
  if (!msg.parts?.length) return "";
  return msg.parts
    .filter((p) => p.type === "text")
    .map((p) => ("text" in p ? p.text : ""))
    .join("");
}

function ChatUI({
  messages,
  isTyping,
  isEmpty,
  inputValue,
  setInputValue,
  handleSend,
  handleKeyDown,
  canSend,
  textareaRef,
  adjust,
  scrollRef,
  compact = false,
  onExpand,
  onCollapse,
}: ChatUIProps) {
  return (
    <div
      style={{
        background: "rgba(8,20,26,0.72)",
        backdropFilter: "blur(28px) saturate(1.6)",
        WebkitBackdropFilter: "blur(28px) saturate(1.6)",
        border: "1px solid rgba(195,219,227,0.14)",
        borderRadius: compact ? 0 : 20,
        boxShadow: compact ? "none" : "0 24px 80px rgba(6,15,20,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: compact ? "100%" : undefined,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          padding: "14px 16px 12px",
          borderBottom: "1px solid rgba(195,219,227,0.1)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            border: "2px solid rgba(240,160,98,0.35)",
            boxShadow: "0 0 0 4px rgba(240,160,98,0.08)",
            position: "relative",
          }}
        >
          <Image
            src="/images/chat-avatar-neotravel.png"
            alt="Assistant NeoTravel"
            fill
            sizes="38px"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            Assistant NeoTravel
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11.5,
              color: "rgba(134,196,143,0.9)",
              fontFamily: "var(--font-sans)",
              marginTop: 2,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#5DB87A",
                display: "inline-block",
                boxShadow: "0 0 6px rgba(93,184,122,0.6)",
              }}
            />
            En ligne · réponse immédiate
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {onExpand && (
            <button
              onClick={onExpand}
              aria-label="Agrandir la conversation"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: 7,
                border: "1px solid rgba(195,219,227,0.14)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(195,219,227,0.6)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Maximize2 size={13} strokeWidth={2} />
            </button>
          )}
          {onCollapse && (
            <button
              onClick={onCollapse}
              aria-label="Réduire la conversation"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: 7,
                border: "1px solid rgba(195,219,227,0.14)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(195,219,227,0.6)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <X size={13} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      {!isEmpty && (
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: "14px 14px 10px",
            maxHeight: compact ? undefined : 280,
            flex: compact ? "1 1 auto" : undefined,
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(195,219,227,0.15) transparent",
          }}
        >
          {messages.map((m) => (
            <ChatBubble key={m.id} from={m.role === "user" ? "user" : "agent"}>
              {getMessageText(m)}
            </ChatBubble>
          ))}
          {isTyping && (
            <div style={{ padding: "4px 2px" }}>
              <TextShimmer duration={1.6} spread={3}>
                L&apos;assistant réfléchit…
              </TextShimmer>
            </div>
          )}
        </div>
      )}

      {/* Empty state welcome */}
      {isEmpty && (
        <div style={{ padding: "18px 16px 6px" }}>
          <ChatBubble from="agent">
            Bonjour. Décrivez votre besoin de transport de groupe trajet, date, nombre de personnes et je prépare votre devis en quelques minutes.
          </ChatBubble>
        </div>
      )}

      {/* Input area */}
      <div
        style={{
          margin: "10px 12px 12px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(195,219,227,0.16)",
          borderRadius: 14,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            adjust();
          }}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          placeholder="Décrivez votre trajet, vos dates, le nombre de passagers…"
          rows={1}
          style={{
            display: "block",
            width: "100%",
            resize: "none",
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 14.5,
            lineHeight: 1.55,
            fontFamily: "var(--font-sans)",
            color: "#fff",
            padding: "14px 16px 6px",
            boxSizing: "border-box",
            overflowY: "hidden",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "8px 10px",
          }}
        >
          <button
            onClick={() => handleSend()}
            disabled={!canSend}
            aria-label="Envoyer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "none",
              background: canSend ? "var(--dawn-400)" : "rgba(255,255,255,0.07)",
              color: canSend ? "var(--petrol-950)" : "rgba(195,219,227,0.3)",
              cursor: canSend ? "pointer" : "default",
              flexShrink: 0,
              transition: "background 0.15s ease, color 0.15s ease",
            }}
          >
            <ArrowUpIcon size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Quick actions chip bar ────────────────────────────────────────────────────
function QuickActionChips({
  onSend,
  isTyping,
}: {
  onSend: (text: string) => void;
  isTyping: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 16,
      }}
    >
      {QUICK_ACTIONS.map((a) => (
        <button
          key={a.label}
          onClick={() => onSend(a.label)}
          disabled={isTyping}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: 99,
            border: "1px solid rgba(195,219,227,0.18)",
            background: "rgba(6,15,20,0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "rgba(195,219,227,0.75)",
            fontSize: 12.5,
            fontFamily: "var(--font-sans)",
            cursor: isTyping ? "default" : "pointer",
            transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => {
            if (!isTyping) {
              const el = e.currentTarget;
              el.style.background = "rgba(240,160,98,0.12)";
              el.style.borderColor = "rgba(240,160,98,0.35)";
              el.style.color = "rgba(246,184,132,0.95)";
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "rgba(6,15,20,0.55)";
            el.style.borderColor = "rgba(195,219,227,0.18)";
            el.style.color = "rgba(195,219,227,0.75)";
          }}
        >
          {a.icon}
          {a.label}
        </button>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function HeroChat() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref: textareaRef, adjust } = useAutoResizeTextarea(52, 160);
  const { ref: modalTextareaRef, adjust: modalAdjust } = useAutoResizeTextarea(52, 200);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isEmpty = messages.length === 0;
  const isTyping = status === "streaming" || status === "submitted";

  // Auto-scroll compact
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  // Auto-scroll modal
  useEffect(() => {
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = modalScrollRef.current.scrollHeight;
    }
  }, [messages, status, isExpanded]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isExpanded]);

  function handleSend(text?: string) {
    const content = (text ?? inputValue).trim();
    if (!content || isTyping) return;
    sendMessage({ role: "user", parts: [{ type: "text", text: content }] });
    setInputValue("");
    adjust(true);
    modalAdjust(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = inputValue.trim().length > 0 && !isTyping;

  const sharedProps = {
    messages,
    isTyping,
    isEmpty,
    inputValue,
    setInputValue,
    handleSend,
    handleKeyDown,
    canSend,
  };

  return (
    <>
      {/* ── Compact widget ────────────────────────────────────────────── */}
      <div style={{ width: "100%", maxWidth: 680, display: "flex", flexDirection: "column", gap: 0 }}>
        <ChatUI
          {...sharedProps}
          textareaRef={textareaRef}
          adjust={adjust}
          scrollRef={scrollRef}
          onExpand={() => setIsExpanded(true)}
        />
        <QuickActionChips onSend={handleSend} isTyping={isTyping} />
      </div>

      {/* ── Fullscreen modal ──────────────────────────────────────────── */}
      {isExpanded && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(16px,4vw,48px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsExpanded(false);
          }}
        >
          {/* Backdrop */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(6,15,20,0.85)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />
          {/* Modal container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 780,
              height: "min(88dvh, 720px)",
              display: "flex",
              flexDirection: "column",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(6,15,20,0.8), 0 0 0 1px rgba(195,219,227,0.12)",
            }}
          >
            <ChatUI
              {...sharedProps}
              textareaRef={modalTextareaRef}
              adjust={modalAdjust}
              scrollRef={modalScrollRef}
              compact
              onCollapse={() => setIsExpanded(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
