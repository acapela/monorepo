export interface TranscriptWord {
  text: string;
  start_time: number;
  end_time: number;
}

export interface TranscriptSpeakerPart {
  speaker: string;
  start_time: number;
  end_time: number;
  words: TranscriptWord[];
}

export interface SonixTranscriptData {
  name: string;
  transcript: TranscriptSpeakerPart[];
}

export type TranscriptData = TranscriptSpeakerPart[];
