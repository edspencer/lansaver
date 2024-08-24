"use client";

import { ChatWrapper } from "inform-ai";
import { useActions, useUIState } from "ai/rsc";

export function ChatBot({ className }: { className?: string }) {
  const { submitUserMessage } = useActions();
  const [messages, setMessages] = useUIState();

  return (
    <ChatWrapper
      className={className}
      submitUserMessage={submitUserMessage}
      messages={messages}
      setMessages={setMessages}
    />
  );
}
