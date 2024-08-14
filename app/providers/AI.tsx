"use server";

import { CoreMessage, generateId } from "ai";
import { createInformAI } from "inform-ai";
import { createAI } from "ai/rsc";
import { submitUserMessage } from "../actions/AI";

export type ClientMessage = CoreMessage & {
  id: string;
};

export type AIState = {
  chatId: string;
  messages: ClientMessage[];
};

export type UIState = {
  id: string;
  role?: string;
  content: React.ReactNode;
}[];

export const AIProvider = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [] as UIState,
  initialAIState: { chatId: generateId(), messages: [] } as AIState,
});

export const InformAIProvider = createInformAI({
  onEvent: (message: string) => {
    // Custom logic to send a message to an LLM
    //this is happening on the server
    console.log(`Custom send message: ${message}`);
    console.log(JSON.stringify(message, null, 4));
  },
});

export default async function AIProviders({ children }: { children: React.ReactNode }) {
  return (
    <AIProvider>
      <InformAIProvider>{children}</InformAIProvider>
    </AIProvider>
  );
}
