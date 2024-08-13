"use client";

import type { AI } from "@/app/actions/AI";

import { useActions, useUIState } from "ai/rsc";
import { generateId } from "ai";
import clsx from "clsx";

import { Messages, UserMessage, ChatBox, useInformAIContext, dedupeMessages, mapComponentMessages } from "inform-ai";

export function ChatWrapper({ className }: { className?: string }) {
  const { submitUserMessage } = useActions();
  const { popRecentMessages } = useInformAIContext();
  const [messages, setMessages] = useUIState<typeof AI>();

  async function onMessage(message: string) {
    const componentMessages = popRecentMessages();

    //deduped set of component-generated messages like state updates and events, since the last user message
    const newSystemMessages = mapComponentMessages(dedupeMessages(componentMessages));

    //this is the new user message that will be sent to the AI
    const newUserMessage = { id: generateId(), content: message, role: "user" };

    //the new user message UI that will be added to the chat history
    const newUserMessageUI = { ...newUserMessage, content: <UserMessage message={message} /> };
    setMessages([...messages, ...newSystemMessages, newUserMessageUI]);

    //send the new user message to the AI, along with the all the recent messages from components
    const responseMessage = await submitUserMessage([...newSystemMessages, newUserMessage]);

    //update the UI with whatever the AI responded with
    setMessages((currentMessages) => [...currentMessages, { ...responseMessage, role: "assistant" }]);

    //return true to clear the chat box
    return true;
  }

  return (
    <div className={clsx("flex flex-col border border-slate-200 rounded-md p-1 bg-white gap-1", className)}>
      <Messages messages={messages} />
      <ChatBox onSubmit={onMessage} />
    </div>
  );
}
