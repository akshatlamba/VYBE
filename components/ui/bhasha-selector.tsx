"use client";

import React, { useState, useEffect } from "react";
import { BHASHA_LANGUAGES, LanguageConfig, getLanguage } from "@/lib/bhasha/languages";
import { bhashaVoice } from "@/lib/bhasha/voice-service";
import { Mic, MicOff, Volume2, VolumeX, Globe, AlertCircle, Check } from "lucide-react";

interface BhashaSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (langCode: string) => void;
  onVoiceInput?: (transcript: string) => void;
  textToSpeak?: string;
  className?: string;
}

export function BhashaSelector({
  selectedLanguage,
  onSelectLanguage,
  onVoiceInput,
  textToSpeak,
  className = "",
}: BhashaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentLang = getLanguage(selectedLanguage);
  const sttCheck = bhashaVoice.isSTTSupported(selectedLanguage);
  const ttsCheck = bhashaVoice.isTTSSupported(selectedLanguage);

  useEffect(() => {
    return () => {
      bhashaVoice.stopListening();
      bhashaVoice.stopSpeaking();
    };
  }, []);

  const handleToggleListening = () => {
    setErrorMessage(null);

    if (isListening) {
      bhashaVoice.stopListening();
      setIsListening(false);
      return;
    }

    if (!sttCheck.supported) {
      setErrorMessage(sttCheck.reason || "Voice input unsupported for this language in this browser.");
      return;
    }

    const started = bhashaVoice.startListening(
      selectedLanguage,
      (res) => {
        if (onVoiceInput) {
          onVoiceInput(res.transcript);
        }
      },
      (err) => {
        setErrorMessage(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  const handleToggleSpeaking = () => {
    if (!textToSpeak) return;

    if (isSpeaking) {
      bhashaVoice.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (!ttsCheck.supported) {
      setErrorMessage(ttsCheck.reason || "Audio synthesis unsupported for this language.");
      return;
    }

    setIsSpeaking(true);
    bhashaVoice.speak(textToSpeak, selectedLanguage, () => {
      setIsSpeaking(false);
    });
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Language Selector Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/10 text-caption font-semibold text-[#1E1E22] dark:text-white border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/15 transition-all btn-press shadow-xs"
            title="VYBE Bhasha: 22 Scheduled Indian Languages"
          >
            <Globe className="w-3.5 h-3.5 text-[#2F6BFF]" />
            <span>{currentLang.nativeName}</span>
            <span className="text-[11px] text-gray-400 font-normal">({currentLang.name})</span>
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl glass-surface bg-white/95 dark:bg-[#1E1E24]/95 p-2 shadow-2xl border border-white/60 dark:border-white/10 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-black/5 dark:border-white/5">
                VYBE Bhasha · 22 Scheduled Languages
              </div>
              <div className="flex flex-col gap-0.5 mt-1">
                {BHASHA_LANGUAGES.map((lang) => {
                  const isSelected = lang.code === selectedLanguage;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setIsOpen(false);
                        setErrorMessage(null);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-[#1E1E22] text-white dark:bg-white dark:text-[#1E1E22] font-semibold"
                          : "hover:bg-black/5 dark:hover:bg-white/5 text-[#1E1E22] dark:text-gray-200"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-small font-medium">{lang.nativeName}</span>
                        <span className="text-[10px] text-gray-400">{lang.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {lang.sttSupport === "supported" && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#5BAE75]/20 text-[#2B7343] dark:text-[#78C991] font-bold">
                            Voice
                          </span>
                        )}
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Voice Input (STT) Button */}
        <button
          type="button"
          onClick={handleToggleListening}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-semibold transition-all btn-press shadow-xs ${
            isListening
              ? "bg-[#E0605E] text-white animate-pulse"
              : sttCheck.supported
              ? "bg-black/5 dark:bg-white/10 text-[#1E1E22] dark:text-white hover:bg-black/10 dark:hover:bg-white/15"
              : "opacity-50 cursor-not-allowed bg-black/5 dark:bg-white/5 text-gray-400"
          }`}
          title={
            sttCheck.supported
              ? isListening
                ? "Listening... Click to stop."
                : `Voice input in ${currentLang.nativeName}`
              : sttCheck.reason
          }
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Voice Input</span>
            </>
          )}
        </button>

        {/* Spoken Output (TTS) Button */}
        {textToSpeak && (
          <button
            type="button"
            onClick={handleToggleSpeaking}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-semibold transition-all btn-press shadow-xs ${
              isSpeaking
                ? "bg-[#2F6BFF] text-white"
                : ttsCheck.supported
                ? "bg-black/5 dark:bg-white/10 text-[#1E1E22] dark:text-white hover:bg-black/10 dark:hover:bg-white/15"
                : "opacity-50 cursor-not-allowed bg-black/5 dark:bg-white/5 text-gray-400"
            }`}
            title={
              ttsCheck.supported
                ? isSpeaking
                  ? "Playing audio... Click to stop."
                  : `Read aloud in ${currentLang.nativeName}`
                : ttsCheck.reason
            }
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Read Aloud</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Voice Warning / Error State */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#E7A23C]/10 border border-[#E7A23C]/20 text-[#7D4F0E] dark:text-[#E7A23C] text-[11px] animate-in fade-in duration-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto font-bold text-caption hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
