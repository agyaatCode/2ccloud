/**
 * FILE: src/lib/chat-lang.ts
 * TYPE: Shared helper (safe to import in BOTH client and server code; no server-only imports)
 * PURPOSE:
 *   - Supported chat languages (Auto, English, Hindi, Hinglish, Japanese, and more)
 *   - Speech-recognition & speech-synthesis BCP-47 locales for voice input / voice output
 *   - Prompt language description for OpenAI
 *   - Localized greeting message shown when a new chat session starts
 */

export type LangOpt = {
  code: string; // value stored in localStorage and sent to the API
  label: string; // label shown inside the language selector dropdown
  name: string; // language instruction passed to OpenAI ("" = auto-detect from visitor message)
  speech: string; // BCP-47 locale for browser voice recognition & text-to-speech
};

export const LANGS: LangOpt[] = [
  { code: "auto", label: "Auto", name: "", speech: "" },
  { code: "en", label: "English", name: "English", speech: "en-IN" },
  { code: "hi", label: "हिन्दी", name: "Hindi (Devanagari script)", speech: "hi-IN" },
  {
    code: "hinglish",
    label: "Hinglish",
    name: "Hinglish (natural conversational Hindi written in English/Roman letters mixed with common technical English terms)",
    speech: "en-IN",
  },
  { code: "ja", label: "日本語", name: "Japanese (polite natural Desu/Masu form)", speech: "ja-JP" },
  { code: "es", label: "Español", name: "Spanish", speech: "es-ES" },
  { code: "fr", label: "Français", name: "French", speech: "fr-FR" },
  { code: "de", label: "Deutsch", name: "German", speech: "de-DE" },
  { code: "pt", label: "Português", name: "Portuguese", speech: "pt-BR" },
  { code: "ru", label: "Русский", name: "Russian", speech: "ru-RU" },
  { code: "ar", label: "العربية", name: "Arabic", speech: "ar-SA" },
  { code: "zh", label: "中文", name: "Chinese (Simplified)", speech: "zh-CN" },
  { code: "ko", label: "한국어", name: "Korean", speech: "ko-KR" },
  { code: "it", label: "Italiano", name: "Italian", speech: "it-IT" },
  { code: "tr", label: "Türkçe", name: "Turkish", speech: "tr-TR" },
  { code: "id", label: "Bahasa Indonesia", name: "Indonesian", speech: "id-ID" },
  { code: "bn", label: "বাংলা", name: "Bengali", speech: "bn-IN" },
  { code: "ta", label: "தமிழ்", name: "Tamil", speech: "ta-IN" },
  { code: "te", label: "తెలుగు", name: "Telugu", speech: "te-IN" },
  { code: "mr", label: "मराठी", name: "Marathi", speech: "mr-IN" },
  { code: "gu", label: "ગુજરાતી", name: "Gujarati", speech: "gu-IN" },
  { code: "pa", label: "ਪੰਜਾਬੀ", name: "Punjabi", speech: "pa-IN" },
  { code: "ur", label: "اردو", name: "Urdu", speech: "ur-PK" },
];

export const langByCode = (code: string): LangOpt => LANGS.find((l) => l.code === code) ?? LANGS[0];

/** Greeting displayed when a new chat session starts (falls back to English). */
export function greeting(code: string, firstName: string): string {
  const g: Record<string, string> = {
    en: `Hi ${firstName}! 👋 Ask me anything about Cloud, Physical Servers, Security, DevOps, or our services.`,
    hi: `नमस्ते ${firstName}! 👋 क्लाउड, फिजिकल सर्वर, सिक्योरिटी, DevOps या हमारी सेवाओं के बारे में बेझिझक पूछिए।`,
    hinglish: `Hi ${firstName}! 👋 Cloud, Physical Server, Security, DevOps ya hamari services ke baare me kuch bhi poochiye.`,
    ja: `こんにちは、${firstName}さん！👋 クラウド、物理サーバー、セキュリティ、DevOps、または当社のサービスについて何でもお気軽にご質問ください。`,
    es: `¡Hola ${firstName}! 👋 Pregúntame sobre nube, servidores físicos, seguridad, DevOps o nuestros servicios.`,
    fr: `Bonjour ${firstName} ! 👋 Posez-moi vos questions sur le cloud, les serveurs physiques, la sécurité, le DevOps ou nos services.`,
    de: `Hallo ${firstName}! 👋 Fragen Sie mich alles zu Cloud, physischen Servern, Sicherheit, DevOps oder unseren Services.`,
  };
  return g[code] ?? g.en;
}
