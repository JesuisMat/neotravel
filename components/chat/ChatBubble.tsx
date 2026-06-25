"use client";

import React from "react";

interface ChatBubbleProps {
  from: "agent" | "user";
  children?: React.ReactNode;
  typing?: boolean;
}

function renderInline(text: string): React.ReactNode {
  // Handles **bold**, *italic*, `code`
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} style={{ fontWeight: 650 }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code
          key={i}
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 4,
            padding: "1px 5px",
            fontSize: "0.9em",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    return part;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      result.push(
        <pre
          key={i}
          style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(195,219,227,0.1)",
            borderRadius: 8,
            padding: "10px 12px",
            margin: "8px 0",
            overflowX: "auto",
            fontSize: 12.5,
            fontFamily: "var(--font-mono, monospace)",
            color: "rgba(220,236,240,0.9)",
            lineHeight: 1.6,
          }}
        >
          {lang && (
            <span style={{ color: "rgba(195,219,227,0.4)", display: "block", marginBottom: 4, fontSize: 11 }}>
              {lang}
            </span>
          )}
          {codeLines.join("\n")}
        </pre>
      );
      i++;
      continue;
    }

    // Markdown table
    if (line.includes("|") && lines[i + 1]?.match(/^\|[-| :]+\|$/)) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const [header, , ...rows] = tableLines;
      const headerCells = header.split("|").map((c) => c.trim()).filter(Boolean);
      result.push(
        <div key={i} style={{ overflowX: "auto", margin: "8px 0" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
            <thead>
              <tr>
                {headerCells.map((cell, ci) => (
                  <th
                    key={ci}
                    style={{
                      padding: "6px 10px",
                      borderBottom: "1px solid rgba(195,219,227,0.2)",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "rgba(220,236,240,0.9)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => {
                const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
                return (
                  <tr key={ri}>
                    {cells.map((cell, ci) => (
                      <td
                        key={ci}
                        style={{
                          padding: "5px 10px",
                          borderBottom: "1px solid rgba(195,219,227,0.08)",
                          color: "rgba(195,219,227,0.8)",
                        }}
                      >
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      result.push(
        <p key={i} style={{ fontWeight: 600, margin: "10px 0 4px", fontSize: 14, color: "rgba(220,236,240,0.95)" }}>
          {renderInline(line.slice(4))}
        </p>
      );
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      result.push(
        <p key={i} style={{ fontWeight: 700, margin: "12px 0 4px", fontSize: 15, color: "#fff" }}>
          {renderInline(line.slice(3))}
        </p>
      );
      i++;
      continue;
    }

    // Bullet list
    if (/^[-*]\s/.test(line)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        listItems.push(
          <li
            key={i}
            style={{
              marginBottom: 4,
              paddingLeft: 4,
              color: "rgba(195,219,227,0.85)",
            }}
          >
            {renderInline(lines[i].replace(/^[-*]\s/, ""))}
          </li>
        );
        i++;
      }
      result.push(
        <ul key={`ul-${i}`} style={{ margin: "6px 0", paddingLeft: 20, listStyle: "disc" }}>
          {listItems}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(
          <li
            key={i}
            style={{
              marginBottom: 4,
              paddingLeft: 4,
              color: "rgba(195,219,227,0.85)",
            }}
          >
            {renderInline(lines[i].replace(/^\d+\.\s/, ""))}
          </li>
        );
        i++;
      }
      result.push(
        <ol key={`ol-${i}`} style={{ margin: "6px 0", paddingLeft: 20 }}>
          {listItems}
        </ol>
      );
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      result.push(<div key={i} style={{ height: 6 }} />);
      i++;
      continue;
    }

    // Normal paragraph line
    result.push(
      <span key={i} style={{ display: "block" }}>
        {renderInline(line)}
      </span>
    );
    i++;
  }

  return result;
}

export function ChatBubble({ from, children, typing = false }: ChatBubbleProps) {
  const isUser = from === "user";

  if (typing) {
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(195,219,227,0.12)",
            borderRadius: "3px 14px 14px 14px",
            padding: "11px 14px",
            display: "inline-flex",
            gap: 5,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--dawn-400)",
                display: "inline-block",
                animation: `nt-bounce 1.1s ease ${i * 0.16}s infinite`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
        <style>{`@keyframes nt-bounce{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-5px);opacity:1}}`}</style>
      </div>
    );
  }

  const textContent = typeof children === "string" ? children : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: isUser ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      <div
        style={{
          background: isUser
            ? "var(--dawn-400)"
            : "rgba(255,255,255,0.07)",
          color: isUser ? "var(--petrol-950)" : "rgba(220,236,240,0.92)",
          border: isUser ? "none" : "1px solid rgba(195,219,227,0.12)",
          borderRadius: isUser ? "14px 3px 14px 14px" : "3px 14px 14px 14px",
          padding: "10px 15px",
          fontSize: 14.5,
          lineHeight: 1.6,
          fontFamily: "var(--font-sans)",
          fontWeight: isUser ? 500 : 400,
          letterSpacing: isUser ? "0.005em" : "0",
          maxWidth: "85%",
          textAlign: "left",
          wordBreak: "break-word",
        }}
      >
        {textContent ? renderMarkdown(textContent) : children}
      </div>
    </div>
  );
}
