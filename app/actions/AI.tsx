"use server";

import { createAI, getMutableAIState, streamUI, createStreamableValue } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { streamMulti } from "ai-stream-multi";
import { Spinner } from "@/components/common/spinner";

import { createInformAI, AssistantMessage } from "inform-ai";
import { CoreMessage, generateId } from "ai";

export async function submitUserMessage(messages: ClientMessage[]) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  //add the new messages to the AI State so the user can refresh and not lose the context
  aiState.update({
    ...aiState.get(),
    messages: [...aiState.get().messages, ...messages],
  });

  //set up our streaming LLM response, with a couple of tools, a prompt and some onSegment logic
  //to add any tools and text responses from the LLM to the AI State
  const result = await streamMulti({
    model: openai("gpt-4o-2024-08-06"),
    initial: <Spinner />,
    system: `\
    You are a helpful assistant who can help a user to navigate through information they
    are seeing on their screen. The user interface that that user is looking at has a collection
    of components that can send events and have states. The user can interact with the components,
    and the components can send events to the assistant. Messages sent from components will usually
    have a unique componentId, may have a human-friendly name, may also have a self-description that
    is intended to help you understand what the component does
    
    Components can also send events, which are messages that describe something that happened in the
    interface, like the user clicking something, or some other event.
    
    All messages from components will be sent via the system role in this conversation.`,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    textComponent: AssistantMessage,
    onSegment: (segment: any) => {
      if (segment.type === "tool-call") {
        const { args, toolName } = segment.toolCall;

        const toolCallId = generateId();

        const toolCall = {
          id: generateId(),
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolName,
              toolCallId,
              args,
            },
          ],
        } as ClientMessage;

        const toolResult = {
          id: generateId(),
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolName,
              toolCallId,
              result: args,
            },
          ],
        } as ClientMessage;

        aiState.update({
          ...aiState.get(),
          messages: [...aiState.get().messages, toolCall, toolResult],
        });
      } else if (segment.type === "text") {
        const text = segment.text;

        const textMessage = {
          id: generateId(),
          role: "assistant",
          content: text,
        } as ClientMessage;

        aiState.update({
          ...aiState.get(),
          messages: [...aiState.get().messages, textMessage],
        });
      }
    },
    onFinish: () => {
      aiState.done(aiState.get());
    },
    tools: {
      // firewallTable: FirewallsTableTool,
    },
  });

  return {
    id: generateId(),
    content: result.ui.value,
  };
}

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

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [] as UIState,
  initialAIState: { chatId: generateId(), messages: [] } as AIState,
});

export const InformAI = createInformAI({
  // vercel: AI,
  onEvent: (message: string) => {
    // Custom logic to send a message to an LLM
    //this is happening on the server
    console.log(`Custom send message: ${message}`);
    console.log(JSON.stringify(message, null, 4));
  },
});
