// src/design/pages/AiPage.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  ConfirmDialog,
  DateTime,
  DateTimeFormats,
  TextArea,
} from "../../../design/components";
import { useToast, useLoading } from "../../../contexts";
import { AppLocales, useTranslate } from "../../../locales";
import { iconsLib } from "../../../assets";
import AiController from "../ai.controller";
import { AI_SOCKET_EVENTS, getMessageAudioUrl, IMessage } from "..";
import { SPEECH_LISTEN_RESULTS, useLiveSpeech } from "../../speech";
import { ADMIN_CHAT_ROLES } from "../../admin";
import { ButtonSizes, ButtonVariants } from "../../../design";
import { getUtcNowIso } from "../../../helpers";

export const AiPage: React.FC = () => {
  const t = useTranslate();
  const { success, error, info } = useToast();
  const { isLoading, setLoading } = useLoading();
  const {
    liveText,
    voiceLevel,
    isListenSessionActive,
    isPlaying,
    startListening,
    stopListening,
    playUrl,
    stopPlayback,
  } = useLiveSpeech();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isMicDialogOpen, setIsMicDialogOpen] = useState(false);
  const [activeTtsMessageId, setActiveTtsMessageId] = useState<string | null>(
    null,
  );
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const textBeforeListenRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const greeting = t(AppLocales.Ai.DefaultGreeting);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadHistory = useCallback(async () => {
    const result = await AiController.loadHistory(null);

    if (result.success) {
      if (result.messages.length === 0) {
        setMessages([
          {
            id: "welcome",
            role: ADMIN_CHAT_ROLES.ASSISTANT,
            content: greeting,
            created_at: getUtcNowIso(),
          },
        ]);
      } else {
        setMessages(result.messages);
      }
      setIsProcessing(result.processing);
    } else {
      console.error("Failed to load history:", result.error);
      setMessages([
        {
          id: "welcome",
          role: ADMIN_CHAT_ROLES.ASSISTANT,
          content: greeting,
          created_at: getUtcNowIso(),
        },
      ]);
      setIsProcessing(false);
    }
  }, [greeting]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHistory();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadHistory]);

  useEffect(() => {
    const unsubscribe = AiController.subscribeToAiMessages((eventType) => {
      void loadHistory();
      if (
        eventType === AI_SOCKET_EVENTS.TTS_READY ||
        eventType === AI_SOCKET_EVENTS.TTS_FAILED
      ) {
        setActiveTtsMessageId(null);
      }
    });
    return unsubscribe;
  }, [loadHistory]);

  useEffect(() => {
    if (!isPlaying) {
      setPlayingMessageId(null);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isListenSessionActive) {
      setInput(liveText);
    }
  }, [isListenSessionActive, liveText]);

  const handleListenResult = (result: string) => {
    if (
      result === SPEECH_LISTEN_RESULTS.STARTED ||
      result === SPEECH_LISTEN_RESULTS.ALREADY_LISTENING
    ) {
      return;
    }

    if (result === SPEECH_LISTEN_RESULTS.PERMISSION_DENIED) {
      setIsMicDialogOpen(true);
      return;
    }

    if (result === SPEECH_LISTEN_RESULTS.DISCONNECTED) {
      error(t(AppLocales.Ai.TranscriptionFailed));
      return;
    }

    error(t(AppLocales.Ai.StartRecordingFailed));
  };

  const handleStartListening = async () => {
    if (isLoading || isProcessing || isListenSessionActive) {
      return;
    }

    textBeforeListenRef.current = input;
    const result = await startListening({ seed: input });
    handleListenResult(result);
  };

  const handleStopListening = async () => {
    await stopListening();
  };

  const handleCancelListening = async () => {
    await stopListening();
    setInput(textBeforeListenRef.current);
  };

  const handleMicPermissionConfirm = async () => {
    setIsMicDialogOpen(false);
    const result = await startListening({ seed: textBeforeListenRef.current });
    handleListenResult(result);
  };

  const isTtsDisabledForMessage = (messageId: string) => {
    if (isListenSessionActive) {
      return true;
    }

    return Boolean(activeTtsMessageId && activeTtsMessageId !== messageId);
  };

  const handleTtsTap = async (message: IMessage) => {
    if (isTtsDisabledForMessage(message.id)) {
      return;
    }

    if (playingMessageId === message.id && isPlaying) {
      stopPlayback();
      setPlayingMessageId(null);
      return;
    }

    stopPlayback();
    setPlayingMessageId(null);

    const audioUrl = getMessageAudioUrl(message);
    if (audioUrl) {
      try {
        await playUrl(audioUrl);
        setPlayingMessageId(message.id);
      } catch {
        error(t(AppLocales.Ai.TtsFailed));
      }
      return;
    }

    if (!message.content.trim()) {
      error(t(AppLocales.Ai.TtsEmpty));
      return;
    }

    setActiveTtsMessageId(message.id);
    const result = await AiController.queueTextToSpeech(message.id);

    if (result.success) {
      if (result.message) {
        info(result.message);
      }
      return;
    }

    setActiveTtsMessageId(null);
    error(result.error || t(AppLocales.Ai.TtsFailed));
  };

  const renderTtsControl = (message: IMessage) => {
    if (
      message.role !== ADMIN_CHAT_ROLES.ASSISTANT ||
      !message.content.trim()
    ) {
      return null;
    }

    const isQueued = activeTtsMessageId === message.id;
    const isThisPlaying = playingMessageId === message.id && isPlaying;
    const hasAudio = Boolean(getMessageAudioUrl(message));
    const disabled = isTtsDisabledForMessage(message.id);

    if (isQueued) {
      return (
        <span className="loading loading-spinner loading-xs mt-2" aria-hidden />
      );
    }

    let Icon = iconsLib.speaker;
    if (isThisPlaying) {
      Icon = iconsLib.stop;
    } else if (hasAudio) {
      Icon = iconsLib.play;
    }

    return (
      <Button
        variant={ButtonVariants.TERTIARY}
        size={ButtonSizes.SM}
        className="mt-2 min-h-0 h-8 w-8 p-0"
        onClick={() => void handleTtsTap(message)}
        disabled={disabled}
        aria-label={t(AppLocales.Ai.Listen)}
        title={t(AppLocales.Ai.Listen)}
      >
        <Icon className="h-4 w-4" />
      </Button>
    );
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isProcessing || isListenSessionActive) {
      return;
    }

    const content = input.trim();
    setInput("");
    setLoading(true);

    const result = await AiController.chat(content, null);

    if (result.success && result.message) {
      setMessages((prev) => [
        ...prev.filter((message) => message.id !== "welcome"),
        result.message!,
      ]);
      setIsProcessing(true);
      success(t(AppLocales.Ai.Processing));
    } else {
      setInput(content);
      error(result.error || t(AppLocales.Ai.SendMessageFailed));
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isListenSessionActive) {
      e.preventDefault();
      return;
    }

    if (
      (e.key === "Enter" && !e.shiftKey) ||
      ((e.ctrlKey || e.metaKey) && e.key === "Enter")
    ) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleClearHistory = async () => {
    setIsClearDialogOpen(false);
    const result = await AiController.clearHistory(null);

    if (result.success) {
      success(t(AppLocales.Ai.ClearHistory));
      setMessages([
        {
          id: "welcome",
          role: ADMIN_CHAT_ROLES.ASSISTANT,
          content: greeting,
          created_at: getUtcNowIso(),
        },
      ]);
    } else {
      error(result.error || t(AppLocales.Ai.Errors.ClearHistory));
    }
  };

  const canListen = !isLoading && !isProcessing && !isListenSessionActive;

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between py-4 border-b border-base-200">
          <div className="w-24" />
          <div className="text-center flex-1">
            <h1 className="text-h2 font-semibold">{t(AppLocales.Ai.Title)}</h1>
          </div>
          <div className="w-24 flex justify-end">
            {messages.length > 1 && (
              <Button
                variant={ButtonVariants.TERTIARY}
                size={ButtonSizes.SM}
                onClick={() => setIsClearDialogOpen(true)}
              >
                {t(AppLocales.Ai.ClearHistory)}
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === ADMIN_CHAT_ROLES.USER
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-md p-3 ${
                  message.role === ADMIN_CHAT_ROLES.USER
                    ? "bg-primary text-primary-content"
                    : "bg-base-200"
                }`}
              >
                <p className="text-body-m whitespace-pre-wrap">
                  {message.content}
                </p>
                <span className="text-caption opacity-50 mt-1 block">
                  <DateTime value={message.created_at} format={DateTimeFormats.TIME} />
                </span>
                {message.metadata?.status === "failed" && (
                  <span className="text-caption text-error mt-1 block">
                    {t(AppLocales.Ai.Errors.GetResponse)}
                  </span>
                )}
                {renderTtsControl(message)}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-md p-3 bg-base-200">
                <p className="text-body-m">{t(AppLocales.Ai.Thinking)}</p>
                <span className="loading loading-dots loading-sm mt-1" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-base-200 p-4">
          <div className="flex gap-2">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isProcessing
                  ? t(AppLocales.Ai.Processing)
                  : t(AppLocales.Ai.TypeMessage)
              }
              rows={3}
              className="flex-1"
              disabled={isLoading || isProcessing}
              readOnly={isListenSessionActive}
              showCounter
              maxLength={2000}
            />
            <div className="flex flex-col gap-2 self-end">
              {isListenSessionActive ? (
                <>
                  <Button
                    variant={ButtonVariants.SECONDARY}
                    size={ButtonSizes.SM}
                    onClick={() => void handleStopListening()}
                    aria-label={t(AppLocales.Ai.Listen)}
                    title={t(AppLocales.Ai.Listen)}
                  >
                    <iconsLib.stop className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={ButtonVariants.TERTIARY}
                    size={ButtonSizes.SM}
                    onClick={() => void handleCancelListening()}
                    aria-label={t(AppLocales.Ai.CancelListening)}
                    title={t(AppLocales.Ai.CancelListening)}
                  >
                    <iconsLib.close className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button
                  variant={ButtonVariants.TERTIARY}
                  size={ButtonSizes.SM}
                  onClick={() => void handleStartListening()}
                  disabled={!canListen}
                  aria-label={t(AppLocales.Ai.Listen)}
                  title={t(AppLocales.Ai.Listen)}
                >
                  <iconsLib.microphone className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant={ButtonVariants.PRIMARY}
                onClick={() => void handleSend()}
                isLoading={isLoading}
                disabled={
                  isLoading ||
                  isProcessing ||
                  isListenSessionActive ||
                  !input.trim()
                }
              >
                {t(AppLocales.Ai.Send)}
              </Button>
            </div>
          </div>
          {isListenSessionActive && (
            <div
              className="mt-2 flex h-6 items-end justify-center gap-1"
              aria-hidden
            >
              {[0.3, 0.55, 1, 0.55, 0.3].map((weight, index) => (
                <span
                  key={index}
                  className="w-1 rounded-sm bg-primary transition-[height] duration-100 ease-out"
                  style={{
                    height: `${2 + Math.round(voiceLevel * weight * 22)}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={handleClearHistory}
        title={t(AppLocales.Ai.ClearHistory)}
        message={t(AppLocales.Ai.ClearHistoryConfirm)}
        confirmLabel={t(AppLocales.Ai.ClearHistory)}
        cancelLabel={t(AppLocales.Common.Cancel)}
        isDestructive={true}
      />

      <ConfirmDialog
        isOpen={isMicDialogOpen}
        onClose={() => setIsMicDialogOpen(false)}
        onConfirm={() => void handleMicPermissionConfirm()}
        title={t(AppLocales.Ai.MicPermissionTitle)}
        message={t(AppLocales.Ai.MicPermissionMessage)}
        confirmLabel={t(AppLocales.Ai.Retry)}
        cancelLabel={t(AppLocales.Common.Cancel)}
        isDestructive={false}
      />
    </>
  );
};

export default AiPage;
