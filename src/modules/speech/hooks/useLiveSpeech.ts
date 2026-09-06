import { useCallback, useEffect, useState } from "react";
import SpeechController from "../speech.controller";
import type { ISpeechSnapshot, IStartListeningOptions } from "../types";
import type { TSpeechListenResult } from "../constants";

export const useLiveSpeech = () => {
  const [snapshot, setSnapshot] = useState<ISpeechSnapshot>(() =>
    SpeechController.getSnapshot(),
  );

  useEffect(() => {
    return SpeechController.subscribe(() => {
      setSnapshot(SpeechController.getSnapshot());
    });
  }, []);

  useEffect(() => {
    return () => {
      SpeechController.stopPlayback();
      void SpeechController.stopListening();
    };
  }, []);

  const startListening = useCallback(
    (options?: IStartListeningOptions): Promise<TSpeechListenResult> => {
      return SpeechController.startListening(options);
    },
    [],
  );

  const stopListening = useCallback((): Promise<void> => {
    return SpeechController.stopListening();
  }, []);

  const playUrl = useCallback((url: string): Promise<void> => {
    return SpeechController.playUrl(url);
  }, []);

  const stopPlayback = useCallback((): void => {
    SpeechController.stopPlayback();
  }, []);

  return {
    ...snapshot,
    startListening,
    stopListening,
    playUrl,
    stopPlayback,
  };
};
