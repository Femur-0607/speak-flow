// Web Speech API wrapper for Text-to-Speech (TTS) and Speech-to-Text (STT)

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isRecognizing = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
      
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  // Speak text with chosen language and speed
  public speak(
    text: string,
    lang: 'ja' | 'en',
    rate: number = 1.0,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.synth) {
      onError?.(new Error('TTS not supported in this browser'));
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ja' ? 'ja-JP' : 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick best native voice if available
    const voices = this.synth.getVoices();
    const targetLangCode = lang === 'ja' ? 'ja' : 'en';
    const matchedVoice = voices.find(
      (v) => v.lang.toLowerCase().startsWith(targetLangCode) && (v.localService || v.name.includes('Natural') || v.name.includes('Google'))
    ) || voices.find((v) => v.lang.toLowerCase().startsWith(targetLangCode));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
    }
    if (onError) {
      utterance.onerror = (e) => onError(e);
    }

    this.synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Check if STT is supported
  public isSpeechRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  // Start listening to microphone
  public startListening(
    lang: 'ja' | 'en',
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech Recognition is not supported on this browser. Chrome or Edge is recommended.');
      return;
    }

    if (this.isRecognizing) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }

    this.recognition.lang = lang === 'ja' ? 'ja-JP' : 'en-US';

    this.recognition.onstart = () => {
      this.isRecognizing = true;
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript.trim(), true);
      } else if (interimTranscript) {
        onResult(interimTranscript.trim(), false);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isRecognizing = false;
      let msg = event.error || '음성 인식 오류가 발생했습니다.';
      if (event.error === 'not-allowed') {
        msg = '마이크 사용 권한이 차단되어 있습니다. 브라우저 주소창 좌측에서 마이크 권한을 허용해 주세요.';
      } else if (event.error === 'no-speech') {
        msg = '말씀하신 음성이 감지되지 않았습니다. 마이크에 대고 다시 말씀해 주세요.';
      }
      onError(msg);
    };

    this.recognition.onend = () => {
      this.isRecognizing = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      this.isRecognizing = false;
      onError(e.message || '마이크를 시작할 수 없습니다.');
    }
  }

  public stopListening() {
    if (this.recognition && this.isRecognizing) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isRecognizing = false;
    }
  }
}

export const speechService = new SpeechService();
