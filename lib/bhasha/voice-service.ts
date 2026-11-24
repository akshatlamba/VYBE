// ==============================================================================
// VYBE Bhasha: Voice Service (Speech-to-Text & Text-to-Speech)
// Uses browser-native Web Speech API (SpeechRecognition & SpeechSynthesis)
// Features graceful capability detection, permission state handling & honest reporting
// ==============================================================================

import { getLanguage } from "./languages";

export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
}

export class BhashaVoiceService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  /**
   * Check whether Speech-to-Text (STT) is supported in the current environment
   */
  public isSTTSupported(langCode: string): { supported: boolean; reason?: string } {
    if (typeof window === "undefined" || !this.recognition) {
      return {
        supported: false,
        reason: "Speech Recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.",
      };
    }

    const lang = getLanguage(langCode);
    if (!lang.sttLocale) {
      return {
        supported: false,
        reason: `${lang.name} (${lang.nativeName}) voice input is not supported by standard browser speech engines. Text input remains available.`,
      };
    }

    return { supported: true };
  }

  /**
   * Check whether Text-to-Speech (TTS) is supported for the language
   */
  public isTTSSupported(langCode: string): { supported: boolean; reason?: string } {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return {
        supported: false,
        reason: "Speech Synthesis is not supported in this browser.",
      };
    }

    const lang = getLanguage(langCode);
    if (!lang.ttsLocale) {
      return {
        supported: false,
        reason: `Speech audio is not available for ${lang.name} in this browser.`,
      };
    }

    return { supported: true };
  }

  /**
   * Start listening for voice input in the selected language
   */
  public startListening(
    langCode: string,
    onResult: (result: SpeechRecognitionResultPayload) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    const check = this.isSTTSupported(langCode);
    if (!check.supported) {
      onError(check.reason || "Speech recognition unsupported.");
      return false;
    }

    try {
      const lang = getLanguage(langCode);
      this.recognition.lang = lang.sttLocale || "en-IN";

      this.recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        onResult({
          transcript: finalTranscript || interimTranscript,
          isFinal: Boolean(finalTranscript),
        });
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        let msg = "Microphone error";
        if (event.error === "not-allowed") {
          msg = "Microphone access denied. Please grant permission in browser settings.";
        } else if (event.error === "no-speech") {
          msg = "No speech detected. Please speak into your microphone.";
        } else if (event.error === "network") {
          msg = "Speech recognition network error. Please verify your connection.";
        }
        onError(msg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      this.isListening = false;
      onError(err.message || "Failed to start voice recognition.");
      return false;
    }
  }

  /**
   * Stop listening
   */
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }

  /**
   * Speak response text in the selected language
   */
  public speak(
    text: string,
    langCode: string,
    onEnd?: () => void
  ): boolean {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return false;
    }

    const check = this.isTTSSupported(langCode);
    if (!check.supported) {
      return false;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech

      // Clean markdown tags for spoken audio
      const cleanText = text
        .replace(/(\*\*|__)(.*?)\1/g, "$2")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/#/g, "")
        .slice(0, 1000); // Guard max speech chunk length

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const lang = getLanguage(langCode);
      utterance.lang = lang.ttsLocale || "en-IN";
      utterance.rate = 0.95; // Slightly slower for clear student comprehension

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Stop any active speech synthesis
   */
  public stopSpeaking(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const bhashaVoice = new BhashaVoiceService();
