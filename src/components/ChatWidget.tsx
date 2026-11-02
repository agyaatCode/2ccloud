/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * FILE: src/components/ChatWidget.tsx
 * TYPE: Client Component (modern floating launcher + freely draggable compact AI concierge window)
 * USED IN: src/app/layout.tsx (rendered globally across the website)
 *
 * HIGHLIGHTS:
 *   - 100% self-contained scoped CSS (.cw2-*) so global CSS resets (e.g. `* { margin: 0; padding: 0 }`)
 *     never break padding, margins, inputs, buttons, or typography.
 *   - Click-to-Speak on EVERY message (both Client Questions & AI/Team Answers):
 *     click any bubble to hear it spoken aloud with live equalizer animation; click again to stop.
 *   - Sleek 356px concierge layout with generous spacing, aurora navy header, crisp SVG icons,
 *     rich bullet/bold message formatting, animated typing dots, and smooth micro-interactions.
 *   - True 1:1 smooth free-drag anywhere on screen (both launcher orb & chat header),
 *     plus 1-click Left/Right side dock, Minimize bar mode, and localStorage position persistence.
 *   - Multi-language selector + Voice Dictation + Voice Commands + Auto Read-Aloud TTS.
 */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { LANGS, langByCode } from "@/lib/chat-lang";

type Msg = { id: number; role: "user" | "bot" | "admin"; content: string };
type Pos = { x: number; y: number };

const TOKEN_KEY = "chat_token";
const BUBBLE_POS_KEY = "chat_pos";
const WIN_POS_KEY = "chat_win_pos";
const LANG_KEY = "chat_lang";

const BUBBLE = 56; // floating launcher diameter (px)
const EDGE = 14; // safe margin from viewport edges (px)
const WIN_W = 356; // balanced compact concierge width (px)
const WIN_H = 528; // full chat window height (px)
const MIN_H = 64; // collapsed header-only height (px)

const QUICK_PROMPTS = [
  "Why should I use Cloud?",
  "Cloud vs Physical Server",
  "What is a Physical Server?",
  "What services do you offer?",
];

const CW_STYLES = `
  @keyframes cw2FadeUp {
    from { opacity: 0; transform: translateY(10px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes cw2MsgIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes cw2DotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-4px); opacity: 1; }
  }
  @keyframes cw2PulseRing {
    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.65); }
    70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
  }
  @keyframes cw2MicPulse {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.55); }
    70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
  @keyframes cw2EqWave {
    0%, 100% { transform: scaleY(0.35); }
    50% { transform: scaleY(1); }
  }

  .cw2-root, .cw2-root *, .cw2-root *::before, .cw2-root *::after {
    box-sizing: border-box;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .cw2-root.cw2-win {
    position: fixed; z-index: 9998; display: flex; flex-direction: column; overflow: hidden;
    border-radius: 22px; background: #ffffff; border: 1px solid rgba(15, 23, 42, 0.1);
    box-shadow: 0 24px 60px -12px rgba(8, 18, 38, 0.34), 0 8px 24px -6px rgba(15, 23, 42, 0.14),
      0 0 0 1px rgba(255, 255, 255, 0.6) inset;
    animation: cw2FadeUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Draggable Midnight Aurora Header */
  .cw2-root .cw2-hdr {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
    height: 64px; min-height: 64px; padding: 12px 16px; margin: 0;
    cursor: grab; user-select: none; touch-action: none; color: #ffffff;
    background:
      radial-gradient(120% 150% at 0% 0%, rgba(56, 189, 248, 0.25) 0%, transparent 55%),
      radial-gradient(110% 140% at 100% 0%, rgba(99, 102, 241, 0.28) 0%, transparent 55%),
      linear-gradient(135deg, #091322 0%, #0f213d 58%, #162f54 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .cw2-root .cw2-hdr:active { cursor: grabbing; }
  .cw2-root .cw2-hdr-left { display: flex; align-items: center; gap: 11px; min-width: 0; flex: 1; }
  .cw2-root .cw2-avatar-wrap {
    position: relative; width: 38px; height: 38px; flex-shrink: 0; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; color: #ffffff;
    background: linear-gradient(135deg, #38bdf8 0%, #2563eb 55%, #4f46e5 100%);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.22) inset;
  }
  .cw2-root .cw2-online-dot {
    position: absolute; right: -2px; bottom: -2px; width: 11px; height: 11px;
    border-radius: 999px; background: #22c55e; border: 2px solid #0c1b33;
    animation: cw2PulseRing 2.4s infinite;
  }
  .cw2-root .cw2-title-box { min-width: 0; flex: 1; }
  .cw2-root .cw2-title {
    margin: 0; padding: 0; font-size: 14px; font-weight: 700; line-height: 1.25;
    letter-spacing: -0.01em; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .cw2-root .cw2-subtitle {
    margin: 2px 0 0 0; padding: 0; font-size: 11.5px; font-weight: 400; line-height: 1.2;
    color: rgba(226, 232, 240, 0.78); display: flex; align-items: center; gap: 5px; white-space: nowrap;
  }
  .cw2-root .cw2-hdr-actions { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
  .cw2-root .cw2-icon-btn {
    width: 30px; height: 30px; padding: 0; margin: 0; border-radius: 9px;
    border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.88); display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.16s ease, color 0.16s ease, transform 0.16s ease;
  }
  .cw2-root .cw2-icon-btn:hover { background: rgba(255, 255, 255, 0.18); color: #ffffff; transform: translateY(-1px); }

  /* Secondary Toolbar Strip (Language + Voice Audio) */
  .cw2-root .cw2-toolbar {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    padding: 8px 16px; margin: 0; background: #f8fafc; border-bottom: 1px solid #e6ebf2; flex-shrink: 0;
  }
  .cw2-root .cw2-lang-pill {
    display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px;
    background: #ffffff; border: 1px solid #dbe3ef; color: #334155; font-size: 11.5px; font-weight: 500;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  }
  .cw2-root .cw2-lang-select {
    border: none; background: transparent; color: #1e293b; font-size: 11.5px; font-weight: 600;
    padding: 1px 2px; margin: 0; outline: none; cursor: pointer; max-width: 120px;
  }
  .cw2-root .cw2-voice-toggle {
    display: inline-flex; align-items: center; gap: 5px; padding: 5px 11px; margin: 0;
    border-radius: 999px; font-size: 11.5px; font-weight: 600; cursor: pointer;
    border: 1px solid #dbe3ef; background: #ffffff; color: #475569; transition: all 0.16s ease;
  }
  .cw2-root .cw2-voice-toggle:hover { border-color: #93c5fd; color: #1d4ed8; }
  .cw2-root .cw2-voice-toggle.active {
    background: #eff6ff; border-color: #60a5fa; color: #1d4ed8; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.14);
  }

  /* Onboarding Lead Form */
  .cw2-root .cw2-onboard {
    flex: 1; min-height: 0; overflow-y: auto; padding: 18px 18px 20px 18px; margin: 0;
    display: flex; flex-direction: column; justify-content: space-between; gap: 12px;
    background: linear-gradient(180deg, #f8faff 0%, #ffffff 42%);
  }
  .cw2-root .cw2-welcome-card {
    padding: 14px 15px; margin: 0 0 16px 0; border-radius: 16px;
    background: linear-gradient(145deg, #eff6ff 0%, #eef2ff 100%); border: 1px solid #dbeafe;
  }
  .cw2-root .cw2-badge {
    display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; margin: 0 0 8px 0;
    border-radius: 999px; background: #ffffff; color: #1d4ed8; font-size: 10.5px; font-weight: 700;
    letter-spacing: 0.02em; box-shadow: 0 1px 3px rgba(37, 99, 235, 0.1);
  }
  .cw2-root .cw2-welcome-h { margin: 0 0 4px 0; padding: 0; font-size: 15px; font-weight: 700; color: #0f172a; line-height: 1.3; }
  .cw2-root .cw2-welcome-p { margin: 0; padding: 0; font-size: 12.2px; line-height: 1.5; color: #475569; }
  .cw2-root .cw2-form-fields { display: flex; flex-direction: column; gap: 11px; margin: 0; padding: 0; }
  .cw2-root .cw2-input-group { position: relative; display: flex; align-items: center; }
  .cw2-root .cw2-input-icon {
    position: absolute; left: 12px; color: #94a3b8; display: flex; align-items: center;
    pointer-events: none; transition: color 0.16s ease;
  }
  .cw2-root .cw2-field {
    width: 100%; height: 42px; padding: 10px 13px 10px 38px; margin: 0; border-radius: 12px;
    border: 1.5px solid #e2e8f0; background: #f8fafc; color: #0f172a; font-size: 13px; line-height: 1.4;
    outline: none; transition: border-color 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
  }
  .cw2-root .cw2-field::placeholder { color: #94a3b8; }
  .cw2-root .cw2-field:focus { background: #ffffff; border-color: #2563eb; box-shadow: 0 0 0 3.5px rgba(37, 99, 235, 0.13); }
  .cw2-root .cw2-input-group:focus-within .cw2-input-icon { color: #2563eb; }
  .cw2-root .cw2-primary-btn {
    margin: 6px 0 0 0; padding: 11px 18px; height: 44px; width: 100%; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 55%, #4338ca 100%); color: #ffffff;
    font-size: 13.5px; font-weight: 600; letter-spacing: -0.01em; display: inline-flex;
    align-items: center; justify-content: center; gap: 8px; cursor: pointer;
    box-shadow: 0 10px 22px -6px rgba(37, 99, 235, 0.5);
    transition: transform 0.16s ease, box-shadow 0.16s ease, opacity 0.16s ease;
  }
  .cw2-root .cw2-primary-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 14px 26px -6px rgba(37, 99, 235, 0.6); }
  .cw2-root .cw2-primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .cw2-root .cw2-trust-note {
    margin: 14px 0 0 0; padding: 0; text-align: center; font-size: 11px; color: #94a3b8;
    display: flex; align-items: center; justify-content: center; gap: 5px;
  }

  /* Messages Stream */
  .cw2-root .cw2-stream {
    flex: 1; min-height: 0; overflow-y: auto; padding: 16px 15px 18px 15px; margin: 0;
    background: #f4f7fb; display: flex; flex-direction: column; gap: 13px; scroll-behavior: smooth;
  }
  .cw2-root .cw2-stream::-webkit-scrollbar { width: 5px; }
  .cw2-root .cw2-stream::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.45); border-radius: 999px; }
  .cw2-root .cw2-row-bot { display: flex; align-items: flex-start; gap: 9px; flex-shrink: 0; animation: cw2MsgIn 0.2s ease-out; }
  .cw2-root .cw2-row-user { display: flex; justify-content: flex-end; flex-shrink: 0; animation: cw2MsgIn 0.2s ease-out; }
  .cw2-root .cw2-mini-avatar {
    width: 26px; height: 26px; margin-top: 2px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: #ffffff;
    box-shadow: 0 3px 8px rgba(37, 99, 235, 0.28);
  }
  .cw2-root .cw2-mini-avatar.admin {
    background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
    box-shadow: 0 3px 8px rgba(5, 150, 105, 0.28);
  }
  .cw2-root .cw2-bubble-bot {
    max-width: 85%; padding: 11px 14px 9px 14px; margin: 0; border-radius: 5px 16px 16px 16px;
    background: #ffffff; border: 1px solid #e2e8f0; color: #1e293b; font-size: 13px; line-height: 1.56;
    word-break: break-word; cursor: pointer;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.045);
    transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease;
  }
  .cw2-root .cw2-bubble-bot:hover {
    border-color: #bfdbfe;
    box-shadow: 0 5px 15px rgba(37, 99, 235, 0.09);
  }
  .cw2-root .cw2-bubble-bot.speaking {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14), 0 6px 18px rgba(37, 99, 235, 0.12);
  }
  .cw2-root .cw2-bubble-bot.admin { border-color: #a7f3d0; background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 36px); }
  .cw2-root .cw2-admin-tag {
    display: inline-flex; align-items: center; gap: 5px; margin: 0 0 6px 0; padding: 2px 8px;
    border-radius: 999px; background: #dcfce7; color: #15803d; font-size: 10px; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
  .cw2-root .cw2-bubble-user {
    max-width: 83%; padding: 10px 14px 8px 14px; margin: 0; border-radius: 16px 16px 4px 16px;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff;
    font-size: 13px; line-height: 1.52; word-break: break-word; cursor: pointer;
    box-shadow: 0 6px 16px -4px rgba(37, 99, 235, 0.38);
    transition: box-shadow 0.16s ease, transform 0.16s ease;
  }
  .cw2-root .cw2-bubble-user:hover {
    box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.52);
  }
  .cw2-root .cw2-bubble-user.speaking {
    box-shadow: 0 0 0 3.5px rgba(59, 130, 246, 0.34), 0 8px 22px -4px rgba(37, 99, 235, 0.55);
  }

  /* Per-Message Voice Status Bar */
  .cw2-root .cw2-msg-voice {
    display: flex; align-items: center; gap: 5px; margin: 7px 0 0 0; padding: 3px 0 0 0;
    font-size: 10.5px; font-weight: 600; color: #94a3b8;
    border-top: 1px solid rgba(226, 232, 240, 0.7);
    transition: color 0.15s ease;
  }
  .cw2-root .cw2-bubble-bot:hover .cw2-msg-voice { color: #2563eb; }
  .cw2-root .cw2-msg-voice.active { color: #2563eb; }
  .cw2-root .cw2-msg-voice.user {
    justify-content: flex-end; color: rgba(255, 255, 255, 0.78);
    border-top: 1px solid rgba(255, 255, 255, 0.18);
  }
  .cw2-root .cw2-bubble-user:hover .cw2-msg-voice.user,
  .cw2-root .cw2-msg-voice.user.active { color: #ffffff; }

  .cw2-root .cw2-eq {
    display: inline-flex; align-items: center; gap: 2px; height: 11px;
  }
  .cw2-root .cw2-eq i {
    display: block; width: 2.2px; height: 10px; border-radius: 2px; background: currentColor;
    transform-origin: center; animation: cw2EqWave 0.75s infinite ease-in-out;
  }
  .cw2-root .cw2-eq i:nth-child(2) { animation-delay: 0.18s; }
  .cw2-root .cw2-eq i:nth-child(3) { animation-delay: 0.34s; }

  /* Rich Message Typography Inside Bubbles */
  .cw2-root .cw2-p { margin: 0; padding: 0; }
  .cw2-root .cw2-p + .cw2-p, .cw2-root .cw2-p + .cw2-li, .cw2-root .cw2-li + .cw2-p { margin-top: 8px; }
  .cw2-root .cw2-li + .cw2-li { margin-top: 5px; }
  .cw2-root .cw2-li { display: flex; align-items: flex-start; gap: 8px; margin: 0; padding: 0; }
  .cw2-root .cw2-bullet-dot {
    width: 6px; height: 6px; margin-top: 7px; border-radius: 999px; background: #2563eb; flex-shrink: 0;
  }
  .cw2-root .cw2-num-badge { font-weight: 700; color: #2563eb; font-size: 12px; min-width: 16px; flex-shrink: 0; }

  /* Quick Prompts Chips & Typing Dots */
  .cw2-root .cw2-prompts-box { margin: 2px 0 0 35px; padding: 0; flex-shrink: 0; }
  .cw2-root .cw2-prompts-label {
    margin: 0 0 8px 0; padding: 0; font-size: 10.5px; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; color: #64748b;
  }
  .cw2-root .cw2-prompts-grid { display: flex; flex-wrap: wrap; gap: 7px; }
  .cw2-root .cw2-chip {
    padding: 7px 12px; margin: 0; border-radius: 999px; border: 1px solid #d8e2f0; background: #ffffff;
    color: #1e293b; font-size: 11.8px; font-weight: 500; line-height: 1.25; cursor: pointer;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04); transition: all 0.16s ease;
  }
  .cw2-root .cw2-chip:hover { border-color: #2563eb; background: #eff6ff; color: #1d4ed8; transform: translateY(-1px); }
  .cw2-root .cw2-typing {
    display: inline-flex; align-items: center; gap: 5px; padding: 12px 15px; border-radius: 5px 16px 16px 16px;
    background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  }
  .cw2-root .cw2-dot {
    width: 6px; height: 6px; border-radius: 999px; background: #2563eb;
    animation: cw2DotBounce 1.3s infinite ease-in-out both;
  }
  .cw2-root .cw2-dot:nth-child(2) { animation-delay: 0.16s; }
  .cw2-root .cw2-dot:nth-child(3) { animation-delay: 0.32s; }
  .cw2-root .cw2-err {
    margin: 0; padding: 8px 14px; background: #fef2f2; border-top: 1px solid #fecaca;
    color: #dc2626; font-size: 12px; font-weight: 500;
  }

  /* Bottom Composer Capsule */
  .cw2-root .cw2-composer-wrap {
    padding: 10px 13px 12px 13px; margin: 0; background: #ffffff; border-top: 1px solid #e6ebf2; flex-shrink: 0;
  }
  .cw2-root .cw2-composer {
    display: flex; align-items: center; gap: 7px; padding: 5px 6px 5px 10px;
    border-radius: 15px; border: 1.5px solid #cbd5e1; background: #f8fafc;
    transition: border-color 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
  }
  .cw2-root .cw2-composer:focus-within {
    background: #ffffff; border-color: #2563eb; box-shadow: 0 0 0 3.5px rgba(37, 99, 235, 0.12);
  }
  .cw2-root .cw2-mic-btn {
    width: 34px; height: 34px; padding: 0; margin: 0; border-radius: 10px; border: none; background: transparent;
    color: #64748b; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
    cursor: pointer; transition: background 0.16s ease, color 0.16s ease;
  }
  .cw2-root .cw2-mic-btn:hover { background: #e2e8f0; color: #0f172a; }
  .cw2-root .cw2-mic-btn.listening { background: #ef4444; color: #ffffff; animation: cw2MicPulse 1.5s infinite; }
  .cw2-root .cw2-chat-input {
    flex: 1; min-width: 0; border: none; background: transparent; padding: 7px 4px; margin: 0;
    color: #0f172a; font-size: 13px; line-height: 1.4; outline: none;
  }
  .cw2-root .cw2-chat-input::placeholder { color: #94a3b8; }
  .cw2-root .cw2-send-btn {
    width: 36px; height: 36px; padding: 0; margin: 0; border-radius: 11px; border: none;
    background: linear-gradient(135deg, #2563eb 0%, #4338ca 100%); color: #ffffff;
    display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
    transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
  }
  .cw2-root .cw2-send-btn:hover:not(:disabled) { transform: scale(1.04); box-shadow: 0 6px 16px rgba(37, 99, 235, 0.48); }
  .cw2-root .cw2-send-btn:disabled { background: #cbd5e1; box-shadow: none; cursor: not-allowed; opacity: 0.7; }

  /* Draggable Floating Launcher Button */
  .cw2-root.cw2-launcher {
    position: fixed; z-index: 9999; padding: 0; margin: 0; border: 2px solid rgba(255, 255, 255, 0.85);
    border-radius: 999px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 52%, #4338ca 100%);
    color: #ffffff; display: flex; align-items: center; justify-content: center;
    cursor: grab; user-select: none; touch-action: none;
    box-shadow: 0 14px 32px -4px rgba(37, 99, 235, 0.52), 0 6px 14px -2px rgba(15, 23, 42, 0.2);
    transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.18s ease;
  }
  .cw2-root.cw2-launcher:hover {
    transform: scale(1.06);
    box-shadow: 0 18px 38px -4px rgba(37, 99, 235, 0.62), 0 8px 18px -2px rgba(15, 23, 42, 0.24);
  }
  .cw2-root.cw2-launcher:active { cursor: grabbing; transform: scale(0.96); }
  .cw2-root .cw2-launcher-badge {
    position: absolute; top: 1px; right: 1px; width: 13px; height: 13px;
    border-radius: 999px; background: #22c55e; border: 2.5px solid #ffffff;
  }
`;

/** Cleans bullet markers & symbols so browser Text-to-Speech reads naturally. */
function cleanSpeechText(raw: string): string {
  return raw
    .replace(/\(Ref:\s*#[A-Za-z0-9-]+\)/gi, "")
    .replace(/[•*#_`~>]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Picks the best BCP-47 speech locale for a message (supports Auto script detection). */
function detectSpeechLang(text: string, selectedLang: string): string {
  const configured = langByCode(selectedLang).speech;
  if (configured) return configured;
  if (/[\u0900-\u097F]/.test(text)) return "hi-IN";
  if (/[\u0980-\u09FF]/.test(text)) return "bn-IN";
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN";
  if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN";
  if (/[\u3040-\u30FF]/.test(text)) return "ja-JP";
  if (/[\u0600-\u06FF]/.test(text)) return "ar-SA";
  return typeof navigator !== "undefined" && navigator.language ? navigator.language : "en-IN";
}

/** Prefers crisp Google / Microsoft Natural neural browser voices when available. */
function pickBestVoice(locale: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const prefix = locale.toLowerCase().split("-")[0];
  const exact = voices.filter((v) => v.lang.toLowerCase() === locale.toLowerCase());
  const pool = exact.length ? exact : voices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
  if (!pool.length) return null;
  return pool.find((v) => /natural|online|google|neural/i.test(v.name)) || pool[0];
}

/** Parses inline **bold** segments cleanly without dangerouslySetInnerHTML. */
function renderInlineBold(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={idx} style={{ fontWeight: 700 }}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    ),
  );
}

/** Formats paragraphs, bullets (• / - / *), numbered lists, and bold text cleanly inside chat bubbles. */
function renderRichMessage(content: string, isUser: boolean): React.ReactNode {
  if (isUser) return <p className="cw2-p">{content}</p>;

  return content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const cleanHeading = line.replace(/^#{1,4}\s+/, "");
      const bulletMatch = cleanHeading.match(/^[•\-*]\s+(.*)$/);
      if (bulletMatch) {
        return (
          <div key={idx} className="cw2-li">
            <span className="cw2-bullet-dot" aria-hidden="true" />
            <span>{renderInlineBold(bulletMatch[1])}</span>
          </div>
        );
      }
      const numMatch = cleanHeading.match(/^(\d+\.)\s+(.*)$/);
      if (numMatch) {
        return (
          <div key={idx} className="cw2-li">
            <span className="cw2-num-badge">{numMatch[1]}</span>
            <span>{renderInlineBold(numMatch[2])}</span>
          </div>
        );
      }
      return (
        <p key={idx} className="cw2-p">
          {line.startsWith("#") ? (
            <strong style={{ fontWeight: 700, color: "#0f172a" }}>{cleanHeading}</strong>
          ) : (
            renderInlineBold(cleanHeading)
          )}
        </p>
      );
    });
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("auto");
  const [voiceOut, setVoiceOut] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [micOk, setMicOk] = useState(false);

  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [bubblePos, setBubblePos] = useState<Pos | null>(null);
  const [winPos, setWinPos] = useState<Pos | null>(null);

  const lastId = useRef(0);
  const busyRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);
  const spokenUpTo = useRef(0);
  const speakSeq = useRef(0);

  const dragRef = useRef<{
    target: "bubble" | "window";
    sx: number;
    sy: number;
    ox: number;
    oy: number;
    moved: boolean;
  } | null>(null);

  /* ------------------------------ Viewport & Position Helpers ------------------------------ */

  const getWinDimensions = useCallback(
    (w = vp.w, h = vp.h, isMin = minimized) => {
      const width = Math.min(WIN_W, Math.max(280, w - EDGE * 2));
      const height = isMin ? MIN_H : Math.min(WIN_H, Math.max(320, h - BUBBLE - EDGE * 3));
      return { width, height };
    },
    [vp.w, vp.h, minimized],
  );

  const clampBubble = useCallback(
    (p: Pos, w = vp.w, h = vp.h): Pos => ({
      x: Math.min(Math.max(EDGE, p.x), Math.max(EDGE, w - BUBBLE - EDGE)),
      y: Math.min(Math.max(EDGE, p.y), Math.max(EDGE, h - BUBBLE - EDGE)),
    }),
    [vp.w, vp.h],
  );

  const clampWindow = useCallback(
    (p: Pos, w = vp.w, h = vp.h, isMin = minimized): Pos => {
      const { width, height } = getWinDimensions(w, h, isMin);
      return {
        x: Math.min(Math.max(EDGE, p.x), Math.max(EDGE, w - width - EDGE)),
        y: Math.min(Math.max(EDGE, p.y), Math.max(EDGE, h - height - EDGE)),
      };
    },
    [vp.w, vp.h, minimized, getWinDimensions],
  );

  const computeWindowNearBubble = useCallback(
    (b: Pos, w = vp.w, h = vp.h, isMin = minimized): Pos => {
      const { width, height } = getWinDimensions(w, h, isMin);
      const onRightHalf = b.x + BUBBLE / 2 > w / 2;
      const x = onRightHalf ? b.x + BUBBLE - width : b.x;
      let y = b.y - height - 12;
      if (y < EDGE) y = b.y + BUBBLE + 12;
      return clampWindow({ x, y }, w, h, isMin);
    },
    [vp.w, vp.h, minimized, getWinDimensions, clampWindow],
  );

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setVp({ w, h });

    let savedBubble: Pos | null = null;
    let savedWin: Pos | null = null;
    try {
      savedBubble = JSON.parse(localStorage.getItem(BUBBLE_POS_KEY) || "null");
      savedWin = JSON.parse(localStorage.getItem(WIN_POS_KEY) || "null");
    } catch {
      savedBubble = null;
      savedWin = null;
    }

    const initialBubble =
      savedBubble && typeof savedBubble.x === "number"
        ? {
            x: Math.min(Math.max(EDGE, savedBubble.x), Math.max(EDGE, w - BUBBLE - EDGE)),
            y: Math.min(Math.max(EDGE, savedBubble.y), Math.max(EDGE, h - BUBBLE - EDGE)),
          }
        : { x: Math.max(EDGE, w - BUBBLE - 22), y: Math.max(EDGE, h - BUBBLE - 22) };

    setBubblePos(initialBubble);

    if (savedWin && typeof savedWin.x === "number") {
      const width = Math.min(WIN_W, Math.max(280, w - EDGE * 2));
      const height = Math.min(WIN_H, Math.max(320, h - BUBBLE - EDGE * 3));
      setWinPos({
        x: Math.min(Math.max(EDGE, savedWin.x), Math.max(EDGE, w - width - EDGE)),
        y: Math.min(Math.max(EDGE, savedWin.y), Math.max(EDGE, h - height - EDGE)),
      });
    }

    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang && LANGS.some((x) => x.code === savedLang)) setLang(savedLang);
    setMicOk(Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));

    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setVp({ w, h });
      setBubblePos((p) => (p ? clampBubble(p, w, h) : p));
      setWinPos((p) => (p ? clampWindow(p, w, h) : p));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampBubble, clampWindow]);

  /* ------------------------------ Smooth Free-Drag Handlers ------------------------------ */

  function onBubbleDown(e: React.PointerEvent) {
    if (!bubblePos) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      target: "bubble",
      sx: e.clientX,
      sy: e.clientY,
      ox: bubblePos.x,
      oy: bubblePos.y,
      moved: false,
    };
  }

  function onHeaderDown(e: React.PointerEvent) {
    const currentWin = winPos ?? (bubblePos ? computeWindowNearBubble(bubblePos) : null);
    if (!currentWin) return;
    if ((e.target as HTMLElement).closest("button, select, input, textarea, a")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      target: "window",
      sx: e.clientX,
      sy: e.clientY,
      ox: currentWin.x,
      oy: currentWin.y,
      moved: false,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    d.moved = true;

    if (d.target === "bubble") {
      const next = clampBubble({ x: d.ox + dx, y: d.oy + dy });
      setBubblePos(next);
      if (open) setWinPos(computeWindowNearBubble(next));
    } else {
      setWinPos(clampWindow({ x: d.ox + dx, y: d.oy + dy }));
    }
  }

  function onPointerUp() {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;

    if (!d.moved) {
      if (d.target === "bubble") {
        setOpen((wasOpen) => {
          const nextOpen = !wasOpen;
          if (nextOpen && bubblePos) {
            setMinimized(false);
            setWinPos((prev) =>
              prev ? clampWindow(prev, vp.w, vp.h, false) : computeWindowNearBubble(bubblePos, vp.w, vp.h, false),
            );
          }
          return nextOpen;
        });
      }
      return;
    }

    if (d.target === "bubble") {
      setBubblePos((p) => {
        if (p) {
          try {
            localStorage.setItem(BUBBLE_POS_KEY, JSON.stringify(p));
          } catch {
            /* ignore storage errors */
          }
        }
        return p;
      });
    } else {
      setWinPos((wPos) => {
        if (wPos) {
          const { width, height } = getWinDimensions();
          const onRight = wPos.x + width / 2 > vp.w / 2;
          const syncedBubble = clampBubble({
            x: onRight ? wPos.x + width - BUBBLE : wPos.x,
            y: wPos.y + height + 12 <= vp.h - BUBBLE - EDGE ? wPos.y + height + 12 : wPos.y - BUBBLE - 12,
          });
          setBubblePos(syncedBubble);
          try {
            localStorage.setItem(WIN_POS_KEY, JSON.stringify(wPos));
            localStorage.setItem(BUBBLE_POS_KEY, JSON.stringify(syncedBubble));
          } catch {
            /* ignore storage errors */
          }
        }
        return wPos;
      });
    }
  }

  function toggleSide() {
    const baseWin = winPos ?? (bubblePos ? computeWindowNearBubble(bubblePos) : null);
    if (!baseWin) return;
    const { width } = getWinDimensions();
    const isLeft = baseWin.x < vp.w / 2 - width / 2;
    const nextWin = clampWindow({ x: isLeft ? vp.w - width - 18 : 18, y: baseWin.y });
    const syncedBubble = clampBubble({
      x: isLeft ? vp.w - BUBBLE - 18 : 18,
      y: bubblePos?.y ?? vp.h - BUBBLE - 22,
    });
    setWinPos(nextWin);
    setBubblePos(syncedBubble);
    try {
      localStorage.setItem(WIN_POS_KEY, JSON.stringify(nextWin));
      localStorage.setItem(BUBBLE_POS_KEY, JSON.stringify(syncedBubble));
    } catch {
      /* ignore */
    }
  }

  /* ------------------------------ Messages & Polling ------------------------------ */

  const merge = useCallback((incoming: Msg[]) => {
    if (!incoming.length) return;
    setMsgs((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      const add = incoming.filter((m) => !seen.has(m.id));
      if (!add.length) return prev;
      return [...prev, ...add].sort((a, b) => a.id - b.id);
    });
  }, []);

  useEffect(() => {
    lastId.current = msgs.length ? msgs[msgs.length - 1].id : 0;
    if (open && !minimized) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open, minimized]);

  const poll = useCallback(
    async (t: string, after: number) => {
      try {
        const r = await fetch(`/api/chat/poll?token=${encodeURIComponent(t)}&after=${after}`, {
          cache: "no-store",
        });
        if (r.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setMsgs([]);
          return;
        }
        if (r.ok) merge((await r.json()).messages as Msg[]);
      } catch {
        /* network hiccup — next poll retries automatically */
      }
    },
    [merge],
  );

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) {
      setToken(t);
      void poll(t, 0);
    }
  }, [poll]);

  useEffect(() => {
    if (!open || !token) return;
    const id = setInterval(() => void poll(token, lastId.current), 4000);
    return () => clearInterval(id);
  }, [open, token, poll]);

  /* ------------------------------ Voice Output & Click-to-Speak ------------------------------ */

  const speechLocale = useCallback(
    () => langByCode(lang).speech || navigator.language || "en-IN",
    [lang],
  );

  const stopSpeaking = useCallback(() => {
    speakSeq.current += 1;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  }, []);

  const speakMessage = useCallback(
    (text: string, msgId?: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const clean = cleanSpeechText(text);
      if (!clean) return;

      const seq = ++speakSeq.current;
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const locale = detectSpeechLang(clean, lang);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = locale;
      const preferredVoice = pickBestVoice(locale);
      if (preferredVoice) utterance.voice = preferredVoice;

      setSpeakingId(msgId ?? null);
      utterance.onend = () => {
        if (speakSeq.current === seq) setSpeakingId(null);
      };
      utterance.onerror = () => {
        if (speakSeq.current === seq) setSpeakingId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [lang],
  );

  /** Clicking any client question or bot/admin answer plays it aloud (or stops if already playing). */
  function handleMessageClick(m: Msg) {
    const selected = typeof window !== "undefined" ? window.getSelection()?.toString().trim() : "";
    if (selected) return;

    if (speakingId === m.id) {
      stopSpeaking();
      return;
    }
    setVoiceOut(true);
    speakMessage(m.content, m.id);
  }

  useEffect(() => {
    if (!open) stopSpeaking();
  }, [open, stopSpeaking]);

  useEffect(() => {
    const last = msgs.length ? msgs[msgs.length - 1].id : 0;
    if (!voiceOut || typeof window === "undefined" || !("speechSynthesis" in window)) {
      spokenUpTo.current = last;
      return;
    }
    for (const m of msgs) {
      if (m.id > spokenUpTo.current && m.role !== "user") speakMessage(m.content, m.id);
    }
    spokenUpTo.current = last;
  }, [msgs, voiceOut, speakMessage]);

  function toggleVoiceOut() {
    if (voiceOut) {
      stopSpeaking();
      setVoiceOut(false);
    } else {
      setVoiceOut(true);
      const lastMsg = msgs.length ? msgs[msgs.length - 1] : null;
      if (lastMsg) speakMessage(lastMsg.content, lastMsg.id);
    }
  }

  /* ------------------------------ Chat Actions ------------------------------ */

  function changeLang(code: string) {
    setLang(code);
    try {
      localStorage.setItem(LANG_KEY, code);
    } catch {
      /* ignore */
    }
  }

  async function startChat(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Something went wrong.");
      localStorage.setItem(TOKEN_KEY, d.token);
      setToken(d.token);
      await poll(d.token, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const sendText = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || !token || busyRef.current) return;
      busyRef.current = true;
      setInput("");
      setError("");
      setBusy(true);
      try {
        const r = await fetch("/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, message: text, lang }),
        });
        if (r.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setMsgs([]);
          return;
        }
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Message failed.");
        merge(d.messages as Msg[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Message failed.");
        setInput(text);
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [token, lang, merge],
  );

  function send(e: React.FormEvent) {
    e.preventDefault();
    void sendText(input);
  }

  /* ------------------------------ Voice Input & Spoken Commands ------------------------------ */

  function runVoiceCommand(spoken: string): boolean {
    const cmd = spoken.trim().toLowerCase().replace(/[.!?।]+$/g, "");
    if (["close chat", "close window", "chat band karo", "band karo"].includes(cmd)) {
      stopSpeaking();
      setOpen(false);
      setInput("");
      return true;
    }
    if (["minimize", "minimize chat", "chhota karo"].includes(cmd)) {
      setMinimized(true);
      setInput("");
      return true;
    }
    if (["mute", "voice off", "stop speaking", "chup"].includes(cmd)) {
      stopSpeaking();
      setVoiceOut(false);
      setInput("");
      return true;
    }
    if (["voice on", "read aloud", "bol ke sunao", "speak answer"].includes(cmd)) {
      setVoiceOut(true);
      const lastBot = [...msgs].reverse().find((m) => m.role !== "user");
      if (lastBot) speakMessage(lastBot.content, lastBot.id);
      setInput("");
      return true;
    }
    if (["clear", "saaf karo"].includes(cmd)) {
      setInput("");
      return true;
    }
    return false;
  }

  function toggleMic() {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    stopSpeaking();
    const rec = new SR();
    rec.lang = speechLocale();
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e: any) => {
      let transcript = "";
      for (let i = 0; i < e.results.length; i++) transcript += e.results[i][0].transcript;
      setInput(transcript);
      if (e.results[e.results.length - 1].isFinal) finalText = transcript;
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      setListening(false);
      const cleanFinal = finalText.trim();
      if (!cleanFinal) return;
      if (!runVoiceCommand(cleanFinal)) void sendText(cleanFinal);
    };
    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  /* ------------------------------ Render ------------------------------ */

  if (!bubblePos || !vp.w) return null;

  const { width: winWidth, height: winHeight } = getWinDimensions();
  const activeWinPos = winPos ?? computeWindowNearBubble(bubblePos);

  return (
    <>
      <style>{CW_STYLES}</style>

      {open && (
        <div
          role="dialog"
          aria-label="AI Chat Assistant"
          style={{ left: activeWinPos.x, top: activeWinPos.y, width: winWidth, height: winHeight }}
          className="cw2-root cw2-win"
        >
          {/* Draggable Midnight Aurora Header */}
          <div
            onPointerDown={onHeaderDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            title="Drag header to place anywhere on screen"
            className="cw2-hdr"
          >
            <div className="cw2-hdr-left">
              <div className="cw2-avatar-wrap" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.9 3.8L18 8.7l-3 2.9.7 4.1L12 13.8l-3.7 1.9.7-4.1-3-2.9 4.1-1.9L12 3z" />
                  <path d="M19 16v3" />
                  <path d="M17.5 17.5h3" />
                </svg>
                <span className="cw2-online-dot" />
              </div>

              <div className="cw2-title-box">
                <p className="cw2-title">Cloud AI Assistant</p>
                <p className="cw2-subtitle">
                  <span>Online</span>
                  <span aria-hidden="true">·</span>
                  <span>Click any message to listen</span>
                </p>
              </div>
            </div>

            <div className="cw2-hdr-actions">
              <button
                type="button"
                onClick={toggleSide}
                aria-label="Switch screen side"
                title="Move window to opposite side"
                className="cw2-icon-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3L4 7l4 4" />
                  <path d="M4 7h16" />
                  <path d="M16 21l4-4-4-4" />
                  <path d="M20 17H4" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextMin = !minimized;
                  setMinimized(nextMin);
                  setWinPos((p) => (p ? clampWindow(p, vp.w, vp.h, nextMin) : p));
                }}
                aria-label={minimized ? "Expand chat" : "Minimize chat"}
                title={minimized ? "Expand chat" : "Minimize chat"}
                className="cw2-icon-btn"
              >
                {minimized ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="3" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                title="Close chat"
                className="cw2-icon-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Clean Control Strip: Language + Voice Audio */}
              <div className="cw2-toolbar">
                <div className="cw2-lang-pill" title="Select preferred reply language">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <select
                    aria-label="Chat language"
                    value={lang}
                    onChange={(e) => changeLang(e.target.value)}
                    className="cw2-lang-select"
                  >
                    {LANGS.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={toggleVoiceOut}
                  aria-pressed={voiceOut}
                  title={voiceOut ? "Turn off voice read-aloud" : "Turn on voice & read aloud"}
                  className={`cw2-voice-toggle ${voiceOut ? "active" : ""}`}
                >
                  {voiceOut ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  )}
                  <span>{voiceOut ? "Voice On" : "Voice Off"}</span>
                </button>
              </div>

              {!token ? (
                <form onSubmit={startChat} className="cw2-onboard">
                  <div>
                    <div className="cw2-welcome-card">
                      <span className="cw2-badge">⚡ Instant AI + Expert Support</span>
                      <h3 className="cw2-welcome-h">Welcome! Let’s get started</h3>
                      <p className="cw2-welcome-p">
                        Share your details once to explore Cloud, Dedicated Servers, Security, and tailored solutions.
                      </p>
                    </div>

                    <div className="cw2-form-fields">
                      <div className="cw2-input-group">
                        <span className="cw2-input-icon" aria-hidden="true">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </span>
                        <input
                          className="cw2-field"
                          placeholder="Full name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="cw2-input-group">
                        <span className="cw2-input-icon" aria-hidden="true">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="3" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        </span>
                        <input
                          className="cw2-field"
                          type="email"
                          placeholder="Email address"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="cw2-input-group">
                        <span className="cw2-input-icon" aria-hidden="true">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </span>
                        <input
                          className="cw2-field"
                          type="tel"
                          placeholder="Phone / WhatsApp number"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          required
                        />
                      </div>

                      {error && (
                        <p
                          style={{
                            margin: "2px 0 0 0",
                            padding: "8px 11px",
                            borderRadius: "10px",
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#dc2626",
                            fontSize: "12px",
                          }}
                        >
                          {error}
                        </p>
                      )}

                      <button disabled={busy} className="cw2-primary-btn">
                        <span>{busy ? "Starting conversation…" : "Start Conversation"}</span>
                        {!busy && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="cw2-trust-note">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Private &amp; encrypted · Instant 24×7 assistance</span>
                  </p>
                </form>
              ) : (
                <>
                  {/* Messages Area */}
                  <div className="cw2-stream">
                    {msgs.map((m) => {
                      const isSpeaking = speakingId === m.id;
                      return m.role === "user" ? (
                        <div key={m.id} className="cw2-row-user">
                          <div
                            onClick={() => handleMessageClick(m)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleMessageClick(m);
                              }
                            }}
                            title={isSpeaking ? "Click to stop speaking" : "Click to hear your question aloud"}
                            className={`cw2-bubble-user ${isSpeaking ? "speaking" : ""}`}
                          >
                            {renderRichMessage(m.content, true)}
                            <span className={`cw2-msg-voice user ${isSpeaking ? "active" : ""}`}>
                              {isSpeaking ? (
                                <>
                                  <span className="cw2-eq" aria-hidden="true">
                                    <i />
                                    <i />
                                    <i />
                                  </span>
                                  <span>Speaking · Tap to stop</span>
                                </>
                              ) : (
                                <>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                  </svg>
                                  <span>Listen</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div key={m.id} className="cw2-row-bot">
                          <div className={`cw2-mini-avatar ${m.role === "admin" ? "admin" : ""}`} aria-hidden="true">
                            {m.role === "admin" ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3l1.9 3.8L18 8.7l-3 2.9.7 4.1L12 13.8l-3.7 1.9.7-4.1-3-2.9 4.1-1.9L12 3z" />
                              </svg>
                            )}
                          </div>

                          <div
                            onClick={() => handleMessageClick(m)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleMessageClick(m);
                              }
                            }}
                            title={isSpeaking ? "Click to stop speaking" : "Click to hear this answer aloud"}
                            className={`cw2-bubble-bot ${m.role === "admin" ? "admin" : ""} ${isSpeaking ? "speaking" : ""}`}
                          >
                            {m.role === "admin" && <span className="cw2-admin-tag">✓ Team Specialist</span>}
                            {renderRichMessage(m.content, false)}
                            <span className={`cw2-msg-voice ${isSpeaking ? "active" : ""}`}>
                              {isSpeaking ? (
                                <>
                                  <span className="cw2-eq" aria-hidden="true">
                                    <i />
                                    <i />
                                    <i />
                                  </span>
                                  <span>Speaking · Tap to stop</span>
                                </>
                              ) : (
                                <>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                  </svg>
                                  <span>Listen</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {msgs.length <= 1 && !busy && (
                      <div className="cw2-prompts-box">
                        <p className="cw2-prompts-label">Suggested Topics</p>
                        <div className="cw2-prompts-grid">
                          {QUICK_PROMPTS.map((q) => (
                            <button key={q} type="button" onClick={() => void sendText(q)} className="cw2-chip">
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {busy && (
                      <div className="cw2-row-bot">
                        <div className="cw2-mini-avatar" aria-hidden="true">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3l1.9 3.8L18 8.7l-3 2.9.7 4.1L12 13.8l-3.7 1.9.7-4.1-3-2.9 4.1-1.9L12 3z" />
                          </svg>
                        </div>
                        <div className="cw2-typing" aria-label="Assistant is typing">
                          <span className="cw2-dot" />
                          <span className="cw2-dot" />
                          <span className="cw2-dot" />
                        </div>
                      </div>
                    )}

                    <div ref={endRef} />
                  </div>

                  {error && <p className="cw2-err">{error}</p>}

                  {/* Unified Capsule Input & Voice Bar */}
                  <form onSubmit={send} className="cw2-composer-wrap">
                    <div className="cw2-composer">
                      {micOk && (
                        <button
                          type="button"
                          onClick={toggleMic}
                          aria-pressed={listening}
                          aria-label={listening ? "Stop voice input" : "Speak question or command"}
                          title='Speak message or command ("close chat", "voice on", "mute")'
                          className={`cw2-mic-btn ${listening ? "listening" : ""}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="22" />
                          </svg>
                        </button>
                      )}

                      <input
                        className="cw2-chat-input"
                        placeholder={listening ? "Listening to your voice…" : "Ask about Cloud, Servers, pricing…"}
                        value={input}
                        maxLength={1000}
                        onChange={(e) => setInput(e.target.value)}
                      />

                      <button
                        type="submit"
                        disabled={busy || !input.trim()}
                        aria-label="Send message"
                        title="Send message"
                        className="cw2-send-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Draggable Floating Launcher Orb */}
      <button
        type="button"
        onPointerDown={onBubbleDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={(e) => {
          if (e.detail === 0) setOpen((v) => !v);
        }}
        aria-label={open ? "Close chat" : "Open chat"}
        title="Drag to move anywhere · Click to open/close"
        style={{ left: bubblePos.x, top: bubblePos.y, width: BUBBLE, height: BUBBLE }}
        className="cw2-root cw2-launcher"
      >
        {!open && <span className="cw2-launcher-badge" aria-hidden="true" />}
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </>
  );
}

export default ChatWidget;